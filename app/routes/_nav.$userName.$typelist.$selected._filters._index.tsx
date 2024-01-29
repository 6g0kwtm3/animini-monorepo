import type { HeadersFunction, LoaderFunction } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
	isRouteErrorResponse,
	json,
	useParams,
	useRouteError,
	useSearchParams
} from "@remix-run/react"
// import type { FragmentType } from "~/lib/graphql"

import { MediaType } from "~/gql/graphql"
import { graphql } from "~/lib/graphql"
import { MediaList } from "~/lib/list/MediaList"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	type InferVariables
} from "~/lib/urql.server"

import { Effect, Option, ReadonlyArray, ReadonlyRecord, pipe } from "effect"

// import {} from 'glob'

import { layer } from "@effect/platform-node/FileSystem"
import { FileSystem } from "@effect/platform/FileSystem"
import { CardElevated } from "~/components/Card"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { getLibrary } from "~/lib/electron/library.server"
import { Library } from "~/lib/entry/ListItem"

function TypelistQueryVariables(
	params: Readonly<Params<string>>
): Option.Option<InferVariables<typeof TypelistQuery>> {
	const map = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga
	}

	const type = pipe(
		Option.fromNullable(params["typelist"]),
		Option.flatMap((key) => ReadonlyRecord.get(map, key))
	)

	return Option.all({
		userName: Option.fromNullable(params["userName"]),
		type: type
	})
}

export const loader = (async (args) => {
	// make()

	return pipe(
		Effect.Do,
		Effect.bind("args", () => ClientArgs),
		Effect.bind("client", () => EffectUrql),
		Effect.bind("variables", () => TypelistQueryVariables(args.params)),
		Effect.bind("selected", ({ args }) =>
			Option.fromNullable(args.params["selected"])
		),
		Effect.bind("FileSystem", () => FileSystem),
		Effect.bind("MediaListCollection", ({ client, args, variables }) =>
			pipe(
				client.query(
					graphql(`
						query TypelistQuery($userName: String!, $type: MediaType!) {
							MediaListCollection(userName: $userName, type: $type) {
								lists {
									name
									...MediaList_group
									entries {
										id
										media {
											id
											status
										}
									}
								}
							}
						}
					`),
					variables
				),
				Effect.flatMap((data) => Effect.fromNullable(data?.MediaListCollection))
			)
		),
		Effect.bind("Library", () =>
			Effect.succeed(
				ReadonlyArray.groupBy(Object.values(getLibrary()), ({ title }) => title)
			)
		),
		Effect.flatMap(({ MediaListCollection, Library, selected }) => {
			const SelectedList = MediaListCollection.lists?.find(
				(list) => list?.name === selected
			)

			return Effect.all({
				SelectedList: Option.fromNullable(SelectedList),
				Library: Option.some(Library)
			})
		}),

		// Effect.catchTag("NoSuchElementException", () =>
		// 	Effect.succeed(new Response('"List not Found"', { status: 404 })),
		// ),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.provide(layer),

		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=60, s-maxage=60"
				}
			})
		),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export const headers: HeadersFunction = () => {
	return { "Cache-Control": "max-age=60, private" }
}

declare global {
	interface Array<T> {
		indexOf(searchElement: unknown, fromIndex?: number): number
	}
}

export default function Page() {
	const [searchParams] = useSearchParams()
	const params = useParams()

	const data = useRawLoaderData<typeof loader>()

	const selected = params["selected"]

	return (
		<div className=" ">
			<div className={` `}>
				<Library.Provider value={data.Library}>
					<MediaList item={data.SelectedList}></MediaList>
				</Library.Provider>
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>Oops</h1>
				<p>Status: {error.status}</p>
				<p>{error.data}</p>
			</div>
		)
	}

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<CardElevated className="m-4 bg-error-container text-on-error-container">
			<h1 className="text-balance text-headline-md">Uh oh ...</h1>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</CardElevated>
	)
}
