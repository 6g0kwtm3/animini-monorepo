import { BreadcrumbItem } from "@animedes/components/Breadcrumb"
import { Card } from "@animedes/components/Card"
import { List } from "@animedes/components/List"
// import {} from 'glob'
import { Loading, Skeleton } from "@animedes/components/Skeleton"
import { precompileStyles } from "@anitrove/unstyled"
import * as Ariakit from "@ariakit/react"
import { captureException } from "@sentry/react"
import { type } from "arktype"
import { ExtraOutlet, ExtraOutlets } from "extra-outlet"
import { Suspense, useMemo, useState } from "react"
import ReactRelay from "react-relay"
import {
	Outlet,
	isRouteErrorResponse,
	useRouteError,
	type ClientActionFunction,
	type ClientLoaderFunctionArgs,
} from "react-router"
import { type routeNavUserListEntriesQuery } from "~/gql/routeNavUserListEntriesQuery.graphql"
import { client_get_client } from "~/lib/client"
import { AddToList } from "~/lib/entry/AddToList"
import { MediaListItem } from "~/lib/entry/MediaListItem"
import { ProgressIncrement } from "~/lib/entry/Progress"
import { increment } from "~/lib/entry/progress/ProgressIncrement"
import { SyncMedia } from "~/lib/entry/SyncMedia"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import {
	addRelationChild,
	collectRelationDescendants,
	createRelationTree,
	findRelationRoot,
	flattenRelationTree,
} from "~/lib/relation-tree"

import { useWindowVirtualizer } from "./use-window-virtualizer"

import type { Route } from "./+types/route"
import type { AnitomyResult } from "anitomy"
import type { ComponentRef, ReactNode } from "react"
import type { AddToList_media$key } from "~/gql/AddToList_media.graphql"
import type { AddToList_originalEntry$key } from "~/gql/AddToList_originalEntry.graphql"
import type { MediaListItem_media$key } from "~/gql/MediaListItem_media.graphql"
import type { routeUserSetStatusMutation } from "~/gql/routeUserSetStatusMutation.graphql"

const { graphql } = ReactRelay

const NavUserListEntriesQuery = graphql`
	query routeNavUserListEntriesQuery($userName: String!, $type: MediaType!)
	@raw_response_type
	@throwOnFieldError {
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
		...ProgressIncrement_query @alias
	}
`

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
	const params = Params.assert(args.params)
	return {
		Library: Promise.resolve<
			Record<string, [AnitomyResult, ...AnitomyResult[]]>
		>({}),
		query: fetchSelectedList(args),
		params,
	}
}

const UserSetStatus = graphql`
	mutation routeUserSetStatusMutation($mediaId: Int!, $status: MediaListStatus!)
	@raw_response_type {
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
	const variables = SetStatusFormData.assert(Object.fromEntries(formData))

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
	const params = Params.assert(args.params)

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

	const { allEntries, output, estimateSize, groups } = useMemo(() => {
		const lists = data?.MediaListCollection.lists ?? []
		const entries = lists.flatMap((list) => list?.entries ?? [])

		const allEntries = new Map(
			entries.flatMap((entry) =>
				entry?.media.id ? [[Number(entry.media.id), entry]] : []
			)
		)

		const mediaById = new Map<number, MediaRefs>()
		const tree = createRelationTree()
		const contains: { childId: number; parentId: number }[] = []
		const compilations: { childId: number; parentId: number }[] = []

		for (const entry of entries) {
			if (entry?.media == null) {
				continue
			}

			const id = Number(entry.media.id)
			void mediaById.set(id, entry.media)
			for (const edge of entry.media.relations?.edges ?? []) {
				if (edge?.node?.id == null) {
					continue
				}

				const nodeId = Number(edge.node.id)
				void mediaById.set(nodeId, edge.node)
				if (edge.relationType === "CONTAINS") {
					void contains.push({ parentId: id, childId: nodeId })
				} else if (edge.relationType === "COMPILATION") {
					void compilations.push({ childId: id, parentId: nodeId })
				}
			}
		}

		for (const { parentId, childId } of contains) {
			addRelationChild(tree, parentId, childId)
		}
		for (const { childId, parentId } of compilations) {
			addRelationChild(tree, parentId, childId)
		}

		const selectedList =
			props.params.selected !== undefined
				? lists.filter((list) => list?.name === props.params.selected)
				: lists
		const selectedEntries = selectedList.flatMap((list) => list?.entries ?? [])

		const rootIds: number[] = []
		const anchors = new Map<number, AddToList_originalEntry$key>()
		for (const entry of selectedEntries) {
			if (entry?.media.id == null) {
				continue
			}

			const root = findRelationRoot(tree, Number(entry.media.id))
			if (anchors.has(root)) {
				continue
			}

			void anchors.set(root, entry.AddToList_originalEntry)
			void rootIds.push(root)
		}

		const descendants = collectRelationDescendants(tree)

		const output = flattenRelationTree(tree, rootIds).flatMap((row) => {
			const media = mediaById.get(row.id)
			if (media == null) {
				return []
			}

			const entry = allEntries.get(row.id)
			const inherited = row.ancestors
				.map((ancestorId) => allEntries.get(ancestorId))

				.findLast((ancestor) => ancestor != null)
			const anchor = anchors.get(
				row.ancestors[row.ancestors.length - 1] ?? row.id
			)
			const originalEntry =
				entry?.AddToList_originalEntry
				?? inherited?.AddToList_originalEntry
				?? anchor

			return [
				{
					type:
						row.ancestors.length === 0
							? ("MediaListItem" as const)
							: ("Relation" as const),
					id: row.id,
					media,
					entry,
					originalEntry,
					descendants: descendants.get(row.id) ?? [],
				},
			]
		})

		return {
			allEntries,
			output,
			groups: rootIds.length,
			estimateSize: (index: number) => {
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
		}
	}, [data?.MediaListCollection.lists, props.params.selected])

	const type: "anime" | "manga" = (
		{ animelist: "anime", mangalist: "manga" } as const
	)[props.loaderData.params.typelist]

	const [ref, setRef] = useState<ComponentRef<"div"> | null>(null)

	const { virtualizer, totalSize, virtualItems } = useWindowVirtualizer({
		count: output.length,
		estimateSize,
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
					height: `${totalSize}px`,
					position: "relative",
				})}
				data-size={groups}
				lines={"two"}
			>
				{virtualItems.map((virtualItem) => {
					const item = output[virtualItem.index]
					if (item == null) {
						return null
					}
					const { id, media, entry, originalEntry, descendants } = item
					const outOfSync =
						entry?.status === "COMPLETED"
							? descendants.filter(
									(mediaId) => allEntries.get(mediaId)?.status !== "COMPLETED"
								)
							: []
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
								style={
									item.type === "Relation"
										? precompileStyles({ marginBlockStart: "-.125rem" })
										: undefined
								}
							>
								<Skeleton>
									{entry ? (
										<div className="flex justify-end">
											{entry.status === "COMPLETED"
											&& outOfSync.length !== 0 ? (
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
											) : null}
											<ProgressIncrement
												entry={entry.ProgressIncrement_entry}
												query={data.ProgressIncrement_query}
											/>
										</div>
									) : originalEntry != null ? (
										<AddToList
											media={media.AddToList_media}
											originalEntry={originalEntry}
											mediaListCollection={
												data.MediaListCollection.AddToList_mediaListCollection
											}
										></AddToList>
									) : null}
								</Skeleton>
							</MediaListItem>
						</div>
					)
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
	if (Error.isError(error)) {
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
interface MediaRefs {
	AddToList_media: AddToList_media$key
	MediaListItem_media: MediaListItem_media$key
}
