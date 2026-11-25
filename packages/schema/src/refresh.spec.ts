import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { describe, it, expect, afterEach } from "vitest"

import { runRefresh } from "./refresh"

const FULL_SDL = `type Query {
	media: Media!
}
type Media {
	id: Int!
	title: String
	score: Int
}
`

const REDUCED_SDL = `type Query {
	media: Media!
}
type Media {
	id: Int!
	title: String
}
`

const artifactTmpDirs: string[] = []

afterEach(() => {
	for (const tmp of artifactTmpDirs.splice(0))
		rmSync(tmp, { recursive: true, force: true })
})

function makeArtifactDir(seed?: string): { artifact: string } {
	const tmp = mkdtempSync(join(tmpdir(), "schema-refresh-test-"))
	artifactTmpDirs.push(tmp)
	const artifact = join(tmp, "schema.graphql")
	if (seed !== undefined) writeFileSync(artifact, seed, "utf-8")
	return { artifact }
}

describe("runRefresh", () => {
	it("update refreshes the artifact; verify then passes", async () => {
		const { artifact } = makeArtifactDir(REDUCED_SDL)
		const fetchSDL = () => Promise.resolve(FULL_SDL)
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(update.exitCode).toBe(0)
		expect(update.changed).toBe(1)
		const written = readFileSync(artifact, "utf-8")
		expect(written).toContain("id: ID!")
		expect(written).not.toContain("id: Int!")

		const verify = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(verify.exitCode).toBe(0)
		expect(verify.message).toContain("no drift")
	})

	it("update is a no-op on an in-sync artifact (byte-identical round-trip)", async () => {
		const committedPath = join(
			import.meta.dirname,
			"..",
			"..",
			"..",
			"apps",
			"web",
			"schema.graphql"
		)
		const committed = readFileSync(committedPath, "utf-8")
		// the committed artifact's normalised ids: feed the fetch the same
		// schema with its normalisation reverted, as a fresh introspection
		// would report it raw
		const raw = committed.replace(/\bid: ID!/g, "id: Int!")
		const idCount = (committed.match(/^\s*id: ID!$/gm) ?? []).length
		const { artifact } = makeArtifactDir(committed)
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL: () => Promise.resolve(raw),
		})
		expect(update.exitCode).toBe(0)
		expect(update.changed).toBe(idCount)
		expect(update.message).toContain("up to date")
		expect(readFileSync(artifact, "utf-8")).toBe(committed)
	})

	it("update rewrites a drifted artifact with exactly the canonical bytes", async () => {
		const committedPath = join(
			import.meta.dirname,
			"..",
			"..",
			"..",
			"apps",
			"web",
			"schema.graphql"
		)
		const committed = readFileSync(committedPath, "utf-8").replace(
			/\r\n/g,
			"\n"
		)
		// the committed artifact's normalised ids: feed the fetch the same
		// schema with its normalisation reverted, as a fresh introspection
		// would report it raw
		const raw = committed.replace(/\bid: ID!/g, "id: Int!")
		const idCount = (committed.match(/^\s*id: ID!$/gm) ?? []).length
		const { artifact } = makeArtifactDir("garbage\n")
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL: () => Promise.resolve(raw),
		})
		expect(update.exitCode).toBe(0)
		expect(update.changed).toBe(idCount)
		const written = readFileSync(artifact, "utf-8")
		// the emitted artifact reproduces the committed format byte-for-byte
		expect(written.replace(/\r\n/g, "\n")).toBe(committed)
		expect(written).not.toContain("id: Int!")
		expect(written).toContain("activityId: Int!")
		expect(written).toContain("id: Int\n")
	})

	it("update writes the artifact when it does not exist yet", async () => {
		const { artifact } = makeArtifactDir()
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL: () => Promise.resolve(FULL_SDL),
		})
		expect(update.exitCode).toBe(0)
		expect(readFileSync(artifact, "utf-8")).toContain("id: ID!")
	})

	it("verify detects drift and leaves the artifact untouched", async () => {
		const { artifact } = makeArtifactDir(REDUCED_SDL)
		const fetchSDL = () => Promise.resolve(FULL_SDL)
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(update.exitCode).toBe(0)
		const bytesAfterUpdate = readFileSync(artifact, "utf-8")

		const verify = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(verify.exitCode).toBe(0)
		expect(readFileSync(artifact, "utf-8")).toBe(bytesAfterUpdate)

		// drift the artifact: a changed field type is still valid SDL
		const drifted = bytesAfterUpdate.replace("title: String", "title: Int")
		writeFileSync(artifact, drifted, "utf-8")
		const driftVerify = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(driftVerify.exitCode).toBe(1)
		expect(driftVerify.message).toContain("drift")
		expect(readFileSync(artifact, "utf-8")).toBe(drifted)

		// reintroduce a bare id: Int! and verify still fails
		const reintroduced = bytesAfterUpdate.replace("id: ID!", "id: Int!")
		writeFileSync(artifact, reintroduced, "utf-8")
		const driftVerify2 = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(driftVerify2.exitCode).toBe(1)
		expect(driftVerify2.message).toContain("drift")
		expect(readFileSync(artifact, "utf-8")).toBe(reintroduced)
	})

	it("verify fails cleanly when the artifact is missing", async () => {
		const { artifact } = makeArtifactDir()
		const verify = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL: () => Promise.resolve(FULL_SDL),
		})
		expect(verify.exitCode).toBe(1)
		expect(verify.message).toContain("not found")
		expect(verify.message).not.toContain("code: 'ENOENT'")
	})

	it("verify fails when a field the app relies on is missing", async () => {
		const { artifact } = makeArtifactDir(REDUCED_SDL)
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL: () => Promise.resolve(FULL_SDL),
		})
		expect(update.exitCode).toBe(0)
		// the app relies on the score field; a fresh fetch no longer returns it
		const verify = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL: () => Promise.resolve(REDUCED_SDL),
		})
		expect(verify.exitCode).toBe(1)
		expect(verify.message).toContain("drift")
	})

	it("failed fetch leaves the artifact untouched and exits 1", async () => {
		const { artifact } = makeArtifactDir(REDUCED_SDL)
		const before = readFileSync(artifact, "utf-8")
		const fetchSDL = () => Promise.reject(new Error("endpoint unreachable"))
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(update.exitCode).toBe(1)
		expect(update.message).toContain("endpoint unreachable")
		expect(readFileSync(artifact, "utf-8")).toBe(before)

		const verify = await runRefresh({
			mode: "verify",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(verify.exitCode).toBe(1)
		expect(readFileSync(artifact, "utf-8")).toBe(before)
	})

	it("failed parse leaves the artifact untouched and exits 1", async () => {
		const { artifact } = makeArtifactDir(REDUCED_SDL)
		const before = readFileSync(artifact, "utf-8")
		const fetchSDL = () => Promise.resolve("not graphql at all")
		const update = await runRefresh({
			mode: "update",
			artifactPath: artifact,
			fetchSDL,
		})
		expect(update.exitCode).toBe(1)
		expect(update.message).toContain("schema refresh failed")
		expect(readFileSync(artifact, "utf-8")).toBe(before)
	})
})
