import {
	Outlet,
	isRouteErrorResponse,
	useRouteError,
	type ClientActionFunction,
	type ClientLoaderFunctionArgs,
} from "react-router"

import { precompileStyles } from "@anitrove/unstyled"

// import {} from 'glob'

import type { AnitomyResult } from "anitomy"

import type { ReactNode } from "react"
import { Suspense } from "react"

import * as Ariakit from "@ariakit/react"
import { Card } from "~/components/Card"
import { List } from "~/components/List"
import { Loading, Skeleton } from "~/components/Skeleton"

import { client_get_client } from "~/lib/client"

import { MediaListItem } from "~/lib/entry/MediaListItem"
import { increment } from "~/lib/entry/progress/ProgressIncrement"

import ReactRelay from "react-relay"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"

import { type routeNavUserListEntriesQuery } from "~/gql/routeNavUserListEntriesQuery.graphql"

import { captureException } from "@sentry/react"
import { type } from "arktype"
import { ExtraOutlet, ExtraOutlets } from "extra-outlet"
import { BreadcrumbItem } from "~/components/Breadcrumb"
import type { MediaListItem_media$key } from "~/gql/MediaListItem_media.graphql"
import type { routeUserSetStatusMutation } from "~/gql/routeUserSetStatusMutation.graphql"
import { ProgressIncrement } from "~/lib/entry/Progress"
import { SyncMedia } from "~/lib/entry/SyncMedia"
import { invariant } from "~/lib/invariant"
import type { Route } from "./+types/route"

const { graphql } = ReactRelay

const NavUserListEntriesQuery = graphql`
	query routeNavUserListEntriesQuery($userName: String!, $type: MediaType!)
	@raw_response_type {
		MediaListCollection(userName: $userName, type: $type)
			@required(action: LOG) {
			...SyncMedia_mediaListCollection
			lists {
				name
				entries {
					id
					status
					...MediaListItem_entry
					...SyncMedia_entry
					...SyncMedia_source
					...ProgressIncrement_entry
					media @required(action: LOG) {
						id
						...MediaListItem_media
						relations {
							edges {
								id
								relationType(version: 2)
								node {
									id
									...MediaListItem_media
								}
							}
						}
					}
				}
			}
		}
	}
`

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
	const params = invariant(Params(args.params))
	return {
		Library: Promise.resolve<
			Record<string, [AnitomyResult, ...AnitomyResult[]]>
		>({}),
		query: fetchSelectedList(args),
		params,
	}
}

const UserSetStatus = graphql`
	mutation routeUserSetStatusMutation(
		$mediaId: Int!
		$status: MediaListStatus!
	) {
		SaveMediaListEntry(mediaId: $mediaId, status: $status) {
			id
			progress
		}
	}
`

const SetStatusFormData = type({
	mediaId: "string.integer.parse",
	status: "'COMPLETED'|'CURRENT'|'DROPPED'|'PAUSED'|'PLANNING'|'REPEATING'",
})

async function setStatus(formData: FormData) {
	const variables = invariant(SetStatusFormData(Object.fromEntries(formData)))

	const client = client_get_client()
	const data = await client.mutation<routeUserSetStatusMutation>({
		mutation: UserSetStatus,
		variables: variables,
		updater: (store) => {
			store.invalidateStore()
			// const ref = store.get(`Media:${variables.mediaId}`)
			// if (ref != null) ref.invalidateRecord()
		},
	})

	if (!data.SaveMediaListEntry) {
		throw new Error("Failed to set status")
	}

	return { SaveMediaListEntry: data.SaveMediaListEntry }
}

export const clientAction = (async (args) => {
	const formData = await args.request.formData()
	const intent = formData.get("intent")
	if (typeof intent !== "string") {
		throw Response.json(`Unknown intent type: "${typeof intent}"`, {
			status: 400,
		})
	}
	if (intent === "increment") {
		return increment(formData)
	}
	if (intent === "set_status") {
		return setStatus(formData)
	}

	throw Response.json(`Unknown intent: "${intent}"`, { status: 400 })
}) satisfies ClientActionFunction

function fetchSelectedList(args: ClientLoaderFunctionArgs) {
	const params = invariant(Params(args.params))

	const selectedList = args.context.get(
		loadQuery
	)<routeNavUserListEntriesQuery>(NavUserListEntriesQuery, {
		userName: params.userName,
		type: ({ animelist: "ANIME", mangalist: "MANGA" } as const)[
			params.typelist
		],
	})

	return { selectedList }
}

const Params = type({
	"selected?": "string",
	userName: "string",
	typelist: '"animelist"|"mangalist"',
})

function Title({ params }: Route.ComponentProps): ReactNode {
	return (
		<>
			{params.selected ? (
				<BreadcrumbItem href=".">{params.selected}</BreadcrumbItem>
			) : null}
			<ExtraOutlet id="title" />
		</>
	)
}

export default function Page(props: Route.ComponentProps): ReactNode {
	const { params } = props

	const composite = Ariakit.useCompositeStore({})
	return (
		<ExtraOutlets title={<Title {...props} />}>
			{params.userName ? (
				<title>
					{params.typelist === "animelist"
						? `${params.userName}'s anime list`
						: `${params.userName}'s manga list`}
				</title>
			) : null}

			<div className="">
				<Ariakit.CompositeProvider store={composite}>
					<Suspense fallback={<Loading>Loading...</Loading>}>
						<AwaitList {...props}></AwaitList>
					</Suspense>
				</Ariakit.CompositeProvider>
			</div>
			<Outlet />
		</ExtraOutlets>
	)
}

function AwaitList(props: Route.ComponentProps) {
	const data = usePreloadedQuery(props.loaderData.query.selectedList)

	if (data == null) {
		return null
	}

	const allEntries = new Map(
		data.MediaListCollection.lists?.flatMap(
			(list) =>
				list?.entries?.flatMap((entry) =>
					entry?.media.id ? [[entry.media.id, entry]] : []
				) ?? []
		)
	)

	const mediaList = new Map<number, MediaListMapEntry>()

	let selectedList = data.MediaListCollection.lists

	if (props.params.selected !== undefined) {
		selectedList = data.MediaListCollection.lists?.filter(
			(list) => list?.name === props.params.selected
		)
	}

	for (const entry of selectedList?.flatMap((list) => list?.entries) ?? []) {
		if (!entry?.media) {
			continue
		}

		const compilation = entry.media.relations?.edges?.find((edge) => {
			if (edge?.relationType === "COMPILATION") {
				return true
			}
		})

		if (!compilation?.node?.id) {
			mergeMapEntries(mediaList, entry.media.id, {
				media: entry.media,
				originalEntry: entry,
				relations: new Map(
					entry.media.relations?.edges?.flatMap((edge) =>
						edge?.relationType === "CONTAINS" && edge.node?.id
							? [[edge.node.id, edge.node]]
							: []
					)
				),
			})
			continue
		}

		mergeMapEntries(mediaList, compilation.node.id, {
			media: compilation.node,
			originalEntry: entry,
			relations: new Map([[entry.media.id, entry.media]]),
		})
	}

	return (
		<List
			render={<Ariakit.Composite render={<Ariakit.CompositeTypeahead />} />}
			style={precompileStyles({ containerType: "inline-size" })}
			data-size={mediaList.size}
		>
			{mediaList
				.entries()
				.map(([id, { media, relations }]) => {
					const entry = allEntries.get(id)

					return (
						<>
							<MediaListItem key={id} data-key={id} media={media} entry={entry}>
								<Skeleton>
									{entry ? (
										<div className="flex justify-end">
											{entry.status === "COMPLETED"
												&& (() => {
													const outOfSync = relations
														.keys()
														.filter((mediaId) => {
															if (
																allEntries.get(mediaId)?.status !== "COMPLETED"
															) {
																return true
															}
														})
														.toArray()

													return outOfSync.length !== 0 ? (
														<SyncMedia
															source={entry}
															targetMediaIds={outOfSync}
															targetEntries={outOfSync
																.map((mediaId) => allEntries.get(mediaId))
																.filter((entry) => entry != null)}
															mediaListCollection={data.MediaListCollection}
														></SyncMedia>
													) : null
												})()}
											<ProgressIncrement entry={entry} />
										</div>
									) : null}
								</Skeleton>
							</MediaListItem>
							{relations
								.entries()
								.map(([id, node]) => {
									const entry = allEntries.get(id)
									return (
										<MediaListItem
											key={id}
											data-key={id}
											media={node}
											entry={entry}
											style={precompileStyles({ marginBlockStart: "-.125rem" })}
										>
											<Skeleton>
												{entry ? <ProgressIncrement entry={entry} /> : null}
											</Skeleton>
										</MediaListItem>
									)
								})
								.toArray()}
						</>
					)
				})
				.toArray()}
		</List>
	)
}

export function ErrorBoundary(): ReactNode {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<ExtraOutlets>
				<div>
					<Ariakit.Heading>Oops</Ariakit.Heading>
					<p>Status: {error.status}</p>
					<p>{error.data}</p>
				</div>
			</ExtraOutlets>
		)
	}
	void captureException(error)
	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<ExtraOutlets>
			<Card
				variant="elevated"
				className="bg-error-container text-on-error-container m-4"
			>
				<Ariakit.Heading className="text-headline-md text-balance">
					Uh oh ...
				</Ariakit.Heading>
				<p className="text-headline-sm">Something went wrong.</p>
				<pre className="text-body-md overflow-auto">{errorMessage}</pre>
			</Card>
		</ExtraOutlets>
	)
}
interface MediaListMapEntry {
	media: MediaListItem_media$key
	originalEntry: unknown
	relations: Map<number, MediaListItem_media$key>
}

function mergeMapEntries(
	map: Map<number, MediaListMapEntry>,
	key: number,
	entry: MediaListMapEntry
) {
	const old = map.get(key)
	if (!old) {
		void map.set(key, entry)
		return
	}
	for (const [key, node] of entry.relations.entries()) {
		void old.relations.set(key, node)
	}
}
