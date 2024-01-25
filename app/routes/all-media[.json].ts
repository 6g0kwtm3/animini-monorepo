import { Schema } from "@effect/schema"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Effect, ReadonlyArray, Schedule, pipe } from "effect"
import { Media } from "~/lib/search"
import { ClientArgs, EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql"

const Page = Schema.struct({
	media: Schema.nullable(Schema.array(Schema.nullable(Media)))
})

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)
			const { searchParams } = yield* _(ClientArgs)
			const i = parseInt(searchParams.get("i") || "")

			const range = ReadonlyArray.range((i - 1) * 41 + 1, i * 41)

			const data = yield* _(
				client.query(
					`query (${range.map((i) => `$page_${i}:Int`).join(",")}){${range
						.map(
							(i) =>
								`Page_${i}: Page(page: $page_${i}){media(sort: ID) {id coverImage { medium extraLarge } type title {romaji english native} synonyms}}`
						)
						.join(" ")}}`,
					Object.fromEntries(range.map((i) => [`page_${i}`, i]))
				),
				Effect.retry(
					Schedule.intersect(
						Schedule.exponential("60 seconds"),
						Schedule.recurs(5)
					)
				)
			)

			if (!data) {
				return []
			}

			const media = yield* _(
				Object.entries(data),
				Effect.forEach(
					([, data]) =>
						pipe(
							data,
							Schema.decodeUnknownEither(Page),
							Effect.map((data) => data.media)
						),
					{
						concurrency: "unbounded"
					}
				)
			)

			return media.flat()
		}),
		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=86400, s-maxage=86400, public"
				}
			})
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise
	)
}) satisfies LoaderFunction
