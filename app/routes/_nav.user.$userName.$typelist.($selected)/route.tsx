import {
	isRouteErrorResponse,
	Link,
	Outlet,
	useLocation,
	useParams,
	useSearchParams,
	type ClientActionFunction,
	type ShouldRevalidateFunction,
} from "react-router"

import type { MetaFunction } from "react-router"

import * as Order from "~/lib/Order"

// import {} from 'glob'

import type { ComponentRef, ReactNode } from "react"
import { Suspense, use, useRef } from "react"
import { List } from "~/components/List"
import { Ariakit } from "~/lib/ariakit"

import { MediaListItem, MockMediaListItem } from "~/lib/entry/MediaListItem"
import { increment } from "~/lib/entry/progress/ProgressIncrement"
import { MediaListSort, MediaListSortSchema } from "~/lib/MediaListSort"

import ReactRelay from "react-relay"
import {
	loadQuery,
	mutation,
	readInlineData,
	useFragment,
	usePreloadedQuery,
} from "~/lib/Network"

import { type routeNavUserListEntriesQuery } from "~/gql/routeNavUserListEntriesQuery.graphql"
import {
	MediaStatus,
	routeNavUserListEntriesSort_entries$key as NavUserListEntriesSort_entries$key,
	routeNavUserListEntriesSort_entries$data,
} from "~/gql/routeNavUserListEntriesSort_entries.graphql"

import type { routeFuzzyDateOrder_fuzzyDate$key as routeFuzzyDate$key } from "~/gql/routeFuzzyDateOrder_fuzzyDate.graphql"
import type { routeUserSetStatusMutation } from "~/gql/routeUserSetStatusMutation.graphql"

import { useVirtualizer } from "@tanstack/react-virtual"
import { PaneContext } from "~/components/Layout"
import type { routeAwaitQuery_query$key } from "~/gql/routeAwaitQuery_query.graphql"
import type { routeNavUserListEntriesSort_user$key } from "~/gql/routeNavUserListEntriesSort_user.graphql"
import { button } from "~/lib/button"
import { M3 } from "~/lib/components"
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"
import { isVisible } from "./isVisible"

import { ArkErrors, type } from "arktype"
import type { routeIsQuery_entry$key } from "~/gql/routeIsQuery_entry.graphql"
import { invariant } from "~/lib/invariant"
import { parse, type SearchParserResult } from "~/lib/searchQueryParser"
import type { Route } from "./+types/route"

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
			endDate {
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
		behind
		...MediaListItem_entry
	}
`

const RouteNavUserListEntriesQuery = graphql`
	query routeNavUserListEntriesQuery($userName: String!, $type: MediaType!)
	@raw_response_type {
		...routeAwaitQuery_query
	}
`

const keywords = [
	"tags",
	"status",
	"score",
	"to_watch",
	"asc",
	"desc",
	"progress",
	"media-status",
] as const

const Typelist = type("'animelist'|'mangalist'")
export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const params = args.params
	const typelist = invariant(Typelist(params.typelist))

	const data = loadQuery<routeNavUserListEntriesQuery>(
		RouteNavUserListEntriesQuery,
		{
			userName: params.userName,
			type: (
				{
					animelist: "ANIME",
					mangalist: "MANGA",
				} as const
			)[typelist],
		}
	)

	return {
		NavUserListEntriesQuery: data,
	}
}

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

const SetStatusFormData = type({
	mediaId: "string.integer.parse",
	status:
		"'COMPLETED'|'CURRENT'|'DROPPED'|'PAUSED'|'PLANNING'|'REPEATING'|'%future added value'",
})

async function setStatus(formData: FormData) {
	const variables = invariant(SetStatusFormData(Object.fromEntries(formData)))

	const data = await mutation<routeUserSetStatusMutation>({
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
	throw Response.json(`Unknown intent ${formData.get("intent")}`, {
		status: 400,
	})
}) satisfies ClientActionFunction

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

	const user = readInlineData(NavUserListEntriesSort_user, userKey)

	const parsed = parse(searchParams.get("filter")?.toLocaleLowerCase() ?? "", {
		keywords: keywords,
	})

	const sorts = parsed.entries.flatMap(([key, value]) =>
		key === "asc" || key === "desc" ? ([[key, value]] as const) : []
	)

	sorts.push(
		...((
			{
				title: [["desc", MediaListSort.TitleEnglish]],
				score: [["desc", MediaListSort.Score]],
			} as const
		)[String(user?.mediaListOptions?.rowOrder)] ?? [])
	)

	const orders: Order.Order<(typeof entries)[number]>[] = []

	for (const [dir, unparsedSort] of sorts) {
		const sort = MediaListSortSchema(unparsedSort)
		if (sort instanceof ArkErrors) {
			continue
		}

		function orderEntry<A>(
			self: Order.Order<A>,
			f: (b: (typeof entries)[number]) => A
		) {
			const order = Order.mapInput(self, f)
			orders.push(dir === "desc" ? Order.reverse(order) : order)
		}

		if (sort === MediaListSort.TitleEnglish) {
			orderEntry(
				Order.string,
				(entry) => entry.media?.title?.userPreferred ?? ""
			)
			continue
		}

		if (sort === MediaListSort.Score) {
			orderEntry(Order.number, (entry) => entry.score ?? 0)
			continue
		}

		if (sort === MediaListSort.Progress) {
			orderEntry(Order.number, (entry) => entry.progress ?? 0)
			continue
		}

		if (sort === MediaListSort.UpdatedTime) {
			orderEntry(Order.number, (entry) => entry.updatedAt ?? 0)
			continue
		}

		if (sort === MediaListSort.IdDesc) {
			orderEntry(Order.number, (entry) => entry.media?.id ?? 0)
			continue
		}

		if (sort === MediaListSort.StartedOn) {
			orderEntry(OrderFuzzyDate, (entry) => entry.startedAt)
			continue
		}

		if (sort === MediaListSort.FinishedOn) {
			orderEntry(OrderFuzzyDate, (entry) => entry.completedAt)
			continue
		}

		if (sort === MediaListSort.StartDate) {
			orderEntry(OrderFuzzyDate, (entry) => entry.media?.startDate)
			continue
		}
		if (sort === MediaListSort.EndDate) {
			orderEntry(OrderFuzzyDate, (entry) => entry.media?.endDate)
			continue
		}
		if (sort === MediaListSort.AvgScore) {
			orderEntry(Order.number, (entry) => entry.media?.averageScore ?? 0)
			continue
		}

		if (sort === MediaListSort.ToWatch) {
			orderEntry(
				Order.number,
				(entry) => (entry.toWatch ?? 1) || Number.POSITIVE_INFINITY
			)
			continue
		}
		if (sort === MediaListSort.Behind) {
			orderEntry(
				Order.number,
				(entry) => (entry.behind ?? 1) || Number.POSITIVE_INFINITY
			)
			continue
		}

		if (sort === MediaListSort.Popularity) {
			orderEntry(Order.number, (entry) => entry.media?.popularity ?? 0)
			continue
		}

		sort satisfies never
	}

	orders.push(
		Order.reverse(
			Order.mapInput(Order.number, (entry) => {
				return [
					"RELEASING" satisfies MediaStatus,
					"NOT_YET_RELEASED" satisfies MediaStatus,
				].indexOf(entry.media?.status ?? ("CANCELLED" satisfies MediaStatus))
			})
		)
	)

	return entries.sort(Order.combineAll(orders))
}

export default function Page(props: Route.ComponentProps): ReactNode {
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
							{Array.from({ length: 7 }, (_, i) => (
								<MockMediaListItem key={i} />
							))}
						</List>
					}
				>
					<AwaitQuery {...props} />
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
					...routeIsQuery_entry
					...isVisible_entry
					...routeNavUserListEntriesSort_entries
					...MediaListItem_entry
					...routeSidePanel_entry # @defer
				}
			}
		}
	}
`

const routeIsQuery_entry = graphql`
	fragment routeIsQuery_entry on MediaList @inline {
		id
		status
		score
		progress
		media {
			id
			status(version: 2)
			tags {
				id
				name
			}
		}
		toWatch
	}
`

function isQuery(
	entry: routeIsQuery_entry$key,
	{ values: query }: SearchParserResult<string>
) {
	const data = readInlineData(routeIsQuery_entry, entry)

	return (
		(query.status?.some(inRange(data.status)) ?? true) &&
		(query["media-status"]?.some(inRange(data.media?.status)) ?? true) &&
		(query.tags?.every((name) =>
			data.media?.tags?.some((tag) => inRange(tag?.name)(name))
		) ??
			true) &&
		(query.score?.every(inRange(data.score ?? 0)) ?? true) &&
		(query.progress?.every(inRange(data.progress ?? 0)) ?? true) &&
		(query.to_watch?.every(inRange(data.toWatch)) ?? true)
	)
}

function inRange(b: number | string | null | undefined) {
	return (a: string) => {
		if (typeof b === "string") {
			return b.toLocaleLowerCase().includes(a)
		}

		if (typeof b === "number") {
			return a.startsWith(">=")
				? b >= Number(a.slice(2))
				: a.startsWith("<=")
					? b <= Number(a.slice(2))
					: a.startsWith(">")
						? b > Number(a.slice(1))
						: a.startsWith("<")
							? b < Number(a.slice(1))
							: b === Number(a)
		}
		return false
	}
}

function AwaitQuery({ loaderData, actionData }: Route.ComponentProps) {
	const query: routeAwaitQuery_query$key = usePreloadedQuery(
		...loaderData!.NavUserListEntriesQuery
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

	if (lists.length < 1) {
		throw new Error("No list selected")
	}

	// const search = useOptimisticSearchParams()
	const search = new URLSearchParams(useSearchParams()[0])

	const parsed = parse(search.get("filter")?.toLocaleLowerCase() ?? "", {
		keywords: keywords,
	})

	const elements = lists.flatMap((list) => {
		const entries = sortEntries(
			list.entries?.flatMap((el) =>
				el != null && isVisible(el, search) && isQuery(el, parsed) ? [el] : []
			) ?? [],
			{ search, user: data.MediaListCollection.user }
		)

		return entries.length > 0
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
				className="@container relative"
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
								className="absolute top-0 left-0 w-full"
								ref={virtualizer.measureElement}
								data-index={item.index}
							>
								<M3.Subheader>{element.list.name}</M3.Subheader>
							</li>
						)
					}

					if (element?.type === "MediaList") {
						return (
							<li
								style={{
									transform: `translateY(${item.start - virtualizer.options.scrollMargin}px)`,
								}}
								className="absolute top-0 left-0 w-full"
								ref={virtualizer.measureElement}
								data-index={item.index}
								key={`${element.name}:${element.entry.id}`}
							>
								<MediaListItem
									actionData={actionData}
									data-id={element.entry.id}
									entry={element.entry}
									user={data.MediaListCollection.user}
								/>
							</li>
						)
					}

					element satisfies undefined
					return null
				})}
			</List>
		</div>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
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
			<Ariakit.Heading className="text-headline-md text-balance">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="text-body-md overflow-auto">{errorMessage}</pre>
			<Link to={location} className={button()}>
				Try again
			</Link>
		</ExtraOutlets>
	)
}
