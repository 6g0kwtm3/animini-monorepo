import { parse, print } from "graphql"
import { renameSync, writeFileSync, readFileSync, rmSync } from "node:fs"

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

/**
 * One pipeline, two modes. Both modes fetch the live schema, normalise it and
 * print it with graphql's printer — they differ only in the last step:
 *
 * - `update`: pull and replace — write the printed SDL to the artifact (temp
 *   file + atomic rename); a no-op when the printed SDL already matches the
 *   committed artifact.
 * - `verify`: compare the freshly printed artifact with the committed one and
 *   leave the artifact untouched.
 *
 * Any failure before the write (fetch, parse, normalise) leaves the artifact
 * untouched and reports exit code 1.
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

	if (mode === "update") {
		let committed: null | string = null
		try {
			committed = readFileSync(artifactPath, "utf-8")
		} catch {
			// artifact does not exist yet — the update writes it fresh
		}
		if (
			committed != null
			&& normalizeLineEndings(committed) === normalizeLineEndings(normalised)
		) {
			const message = `schema up to date: ${changed} id fields normalised, artifact unchanged`
			return { exitCode: 0, changed, message }
		}
		const tempArtifact = `${artifactPath}.tmp-${process.pid}`
		try {
			writeFileSync(tempArtifact, normalised, "utf-8")
			renameSync(tempArtifact, artifactPath)
		} catch (error) {
			const message = `schema refresh failed: could not write artifact: ${errorMessage(error)}`
			return { exitCode: 1, changed, message }
		} finally {
			rmSync(tempArtifact, { force: true })
		}
		const message = `schema refreshed: ${changed} id fields normalised, wrote ${artifactPath}`
		return { exitCode: 0, changed, message }
	}

	let committed: string
	try {
		committed = readFileSync(artifactPath, "utf-8")
	} catch (error) {
		const message = `committed artifact not found: ${artifactPath} (${errorMessage(error)})`
		return { exitCode: 1, changed, message }
	}
	if (normalizeLineEndings(committed) === normalizeLineEndings(normalised)) {
		const message = "schema up to date (no drift)"
		return { exitCode: 0, changed, message }
	}

	const message = `schema drift: committed artifact differs from a fresh fetch (${changed} id fields normalised)`
	return { exitCode: 1, changed, message }
}
