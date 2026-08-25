import { precompileStyles } from "@anitrove/unstyled"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import {
	Outlet,
	isRouteErrorResponse,
	useRouteError,
	type ClientActionFunction,
	type ClientLoaderFunctionArgs,
} from "react-router"
// import {} from 'glob'

import type { AnitomyResult } from "anitomy"

import type { ComponentRef, ReactNode } from "react"
import { Suspense, useState } from "react"

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
import type { AddToList_media$key } from "~/gql/AddToList_media.graphql"
import type { AddToList_originalEntry$key } from "~/gql/AddToList_originalEntry.graphql"
import type { MediaListItem_media$key } from "~/gql/MediaListItem_media.graphql"
import type { routeUserSetStatusMutation } from "~/gql/routeUserSetStatusMutation.graphql"
import { AddToList } from "~/lib/entry/AddToList"
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
			...SyncMedia_mediaListCollection @alias
			...AddToList_mediaListCollection @alias
			lists {
				name
				entries {
					id
					status
					...MediaListItem_entry @alias
					...SyncMedia_entry_plural
					...SyncMedia_source @alias
					...ProgressIncrement_entry @alias
					...AddToList_originalEntry @alias
					media @required(action: LOG) {
						id
						...MediaListItem_media @alias
						...AddToList_media @alias
						relations {
							edges {
								id
								relationType(version: 3)
								node {
									id
									...MediaListItem_media @alias
									...AddToList_media @alias
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

	return { selectedList, params }
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
					<Suspense fallback={<Loading>Loading&hellip;</Loading>}>
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

	const allEntries = new Map(
		data?.MediaListCollection.lists?.flatMap(
			(list) =>
				list?.entries?.flatMap((entry) =>
					entry?.media.id ? [[Number(entry.media.id), entry]] : []
				) ?? []
		)
	)

	const mediaList = new Map<number, MediaListMapEntry>()

	let selectedList = data?.MediaListCollection.lists

	if (props.params.selected !== undefined) {
		selectedList = data?.MediaListCollection.lists?.filter(
			(list) => list?.name === props.params.selected
		)
	}

	for (const entry of selectedList?.flatMap((list) => list?.entries) ?? []) {
		if (entry?.media == null) {
			continue
		}

		const compilation = entry.media.relations?.edges?.find((edge) => {
			if (edge?.relationType === "COMPILATION") {
				return true
			}
		})

		if (compilation?.node == null) {
			mergeMapEntries(mediaList, Number(entry.media.id), {
				media: entry.media,
				originalEntry: entry.AddToList_originalEntry,
				relations: new Map(
					entry.media.relations?.edges?.flatMap((edge) =>
						edge?.relationType === "CONTAINS" && edge.node?.id
							? [[Number(edge.node.id), edge.node]]
							: []
					)
				),
			})
			continue
		}

		mergeMapEntries(mediaList, Number(compilation.node.id), {
			media: compilation.node,
			originalEntry: entry.AddToList_originalEntry,
			relations: new Map([[Number(entry.media.id), entry.media]]),
		})
	}

	const type: "anime" | "manga" = (
		{ animelist: "anime", mangalist: "manga" } as const
	)[props.loaderData.params.typelist]

	const output = mediaList
		.entries()
		.flatMap(([id, { media, relations, originalEntry }]) => {
			return [
				{ type: "MediaListItem", id, media, relations, originalEntry } as const,
				...relations
					.entries()
					.map(([id, node]) => {
						return {
							type: "Relation",
							id,
							media,
							relations,
							originalEntry,
							node,
						} as const
					})
					.toArray(),
			]
		})
		.toArray()

	const [ref, setRef] = useState<ComponentRef<"div"> | null>(null)

	const virtualizer = useWindowVirtualizer({
		count: output.length,
		estimateSize: (index) => {
			const item = output[index]
			if (item == null) {
				return 0
			}
			switch (item.type) {
				case "MediaListItem": {
					return 72
				}
				case "Relation": {
					return 70
				}
			}
		},
		gap: 2,
		scrollMargin: ref?.offsetTop ?? 0,
		overscan: 10,
	})

	if (data == null) {
		return null
	}

	return (
		<div ref={setRef} className="">
			<List
				render={<Ariakit.Composite render={<Ariakit.CompositeTypeahead />} />}
				style={precompileStyles({
					containerType: "inline-size",
					height: `${virtualizer.getTotalSize()}px`,
					position: "relative",
				})}
				data-size={mediaList.size}
				lines={"two"}
			>
				{virtualizer.getVirtualItems().map((virtualItem) => {
					const item = output[virtualItem.index]
					if (item == null) {
						return null
					}
					switch (item.type) {
						case "MediaListItem": {
							const { id, media, relations, originalEntry } = item
							const entry = allEntries.get(id)
							return (
								<div
									style={{
										transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
									}}
									className="absolute top-0 left-0 w-full"
									ref={virtualizer.measureElement}
									data-index={virtualItem.index}
									key={id}
									data-key={id}
								>
									<MediaListItem
										first={virtualItem.index === 0}
										last={virtualItem.index === output.length - 1}
										key={id}
										data-key={id}
										media={media.MediaListItem_media}
										entry={entry?.MediaListItem_entry}
										type={type}
									>
										<Skeleton>
											{entry ? (
												<div className="flex justify-end">
													{entry.status === "COMPLETED"
														&& (() => {
															const outOfSync = relations
																.keys()
																.filter((mediaId) => {
																	if (
																		allEntries.get(mediaId)?.status
																		!== "COMPLETED"
																	) {
																		return true
																	}
																})
																.toArray()
															return outOfSync.length !== 0 ? (
																<SyncMedia
																	source={entry.SyncMedia_source}
																	targetMediaIds={outOfSync}
																	targetEntries={outOfSync
																		.map((mediaId) => allEntries.get(mediaId))
																		.filter((entry) => entry != null)}
																	mediaListCollection={
																		data.MediaListCollection
																			.SyncMedia_mediaListCollection
																	}
																></SyncMedia>
															) : null
														})()}
													<ProgressIncrement
														entry={entry.ProgressIncrement_entry}
													/>
												</div>
											) : (
												<AddToList
													media={media.AddToList_media}
													originalEntry={originalEntry}
													mediaListCollection={
														data.MediaListCollection
															.AddToList_mediaListCollection
													}
												></AddToList>
											)}
										</Skeleton>
									</MediaListItem>
								</div>
							)
						}
						case "Relation": {
							const { id, originalEntry, node } = item
							const entry = allEntries.get(id)
							return (
								<div
									style={{
										transform: `translateY(${virtualItem.start - virtualizer.options.scrollMargin}px)`,
									}}
									className="absolute top-0 left-0 w-full"
									ref={virtualizer.measureElement}
									data-index={virtualItem.index}
									key={id}
									data-key={id}
								>
									<MediaListItem
										first={virtualItem.index === 0}
										last={virtualItem.index === output.length - 1}
										key={id}
										data-key={id}
										media={node.MediaListItem_media}
										entry={entry?.MediaListItem_entry}
										type={type}
										style={precompileStyles({ marginBlockStart: "-.125rem" })}
									>
										<Skeleton>
											{entry ? (
												<ProgressIncrement
													entry={entry.ProgressIncrement_entry}
												/>
											) : (
												<AddToList
													media={node.AddToList_media}
													originalEntry={originalEntry}
													mediaListCollection={
														data.MediaListCollection
															.AddToList_mediaListCollection
													}
												></AddToList>
											)}
										</Skeleton>
									</MediaListItem>
								</div>
							)
						}
					}
				})}
			</List>
		</div>
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
	media: {
		AddToList_media: AddToList_media$key
		MediaListItem_media: MediaListItem_media$key
	}
	originalEntry: AddToList_originalEntry$key
	relations: Map<
		number,
		{
			AddToList_media: AddToList_media$key
			MediaListItem_media: MediaListItem_media$key
		}
	>
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
