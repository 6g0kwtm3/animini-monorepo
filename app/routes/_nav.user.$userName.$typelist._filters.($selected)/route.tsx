import {
	Await,
	Outlet,
	isRouteErrorResponse,
	useRouteError,
	useSearchParams,
	type ClientActionFunction,
	type ShouldRevalidateFunction
} from "@remix-run/react"

import type { MetaFunction } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { useRawLoaderData } from "~/lib/data"

import {
	AwaitLibrary,
	MediaListHeader,
	MediaListHeaderItem,
	MediaListHeaderToWatch
} from "~/lib/list/MediaList"

import { Order, Array as ReadonlyArray } from "effect"

// import {} from 'glob'

import { Schema } from "@effect/schema"
import type { AnitomyResult } from "anitomy"

import { unstable_defineClientLoader } from "@remix-run/react"
import type { NonEmptyArray } from "effect/Array"
import type { ReactNode } from "react"
import { Suspense } from "react"

import { Card } from "~/components/Card"
import { List } from "~/components/List"
import { Loading, Skeleton } from "~/components/Skeleton"
import { Ariakit } from "~/lib/ariakit"

import { client_get_client } from "~/lib/client"

import { MediaListItem } from "~/lib/entry/MediaListItem"
import { increment } from "~/lib/entry/progress/ProgressIncrement"
import { MediaListSort } from "~/lib/MediaListSort"
import { m } from "~/lib/paraglide"

import ReactRelay from "react-relay"
import { readInlineData } from "~/lib/Network"

import type {
	routeNavUserListEntriesFilter_entries$data as NavUserListEntriesFilter_entries$data,
	routeNavUserListEntriesFilter_entries$key as NavUserListEntriesFilter_entries$key
} from "~/gql/routeNavUserListEntriesFilter_entries.graphql"
import { type routeNavUserListEntriesQuery as NavUserListEntriesQuery } from "~/gql/routeNavUserListEntriesQuery.graphql"
import type {
	MediaStatus,
	routeNavUserListEntriesSort_entries$key as NavUserListEntriesSort_entries$key
} from "~/gql/routeNavUserListEntriesSort_entries.graphql"

import type { routeFuzzyDateOrder_fuzzyDate$key as routeFuzzyDate$key } from "~/gql/routeFuzzyDateOrder_fuzzyDate.graphql"
import type {
	MediaListStatus,
	routeUserSetStatusMutation
} from "~/gql/routeUserSetStatusMutation.graphql"

const { graphql } = ReactRelay

const NavUserListEntriesSort_entries = graphql`
	fragment routeNavUserListEntriesSort_entries on MediaList @inline {
		id
		...MediaListItem_entry
		progress
		score
		toWatch
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
	}
`

const NavUserListEntriesFilter_entries = graphql`
	fragment routeNavUserListEntriesFilter_entries on MediaList @inline {
		id
		...routeNavUserListEntriesSort_entries
		...MediaListHeaderToWatch_entries
		toWatch
		progress
		media {
			id
			status(version: 2)
			format
		}
	}
`

const NavUserListEntriesQuery = graphql`
	query routeNavUserListEntriesQuery($userName: String!, $type: MediaType!) {
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
				entries {
					id
					...routeNavUserListEntriesFilter_entries
				}
			}
		}
	}
`

export const clientLoader = unstable_defineClientLoader(async (args) => {
	return {
		Library: Promise.resolve<Record<string, NonEmptyArray<AnitomyResult>>>({}),
		query: fetchSelectedList(args)
	}
})

export const meta = (({ params }) => {
	return [
		{
			title:
				params.typelist === "animelist"
					? `${params.userName}'s anime list`
					: `${params.userName}'s manga list`
		}
	]
}) satisfies MetaFunction<typeof clientLoader>

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
				"%future added value": "%future added value"
			})
		})
	)(formData)

	const client = client_get_client()
	const data = await client.mutation<routeUserSetStatusMutation>({
		mutation: UserSetStatus,
		variables: variables
	})

	if (!data.SaveMediaListEntry) {
		throw new Error("Failed to set status")
	}

	return { SaveMediaListEntry: data.SaveMediaListEntry }
}

export const clientAction = (async (args) => {
	const formData = await args.request.formData()
	if (formData.get("intent") === "increment") {
		return increment(formData)
	}
	if (formData.get("intent") === "set_status") {
		return setStatus(formData)
	}
	throw json(`Unknown intent ${formData.get("intent")}`, {
		status: 400
	})
}) satisfies ClientActionFunction

async function fetchSelectedList(
	args: Parameters<Parameters<typeof unstable_defineClientLoader>[0]>[0]
) {
	const params = Schema.decodeUnknownSync(Params)(args.params)
	const client = await client_get_client()

	const data = await client.operation<NavUserListEntriesQuery>(
		NavUserListEntriesQuery,
		{
			userName: params.userName,
			type: (
				{
					animelist: "ANIME",
					mangalist: "MANGA"
				} as const
			)[params.typelist]
		}
	)

	if (typeof params.selected !== "string") {
		return {
			selectedList: {
				name: "All",
				entries: Object.values(
					Object.fromEntries(
						data?.MediaListCollection?.lists
							?.flatMap((list) => list?.entries)
							.filter((entry) => entry != null)
							.map((entry) => [entry.id, entry]) ?? []
					)
				)
			}
		}
	}

	const selectedList = data?.MediaListCollection?.lists?.find(
		(list) => list?.name === params.selected
	)

	if (!selectedList) {
		throw json("List not found", {
			status: 404
		})
	}

	return {
		selectedList
	}
}

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
	)
])

function sortEntries(
	data: readonly NavUserListEntriesSort_entries$key[],
	searchParams: URLSearchParams
) {
	let entries = data.map((key) =>
		readInlineData(NavUserListEntriesSort_entries, key)
	)
	const sorts = searchParams.getAll("sort")

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
					"NOT_YET_RELEASED" satisfies MediaStatus
				].indexOf(entry.media?.status ?? ("CANCELLED" satisfies MediaStatus))
			})
		)
	)

	return ReadonlyArray.sortBy(Order.reverse(Order.combineAll(order)))(entries)
}

function filterEntries(
	data: readonly NavUserListEntriesFilter_entries$key[],
	searchParams: URLSearchParams
): NavUserListEntriesFilter_entries$data[] {
	let entries = data.map((key) =>
		readInlineData(NavUserListEntriesFilter_entries, key)
	)
	const status = searchParams.getAll("status")
	const format = searchParams.getAll("format")
	const progresses = searchParams.getAll("progress")

	if (status.length) {
		entries = entries.filter((entry) =>
			status.includes(entry.media?.status ?? "")
		)
	}

	if (format.length) {
		entries = entries.filter((entry) =>
			format.includes(entry.media?.format ?? "")
		)
	}

	for (const progress of progresses) {
		if (progress === "UNSEEN") {
			entries = entries.filter((entry) => (entry.toWatch ?? 1) > 0)
		}
		if (progress === "STARTED") {
			entries = entries.filter((entry) => (entry.progress ?? 0) > 0)
		}
	}

	return entries
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
	formMethod,
	defaultShouldRevalidate
}) => {
	if (
		formMethod?.toLocaleUpperCase() === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.typelist === nextParams.typelist &&
		currentParams.selected === nextParams.selected
	) {
		return false
	}
	return defaultShouldRevalidate
}

const Params = Schema.Struct({
	selected: Schema.optional(Schema.String),
	userName: Schema.String,
	typelist: Schema.Literal("animelist", "mangalist")
})

export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof clientLoader>()
	const [search] = useSearchParams()

	return (
		<>
			<MediaListHeader>
				<MediaListHeaderItem subtitle={m.to_watch()}>
					<Suspense fallback={<Skeleton>154h 43min</Skeleton>}>
						<Await resolve={data.query}>
							{({ selectedList }) => (
								<MediaListHeaderToWatch
									entries={filterEntries(
										selectedList.entries?.filter((el) => el != null) ?? [],
										search
									)}
								/>
							)}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
				<MediaListHeaderItem subtitle={m.total_entries()}>
					<Suspense fallback={<Skeleton>80</Skeleton>}>
						<Await resolve={data.query}>
							{({ selectedList }) =>
								filterEntries(
									selectedList.entries?.filter((el) => el != null) ?? [],
									search
								).length
							}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
			</MediaListHeader>

			<div className="-mx-4">
				<div className={``}>
					<List className="@container">
						<Suspense
							fallback={
								<Loading>
									{ReadonlyArray.range(1, 7).map((i) => (
										<MediaListItem key={i} entry={null} />
									))}
								</Loading>
							}
						>
							<Await resolve={data.query}>
								{({ selectedList }) => {
									const mediaList = sortEntries(
										filterEntries(
											selectedList.entries?.filter((el) => el != null) ?? [],
											search
										),
										search
									)
										.filter((el) => el != null)
										.map((entry) => (
											<MediaListItem key={entry.id} entry={entry} />
										))

									return (
										<Suspense fallback={mediaList}>
											<AwaitLibrary resolve={data.Library}>
												{mediaList}
											</AwaitLibrary>
										</Suspense>
									)
								}}
							</Await>
						</Suspense>
					</List>
				</div>
			</div>
			<Outlet />
		</>
	)
}
export function ErrorBoundary(): ReactNode {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<Ariakit.Heading>Oops</Ariakit.Heading>
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
		<Card
			variant="elevated"
			className="m-4 bg-error-container text-on-error-container"
		>
			<Ariakit.Heading className="text-balance text-headline-md">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</Card>
	)
}
