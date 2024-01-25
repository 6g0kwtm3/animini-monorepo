import type { LoaderFunction } from "@remix-run/node"
import { json, type ClientLoaderFunctionArgs } from "@remix-run/react"
import { Effect, Option, ReadonlyArray, pipe } from "effect"
import { graphql } from "~/gql"
import { Remix } from "~/lib/Remix"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	nonNull
} from "~/lib/urql"

import localforage from "localforage"

import { Schema } from "@effect/schema"
import { Media } from "~/lib/search"

const _loader = Effect.gen(function* (_) {
	const client = yield* _(EffectUrql)
	const { searchParams } = yield* _(ClientArgs)

	return yield* _(
		client.query(
			graphql(`
				query SearchQuery($q: String) {
					Page(perPage: 10) {
						media(search: $q) {
							id
							type
							coverImage {
								medium
								extraLarge
							}
							title {
								english
								native
								romaji
							}
							synonyms
						}
					}
				}
			`),
			{
				q: searchParams.get("q")
			}
		)
	)
})

export const loader = (async (args) => {
	return await pipe(
		_loader,

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=60, s-maxage=60, public"
				}
			})
		),
		Remix.runLoader
	)
}) satisfies LoaderFunction

let cache: Schema.Schema.To<typeof media> | undefined

export async function clientLoader(args: ClientLoaderFunctionArgs) {
	if (!cache) {
		loadCache()
		return await args.serverLoader()
	}

	return await pipe(
		Effect.gen(function* (_) {
			const { searchParams } = yield* _(ClientArgs)

			const q = searchParams.get("q")

			if (!q) {
				return { Page: { media: [] } }
			}

			let matches: Schema.Schema.To<typeof media> = []

			for (const media of cache ?? []) {
				const found = [
					...(media.synonyms ?? []),
					media.title?.english,
					media.title?.native,
					media.title?.romaji
				]
					.filter(nonNull)
					.map(
						(synonym) =>
							[synonym, synonym.toLowerCase().indexOf(q.toLowerCase())] as const
					)
					.find(([, i]) => i > -1)

				if (found) {
					matches.push({
						...media,
						title: {
							userPreferred:
								found[0].substring(0, found[1]) +
								`<strong class="font-bold">${found[0].substring(found[1], found[1] + q.length)}</strong>` +
								found[0].substring(found[1] + q.length)
						}
					})
				}
				if (matches.length >= 10) break
			}

			return {
				Page: { media: matches }
			}
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}

clientLoader.hydrate = true
const media = Schema.mutable(Schema.array(Media))

let loadCache = async () => {
	loadCache = async () => {}

	return pipe(
		Effect.gen(function* (_) {
			const cached = yield* _(
				Effect.promise(() => localforage.getItem("all-media")),
				Effect.map(Schema.decodeUnknownOption(media)),
				Effect.map(Option.getOrNull)
			)

			if (cached) {
				cache = cached
				return
			}

			let pages = (yield* _(
				ReadonlyArray.range(0, 60),
				Effect.forEach(
					(i) =>
						Effect.gen(function* (_) {
							let response = yield* _(
								Effect.promise(() => fetch(`/all-media.json/?i=${i + 1}`))
							)

							const page = yield* _(
								Effect.promise(() => response.json()),
								Effect.map(Schema.decodeUnknownOption(media)),
								Effect.map(Option.getOrElse(() => []))
							)

							return page
						}),
					{
						concurrency: "unbounded"
					}
				)
			)).flat()

			localforage.setItem("all-media", pages)

			console.log({ pages })
			cache = pages
		}),
		Effect.runPromise
	)
}
