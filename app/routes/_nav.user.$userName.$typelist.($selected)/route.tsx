import {
	isRouteErrorResponse,
	Link,
	Outlet,
	useLoaderData,
	useLocation,
	useParams,
	useRouteError,
	type ClientActionFunction,
	type ShouldRevalidateFunction,
} from "@remix-run/react"

import type { MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"

import { Order, pipe, Array as ReadonlyArray } from "effect"

// import {} from 'glob'

import { Schema } from "@effect/schema"

import { unstable_defineClientLoader } from "@remix-run/react"
import type { ComponentRef, ReactNode } from "react"
import { Suspense, use, useRef } from "react"

import { List } from "~/components/List"
import { Ariakit } from "~/lib/ariakit"

import { client_get_client } from "~/lib/client"

import { MediaListItem, MockMediaListItem } from "~/lib/entry/MediaListItem"
import { increment } from "~/lib/entry/progress/ProgressIncrement"
import { MediaListSort } from "~/lib/MediaListSort"

import ReactRelay from "react-relay"
import {
	loadQuery,
	readInlineData,
	useFragment,
	usePreloadedQuery,
} from "~/lib/Network"

import { type routeNavUserListEntriesQuery } from "~/gql/routeNavUserListEntriesQuery.graphql"
import type {
	MediaStatus,
	routeNavUserListEntriesSort_entries$key as NavUserListEntriesSort_entries$key,
	routeNavUserListEntriesSort_entries$data,
} from "~/gql/routeNavUserListEntriesSort_entries.graphql"

import type { routeFuzzyDateOrder_fuzzyDate$key as routeFuzzyDate$key } from "~/gql/routeFuzzyDateOrder_fuzzyDate.graphql"
import type {
	MediaListStatus,
	routeUserSetStatusMutation,
} from "~/gql/routeUserSetStatusMutation.graphql"

import { useVirtualizer } from "@tanstack/react-virtual"
import { PaneContext } from "~/components/Layout"
import type { routeAwaitQuery_query$key } from "~/gql/routeAwaitQuery_query.graphql"
import type { routeNavUserListEntriesSort_user$key } from "~/gql/routeNavUserListEntriesSort_user.graphql"
import { button } from "~/lib/button"
import { M3 } from "~/lib/components"
import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"
import { isVisible } from "./isVisible"

const { graphql } = ReactRelay

const NavUserListEntriesSort_entries = graphql`
	fragment routeNavUserListEntriesSort_entries on MediaList @inline {
		id
		progress
		score
		startedAt {
			...routeFuzzyDateOrder_fuzzyDate
		}
		completedAt {
			...routeFuzzyDateOrder_fuzzyDate
		}
		media {
			id
			popularity
			startDate {
				...routeFuzzyDateOrder_fuzzyDate
			}
			averageScore
			status(version: 2)
			title {
				userPreferred
			}
		}
		updatedAt
		toWatch
		...MediaListItem_entry
	}
`

const RouteNavUserListEntriesQuery = graphql`
	query routeNavUserListEntriesQuery($userName: String!, $type: MediaType!)
	@raw_response_type {
		...routeAwaitQuery_query
	}
`

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const params = Schema.decodeUnknownSync(Params)(args.params)

	const variables = {
		userName: params.userName,
		type: (
			{
				animelist: "ANIME",
				mangalist: "MANGA",
			} as const
		)[params.typelist],
	}
	const data = loadQuery<routeNavUserListEntriesQuery>(
		RouteNavUserListEntriesQuery,
		variables
	)

	return {
		NavUserListEntriesQuery: data,
	}
})

export const shouldRevalidate: ShouldRevalidateFunction = ({
	defaultShouldRevalidate,
	formMethod,
	currentParams,
	nextParams,
}) => {
	if (
		formMethod === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.typelist === nextParams.typelist
	) {
		return false
	}
	return defaultShouldRevalidate
}

export const meta = (({ params }) => {
	return [
		{
			title:
				params.typelist === "animelist"
					? `${params.userName}'s anime list`
					: `${params.userName}'s manga list`,
		},
	]
}) satisfies MetaFunction<typeof clientLoader>

const UserSetStatus = graphql`
	mutation routeUserSetStatusMutation($mediaId: Int!, $status: MediaListStatus!)
	@raw_response_type {
		SaveMediaListEntry(mediaId: $mediaId, status: $status) {
			id
			progress
		}
	}
`

async function setStatus(formData: FormData) {
	const variables = Schema.decodeUnknownSync(
		Schema.Struct({
			mediaId: Schema.NumberFromString,
			status: Schema.Enums<{
				[K in MediaListStatus]: K
			}>({
				COMPLETED: "COMPLETED",
				CURRENT: "CURRENT",
				DROPPED: "DROPPED",
				PAUSED: "PAUSED",
				PLANNING: "PLANNING",
				REPEATING: "REPEATING",
				"%future added value": "%future added value",
			}),
		})
	)(Object.fromEntries(formData))

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

// import {type} from 'arktype'
// const action = type('parse.formData')

export const clientAction = (async (args) => {
	const formData = await args.request.formData()
	if (formData.get("intent") === "increment") {
		return increment(formData)
	}
	if (formData.get("intent") === "set_status") {
		return setStatus(formData)
	}
	throw json(`Unknown intent ${formData.get("intent")}`, {
		status: 400,
	})
}) satisfies ClientActionFunction

async function fetchSelectedList(
	args: Parameters<Parameters<typeof unstable_defineClientLoader>[0]>[0]
) {}

const FuzzyDate = graphql`
	fragment routeFuzzyDateOrder_fuzzyDate on FuzzyDate @inline {
		year
		month
		day
	}
`

const OrderFuzzyDate = Order.combineAll([
	Order.mapInput(
		Order.number,
		(date: routeFuzzyDate$key | null | undefined) =>
			readInlineData(FuzzyDate, date)?.year ?? 0
	),
	Order.mapInput(
		Order.number,
		(date: routeFuzzyDate$key | null | undefined) =>
			readInlineData(FuzzyDate, date)?.month ?? 0
	),
	Order.mapInput(
		Order.number,
		(date: routeFuzzyDate$key | null | undefined) =>
			readInlineData(FuzzyDate, date)?.day ?? 0
	),
])

const NavUserListEntriesSort_user = graphql`
	fragment routeNavUserListEntriesSort_user on User @inline {
		id
		mediaListOptions {
			rowOrder
		}
	}
`

function sortEntries(
	entryKeys: readonly NavUserListEntriesSort_entries$key[],
	{
		search: searchParams,
		user: userKey,
	}: {
		search: URLSearchParams
		user: routeNavUserListEntriesSort_user$key | null | undefined
	}
): routeNavUserListEntriesSort_entries$data[] {
	let entries = entryKeys.map((entryKey) =>
		readInlineData(NavUserListEntriesSort_entries, entryKey)
	)
	// return entries
	const user = readInlineData(NavUserListEntriesSort_user, userKey)

	const sorts =
		searchParams.getAll("sort").length > 0
			? searchParams.getAll("sort")
			: ({
					title: [MediaListSort.TitleEnglish],
					score: [MediaListSort.ScoreDesc],
				}[String(user?.mediaListOptions?.rowOrder)] ?? [])

	const order: Order.Order<(typeof entries)[number]>[] = []

	for (const sort of sorts) {
		if (!Schema.is(Schema.Enums(MediaListSort))(sort)) {
			continue
		}

		if (sort === MediaListSort.TitleEnglish) {
			order.push(
				Order.reverse(
					Order.mapInput(
						Order.string,
						(entry) => entry.media?.title?.userPreferred ?? ""
					)
				)
			)
			continue
		}

		if (sort === MediaListSort.ScoreDesc) {
			order.push(Order.mapInput(Order.number, (entry) => entry.score ?? 0))
			continue
		}

		if (sort === MediaListSort.ProgressDesc) {
			order.push(Order.mapInput(Order.number, (entry) => entry.progress ?? 0))
			continue
		}

		if (sort === MediaListSort.UpdatedTimeDesc) {
			order.push(Order.mapInput(Order.number, (entry) => entry.updatedAt ?? 0))
			continue
		}

		if (sort === MediaListSort.IdDesc) {
			order.push(Order.mapInput(Order.number, (entry) => entry.media?.id ?? 0))
			continue
		}

		if (sort === MediaListSort.StartedOnDesc) {
			order.push(Order.mapInput(OrderFuzzyDate, (entry) => entry.startedAt))
			continue
		}

		if (sort === MediaListSort.FinishedOnDesc) {
			order.push(Order.mapInput(OrderFuzzyDate, (entry) => entry.completedAt))
			continue
		}

		if (sort === MediaListSort.StartDateDesc) {
			order.push(
				Order.mapInput(OrderFuzzyDate, (entry) => entry.media?.startDate)
			)
			continue
		}
		if (sort === MediaListSort.AvgScore) {
			order.push(
				Order.mapInput(Order.number, (entry) => entry.media?.averageScore ?? 0)
			)
			continue
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (sort === MediaListSort.PopularityDesc) {
			order.push(
				Order.mapInput(Order.number, (entry) => entry.media?.popularity ?? 0)
			)
			continue
		}

		// Order.struct({

		// })

		sort satisfies never
	}

	order.push(
		Order.reverse(
			Order.mapInput(
				Order.number,
				(entry) => (entry.toWatch ?? 1) || Number.POSITIVE_INFINITY
			)
		),
		Order.reverse(
			Order.mapInput(Order.number, (entry) => {
				return [
					"RELEASING" satisfies MediaStatus,
					"NOT_YET_RELEASED" satisfies MediaStatus,
				].indexOf(entry.media?.status ?? ("CANCELLED" satisfies MediaStatus))
			})
		)
	)

	return pipe(
		entries,
		ReadonlyArray.sortBy(Order.reverse(Order.combineAll(order)))
	)
}

const Params = Schema.Struct({
	selected: Schema.optional(Schema.String),
	userName: Schema.String,
	typelist: Schema.Literal("animelist", "mangalist"),
})

export default function Page(): ReactNode {
	return (
		<ExtraOutlets>
			{/* <MediaListHeader>
				<MediaListHeaderItem subtitle={m.to_watch()}>
					<Suspense fallback={<Skeleton>154h 43min</Skeleton>}>
						<Await resolve={lists}>
							{(lists) => (
								<MediaListHeaderToWatch
									entries={lists.flatMap((list) => list?.entries ?? [])}
								/>
							)}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
				<MediaListHeaderItem subtitle={m.total_entries()}>
					<Suspense fallback={<Skeleton>80</Skeleton>}>
						<Await resolve={lists}>{({ entries }) => entries.length}</Await>
					</Suspense>
				</MediaListHeaderItem>
			</MediaListHeader> */}

			<div className="">
				<Suspense
					fallback={
						<List className="@container">
							{ReadonlyArray.range(1, 7).map((i) => (
								<MockMediaListItem key={i} />
							))}
						</List>
					}
				>
					<AwaitQuery />
				</Suspense>
			</div>
			<Outlet />
		</ExtraOutlets>
	)
}

const routeAwaitQuery_query = graphql`
	fragment routeAwaitQuery_query on Query {
		MediaListCollection(userName: $userName, type: $type)
			@required(action: LOG) {
			user {
				id
				...routeNavUserListEntriesSort_user
				...MediaListItemScore_user
			}
			lists @required(action: LOG) {
				name @required(action: LOG)
				entries {
					id
					...isVisible_entry
					...routeNavUserListEntriesSort_entries
					...MediaListItem_entry
					...routeSidePanel_entry # @defer
				}
			}
		}
	}
`

function AwaitQuery() {
	const query: routeAwaitQuery_query$key = usePreloadedQuery(
		...useLoaderData<typeof clientLoader>().NavUserListEntriesQuery
	)
	const data = useFragment(routeAwaitQuery_query, query)

	const params = useParams()

	if (!data?.MediaListCollection) {
		throw new Error("No list collection found")
	}

	const lists = (
		typeof params.selected === "string"
			? [
					data.MediaListCollection.lists.find(
						(list) => list?.name === params.selected
					),
				]
			: data.MediaListCollection.lists
	).filter((el) => el != null)

	if (!ReadonlyArray.isNonEmptyReadonlyArray(lists)) {
		throw new Error("No list selected")
	}

	const search = useOptimisticSearchParams()

	const elements = lists.flatMap((list) => {
		const entries = sortEntries(
			list.entries?.flatMap((el) =>
				el != null && isVisible(el, search) ? [el] : []
			) ?? [],
			{ search, user: data.MediaListCollection.user }
		)

		return ReadonlyArray.isNonEmptyReadonlyArray(entries)
			? [
					{ type: "MediaListGroup" as const, list },
					...entries.map((entry) => ({
						type: "MediaList" as const,
						entry,
						name: list.name,
					})),
				]
			: []
	})

	const ref = useRef<ComponentRef<"div">>(null)

	const pane = use(PaneContext)

	const virtualizer = useVirtualizer({
		getScrollElement: () => pane.current,
		count: elements.length,
		scrollMargin: ref.current?.offsetTop ?? 0,
		estimateSize: (index) => {
			const element = elements[index]

			if (element?.type === "MediaListGroup") {
				return 36
			}

			if (element?.type === "MediaList") {
				return 72
			}

			element satisfies undefined

			return 0
		},
		overscan: 10,
	})

	return (
		<div ref={ref} className="">
			<List
				className="relative @container"
				lines={"two"}
				style={{ height: `${virtualizer.getTotalSize()}px` }}
			>
				{virtualizer.getVirtualItems().map((item) => {
					const element = elements[item.index]

					if (element?.type === "MediaListGroup") {
						return (
							<li
								key={element.list.name}
								style={{
									transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
								}}
								className="absolute left-0 top-0 w-full"
								ref={virtualizer.measureElement}
								data-index={item.index}
							>
								<M3.Subheader>{element.list.name}</M3.Subheader>
							</li>
						)
					}

					if (element?.type === "MediaList") {
						return (
							<MediaListItem
								ref={virtualizer.measureElement}
								data-id={element.entry.id}
								key={`${element.name}:${element.entry.id}`}
								entry={element.entry}
								style={{
									transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
								}}
								user={data.MediaListCollection.user}
								className="absolute left-0 top-0 w-full"
								data-index={item.index}
							/>
						)
					}

					element satisfies undefined
					return null
				})}
			</List>
		</div>
	)
}

export function ErrorBoundary(): ReactNode {
	const error = useRouteError()
	const location = useLocation()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<ExtraOutlets>
				<div>
					<Ariakit.Heading>Oops</Ariakit.Heading>
					<p>Status: {error.status}</p>
					<p>{error.data}</p>
					<Link to={location} className={button()}>
						Try again
					</Link>
				</div>
			</ExtraOutlets>
		)
	}

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<ExtraOutlets>
			<Ariakit.Heading className="text-balance text-headline-md">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
			<Link to={location} className={button()}>
				Try again
			</Link>
		</ExtraOutlets>
	)
}
