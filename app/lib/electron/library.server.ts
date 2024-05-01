import type { AnitomyResult } from "anitomy"

import { anitomy, electron, path } from "./electron.server"

import { Array as ReadonlyArray, Effect, Option, pipe, Predicate } from "effect"
import type { NonEmptyArray } from "effect/Array"

let library: Record<string, AnitomyResult> = {}

if (electron && !Predicate.isString(electron)) {
	const chokidar = await import("chokidar")
	const watcher = chokidar.watch(
		path.resolve(electron.app.getPath("downloads"), "**", "*.mkv"),
		{
			ignored: /(^|[\/\\])\../, // ignore dotfiles
			persistent: true
		}
	)

	function parsePath(filePath: string) {
		const file = path.basename(filePath)

		return pipe(
			Option.fromNullable(
				anitomy.parse(file, {
					parseFileExtension: true
				})
			)
			// Option.filter(() => {

			// }),
		)
	}

	watcher.on("add", (filePath) => {
		pipe(
			parsePath(filePath),
			Effect.tap((result) => (library[filePath] = result)),

			Effect.runSync
		)
	})

	watcher.on("unlink", (filePath) => {
		pipe(
			parsePath(filePath),
			Effect.tap(() => delete library[filePath]),

			Effect.runSync
		)
	})
}

export const getLibrary = (): Record<string, NonEmptyArray<AnitomyResult>> =>
	ReadonlyArray.groupBy(Object.values(library), ({ title }) => title ?? "")
