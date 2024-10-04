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

import {
	Equivalence,
	identity,
	Order,
	pipe,
	Array as ReadonlyArray,
	Record,
} from "effect"

// import {} from 'glob'

import { Schema } from "@effect/schema"

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

import {
	type routeNavUserListEntriesQuery,
	type routeNavUserListEntriesQuery$variables,
} from "~/gql/routeNavUserListEntriesQuery.graphql"
import {
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
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"
import { isVisible } from "./isVisible"

import type { routeIsQuery_entry$key } from "~/gql/routeIsQuery_entry.graphql"
import { parse, type SearchParserResult } from "~/lib/searchQueryParser"
import type Route from "./+types.route"
import type { ComponentProps, ErrorBoundaryProps } from "./+types.route"

const { graphql } = ReactRelay

const NavUserListEntriesSort_entries = graphql`
	fragment routeNavUserListEntriesSort_entries on MediaList @inline {
		id
		progress @include(if: $includeProgress)
		score @include(if: $includeScore)
		startedAt @include(if: $includeStartedAt) {
			...routeFuzzyDateOrder_fuzzyDate
		}
		completedAt @include(if: $includeCompletedAt) {
			...routeFuzzyDateOrder_fuzzyDate
		}
		media {
			id
			popularity @include(if: $includePopularity)
			startDate @include(if: $includeStartDate) {
				...routeFuzzyDateOrder_fuzzyDate
			}
			averageScore @include(if: $includeAvgScore)
			status(version: 2)
			title @include(if: $includeTitle) {
				userPreferred
			}
		}
		updatedAt @include(if: $includeUpdated)
		toWatch @include(if: $includeToWatch)
		...MediaListItem_entry
	}
`

const RouteNavUserListEntriesQuery = graphql`
	query routeNavUserListEntriesQuery(
		$userName: String!
		$type: MediaType!
		$includeStatus: Boolean!
		$includeScore: Boolean!
		$includeMediaStatus: Boolean!
		$includeTags: Boolean!
		$includeToWatch: Boolean!
		$includeTitle: Boolean!
		$includeProgress: Boolean!
		$includeStartedAt: Boolean!
		$includeCompletedAt: Boolean!
		$includePopularity: Boolean!
		$includeStartDate: Boolean!
		$includeAvgScore: Boolean!
		$includeUpdated: Boolean!
	) @raw_response_type {
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
] as const

const eq = Equivalence.mapInput(
	Record.getEquivalence(Equivalence.boolean),
	getFilterParams
)

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const params = Schema.decodeUnknownSync(Params)(args.params)

	const { searchParams } = new URL(args.request.url)

	const data = loadQuery<routeNavUserListEntriesQuery>(
		RouteNavUserListEntriesQuery,
		{
			userName: params.userName,
			type: (
				{
					animelist: "ANIME",
					mangalist: "MANGA",
				} as const
			)[params.typelist],
			...getFilterParams(searchParams),
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
	currentUrl,
	nextUrl,
}) => {
	if (
		formMethod === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.typelist === nextParams.typelist &&
		eq(currentUrl.searchParams, nextUrl.searchParams)
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

function getFilterParams(searchParams: URLSearchParams) {
	const { values } = parse(
		searchParams.get("filter")?.toLocaleLowerCase() ?? "",
		{
			keywords: keywords,
		}
	)

	const sort = values.desc?.concat(values.asc ?? []) ?? values.asc

	return {
		includeMediaStatus: false,
		includeScore: !!(values.score || sort?.includes(MediaListSort.Score)),
		includeStatus: !!values.status,
		includeToWatch: !!(
			values.to_watch || sort?.includes(MediaListSort.ToWatch)
		),
		includeTags: !!values.tags,
		includeAvgScore: !!sort?.includes(MediaListSort.AvgScore),
		includeTitle: !!sort?.includes(MediaListSort.TitleEnglish),
		includeProgress: !!(
			values.progress || sort?.includes(MediaListSort.Progress)
		),
		includeUpdated: !!sort?.includes(MediaListSort.UpdatedTime),
		includeStartedAt: !!sort?.includes(MediaListSort.StartedOn),
		includeCompletedAt: !!sort?.includes(MediaListSort.FinishedOn),
		includeStartDate: !!sort?.includes(MediaListSort.StartDate),
		includePopularity: !!sort?.includes(MediaListSort.Popularity),
	} satisfies Partial<routeNavUserListEntriesQuery$variables>
}

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

	const order: Order.Order<(typeof entries)[number]>[] = []

	for (const [dir, sort] of sorts) {
		if (!Schema.is(Schema.Enums(MediaListSort))(sort)) {
			continue
		}

		function orderEntry<A>(
			self: Order.Order<A>,
			f: (b: (typeof entries)[number]) => A
		) {
			order.push(
				(dir === "desc" ? Order.reverse : identity)(Order.mapInput(self, f))
			)
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

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (sort === MediaListSort.Popularity) {
			orderEntry(Order.number, (entry) => entry.media?.popularity ?? 0)
			continue
		}

		sort satisfies never
	}

	order.push(
		Order.reverse(
			Order.mapInput(Order.number, (entry) => {
				return [
					"RELEASING" satisfies MediaStatus,
					"NOT_YET_RELEASED" satisfies MediaStatus,
				].indexOf(entry.media?.status ?? ("CANCELLED" satisfies MediaStatus))
			})
		)
	)

	return pipe(entries, ReadonlyArray.sortBy(Order.combineAll(order)))
}

const Params = Schema.Struct({
	selected: Schema.optional(Schema.String),
	userName: Schema.String,
	typelist: Schema.Literal("animelist", "mangalist"),
})

export default function Page(props: ComponentProps): ReactNode {
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
		status @include(if: $includeStatus)
		score @include(if: $includeScore)
		progress @include(if: $includeProgress)
		media {
			id
			status(version: 2) @include(if: $includeMediaStatus)
			tags @include(if: $includeTags) {
				id
				name
			}
		}
		toWatch @include(if: $includeToWatch)
	}
`

function isQuery(
	entry: routeIsQuery_entry$key,
	{ values: query }: SearchParserResult<string>
) {
	const data = readInlineData(routeIsQuery_entry, entry)

	return (
		(query.status?.some(inRange(data.status)) ?? true) &&
		(query.tags?.every((name) =>
			data.media?.tags?.some((tag) => inRange(tag?.name)(name))
		) ??
			true) &&
		(query.score?.every(inRange(data.score ?? 0)) ?? true) &&
		(query.progress?.every(inRange(data.progress ?? 0)) ?? true) &&
		(query.to_watch?.every(inRange(data.toWatch)) ?? true)
	)
}

function inRange(b: number | string) {
	return (a: string) => {
		if (typeof b === "object") {
			return false
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
		return b.includes(a)
	}
}

function AwaitQuery({ loaderData, actionData }: ComponentProps) {
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

	if (!ReadonlyArray.isNonEmptyReadonlyArray(lists)) {
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
								actionData={actionData}
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

export function ErrorBoundary({ error }: ErrorBoundaryProps): ReactNode {
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
