/**
 * Schema refresh entry point. Thin wrapper around @animedes/schema: parses
 * the mode, fetches the live schema and hands off to the shared pipeline.
 *
 *   pnpm schema            # update (fetch + normalise + write the artifact)
 *   pnpm schema verify     # verify only (report drift, leave the artifact untouched)
 */
import { fetchSDL, runRefresh, type RefreshMode } from "@animedes/schema"
import { join } from "node:path"

import { API_URL } from "../app/lib/Network/endpoint"

const artifactPath = join(import.meta.dirname, "..", "schema.graphql")

async function main(): Promise<number> {
	const args = process.argv.slice(2)
	const modeArg = args[0] ?? "update"
	if (modeArg !== "update" && modeArg !== "verify") {
		console.error(`Usage: pnpm schema [update|verify] (got "${modeArg}")`)
		return 2
	}
	const mode: RefreshMode = modeArg
	const result = await runRefresh({
		mode,
		artifactPath,
		fetchSDL: () => fetchSDL(API_URL),
	})
	console.log(result.message)
	return result.exitCode
}

void main().then((code) => {
	process.exitCode = code
})
