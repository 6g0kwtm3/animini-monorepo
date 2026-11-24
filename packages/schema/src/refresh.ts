import { spawnSync } from "node:child_process"
import { readFileSync, renameSync, rmSync, writeFileSync } from "node:fs"
import { dirname, basename, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { parse, print } from "graphql"

import { normaliseSchema } from "./normalise"

export type RefreshMode = "update" | "verify"

export interface RefreshResult {
	changed: number
	exitCode: 0 | 1
	message: string
}

export interface RefreshOptions {
	mode: RefreshMode
	artifactPath: string
	fetchSDL: () => Promise<string>
}

function errorMessage(error: unknown): string {
	const message = (error as null | undefined | { message?: unknown })?.message
	return typeof message === "string" ? message : String(error)
}

/** Line endings vary between contributors and platforms; compare LF-only. */
const normalizeLineEndings = (text: string) => text.replace(/\r\n/g, "\n")

// The artifact is emitted exactly the way the repo's own formatter emits it:
// graphql's printer for the SDL content, then the repo's oxfmt (which discovers
// `oxfmt.config.ts` from the repo root cwd) for the repo's formatting. The temp
// file keeps the `.graphql` extension so oxfmt detects the language, and the
// repo's oxfmt is the single source of formatting truth — no "format"
// implementation lives in this package.
const REPO_ROOT = resolve(import.meta.dirname, "..", "..", "..")
const OXFMT_BIN = fileURLToPath(
	new URL("bin/oxfmt", import.meta.resolve("oxfmt/package.json"))
)

function formatArtifact(tempPath: string): string {
	const result = spawnSync(process.execPath, [OXFMT_BIN, "--write", tempPath], {
		cwd: REPO_ROOT,
		stdio: "inherit",
	})
	if (result.error) {
		throw new Error(`oxfmt failed to start: ${result.error.message}`)
	}
	if (result.status !== 0) {
		throw new Error(`oxfmt exited with code ${result.status}`)
	}
	// oxfmt's repo config emits CRLF on Windows; the artifact is stored LF-only
	const formatted = normalizeLineEndings(readFileSync(tempPath, "utf-8"))
	writeFileSync(tempPath, formatted, "utf-8")
	return formatted
}

/**
 * One pipeline, two modes. Both modes fetch the live schema, normalise it,
 * print it with graphql's printer and format the result with the repo's own
 * oxfmt — they differ only in the last step:
 *
 * - `update`: pull and replace — write the formatted artifact (temp file +
 *   atomic rename); a no-op when the formatted artifact already matches the
 *   committed artifact.
 * - `verify`: compare the freshly formatted artifact with the committed one
 *   and leave the artifact untouched.
 *
 * Any failure before the write (fetch, parse, normalise, format, write)
 * leaves the artifact untouched and reports exit code 1.
 */
export async function runRefresh(
	options: RefreshOptions
): Promise<RefreshResult> {
	const { mode, artifactPath, fetchSDL } = options

	let raw: string
	try {
		raw = await fetchSDL()
	} catch (error) {
		const message = `schema refresh failed: ${errorMessage(error)}`
		return { exitCode: 1, changed: 0, message }
	}

	let normalised: string
	let changed: number
	try {
		const doc = normaliseSchema(parse(raw))
		changed = doc.changed
		normalised = print(doc.doc)
	} catch (error) {
		const message = `schema refresh failed: ${errorMessage(error)}`
		return { exitCode: 1, changed: 0, message }
	}

	// Write the printed SDL to a temp artifact and format it in place with the
	// repo's oxfmt so the emitted bytes match what `pnpm format` would produce.
	const artifactDir = dirname(artifactPath)
	const tempArtifact = join(
		artifactDir,
		`${basename(artifactPath)}.tmp-${process.pid}.graphql`
	)
	let formatted: string
	try {
		writeFileSync(tempArtifact, normalised, "utf-8")
		formatted = formatArtifact(tempArtifact)
	} catch (error) {
		rmSync(tempArtifact, { force: true })
		const message = `schema refresh failed: could not format artifact: ${errorMessage(error)}`
		return { exitCode: 1, changed, message }
	}

	if (mode === "update") {
		let committed: null | string = null
		try {
			committed = readFileSync(artifactPath, "utf-8")
		} catch {
			// artifact does not exist yet — the update writes it fresh
		}
		if (
			committed != null
			&& normalizeLineEndings(committed) === normalizeLineEndings(formatted)
		) {
			rmSync(tempArtifact, { force: true })
			const message = `schema up to date: ${changed} id fields normalised, artifact unchanged`
			return { exitCode: 0, changed, message }
		}
		try {
			renameSync(tempArtifact, artifactPath)
		} catch (error) {
			rmSync(tempArtifact, { force: true })
			const message = `schema refresh failed: could not write artifact: ${errorMessage(error)}`
			return { exitCode: 1, changed, message }
		}
		const message = `schema refreshed: ${changed} id fields normalised, wrote ${artifactPath}`
		return { exitCode: 0, changed, message }
	}

	let committed: string
	try {
		committed = readFileSync(artifactPath, "utf-8")
	} catch (error) {
		rmSync(tempArtifact, { force: true })
		const message = `committed artifact not found: ${artifactPath} (${errorMessage(error)})`
		return { exitCode: 1, changed, message }
	}
	if (normalizeLineEndings(committed) === normalizeLineEndings(formatted)) {
		rmSync(tempArtifact, { force: true })
		const message = "schema up to date (no drift)"
		return { exitCode: 0, changed, message }
	}

	rmSync(tempArtifact, { force: true })
	const message = `schema drift: committed artifact differs from a fresh fetch (${changed} id fields normalised)`
	return { exitCode: 1, changed, message }
}
