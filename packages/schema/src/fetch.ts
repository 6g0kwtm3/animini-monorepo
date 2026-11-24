import { spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

/**
 * Live-fetch the AniList schema via graphql-inspector. The fetched SDL is
 * returned as text; the caller normalises and emits it. Live I/O lives in
 * exactly one place — the CLI entry passes the endpoint and calls this, the
 * tests inject a fixed payload instead (no live calls in tests).
 */
export function fetchSDL(endpoint: string): Promise<string> {
	const tempDir = mkdtempSync(join(tmpdir(), "schema-refresh-"))
	const tempFile = join(tempDir, "schema.graphql")
	try {
		const result = spawnSync(
			"graphql-inspector",
			["introspect", endpoint, "--write", tempFile],
			{ stdio: "inherit", shell: process.platform === "win32" }
		)
		if (result.error) {
			throw new Error(
				`graphql-inspector failed to start: ${result.error.message}`
			)
		}
		if (result.status !== 0) {
			throw new Error(`graphql-inspector exited with code ${result.status}`)
		}
		return Promise.resolve(readFileSync(tempFile, "utf-8"))
	} finally {
		rmSync(tempDir, { recursive: true, force: true })
	}
}
