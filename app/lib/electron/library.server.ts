import type { AnitomyResult } from "anitomy"

import { anitomy, electron, path } from "./electron.server"

import { Effect, Option, Predicate, pipe } from "effect"

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

export const getLibrary = (): Record<string, AnitomyResult> => library
