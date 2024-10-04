import {
	Form,
	isRouteErrorResponse,
	Link,
	Outlet,
	useLocation,
	useParams,
	useSearchParams,
	useSubmit,
	type ShouldRevalidateFunction,
} from "react-router"

import { Order } from "effect"
import { type ReactNode } from "react"
import { Card } from "~/components/Card"
import { TabsList, TabsListItem } from "~/components/Tabs"
import type Route from "./+types.route"

import { Ariakit } from "~/lib/ariakit"

import { M3 } from "~/lib/components"
import MaterialSymbolsFilterList from "~icons/material-symbols/filter-list"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsSearch from "~icons/material-symbols/search"

import { copySearchParams } from "~/lib/copySearchParams"
import { route_user_list } from "~/lib/route"

import ReactRelay from "react-relay"
import type { routeNavUserListQuery } from "~/gql/routeNavUserListQuery.graphql"
import { btnIcon, button } from "~/lib/button"
import {
	useOptimisticLocation,
	useOptimisticSearchParams,
} from "~/lib/search/useOptimisticSearchParams"

import { Schema } from "@effect/schema"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"
import type { ErrorBoundaryProps } from "./+types.route"
import { Sheet } from "./Sheet"

const { graphql } = ReactRelay
export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
	formMethod,
	defaultShouldRevalidate,
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

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const typelist = Schema.decodeUnknownSync(
		Schema.Literal("animelist", "mangalist")
	)(args.params.typelist)

	const data = loadQuery<routeNavUserListQuery>(RouteNavUserListQuery, {
		userName: args.params.userName,
		type: (
			{
				animelist: "ANIME",
				mangalist: "MANGA",
			} as const
		)[typelist],
	})

	return { routeNavUserListQuery: data, typelist }
}

const RouteNavUserListQuery = graphql`
	query routeNavUserListQuery($userName: String!, $type: MediaType!)
	@raw_response_type {
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
			}
			user {
				name
				mediaListOptions {
					rowOrder
					animeList {
						sectionOrder
					}
					mangaList {
						sectionOrder
					}
				}
				...User_user
			}
		}
	}
`

function Actions(props: Route.ComponentProps): ReactNode {
	return (
		<>
			<M3.Icon label="Filter">
				<MaterialSymbolsSearch />
			</M3.Icon>
			<FilterButton />
			<M3.Icon label="More">
				<MaterialSymbolsMoreHoriz />
			</M3.Icon>
		</>
	)
}

function Title({ params }: Route.ComponentProps): ReactNode {
	return (
		<>
			{" | "}
			{params.typelist === "animelist" ? "Anime list" : "Manga list"}
		</>
	)
}

export default function Index(props: Route.ComponentProps): ReactNode {
	const params = useParams()
	const submit = useSubmit()
	const [searchParams] = useSearchParams()
	const { pathname } = useLocation()

	return (
		<ExtraOutlets title={<Title {...props} />} actions={<Actions {...props} />}>
			<div className="flex flex-col gap-4">
				<M3.Tabs selectedId={params.selected}>
					<div className="sticky top-16 z-50 grid bg-surface sm:-mt-4 sm:bg-surface-container-low">
						<ListTabs {...props} />
					</div>
					<M3.TabsPanel
						render={<search />}
						tabId={params.selected}
						className="flex flex-col gap-4"
					>
						<Form
							className="px-4"
							replace
							action={pathname}
							onChange={(e) => submit(e.currentTarget, {})}
						>
							<M3.FieldText
								name="filter"
								label="Filter"
								defaultValue={searchParams.get("filter") ?? ""}
							/>
						</Form>
						<Outlet />
					</M3.TabsPanel>
				</M3.Tabs>
			</div>
			<Sheet {...props} />
		</ExtraOutlets>
	)
}

function ListTabs({ params, loaderData }: Route.ComponentProps) {
	const data = usePreloadedQuery(...loaderData!.routeNavUserListQuery)

	const options = Object.fromEntries(
		data.MediaListCollection?.user?.mediaListOptions?.[
			(
				{
					animelist: "animeList",
					mangalist: "mangaList",
				} as const
			)[loaderData!.typelist]
		]?.sectionOrder?.map((key, index) => [key, index]) ?? []
	)

	const lists = data.MediaListCollection?.lists
		?.filter((el) => el != null)
		.sort(
			Order.mapInput(
				Order.number,
				(list) => options[list.name ?? ""] ?? Infinity
			)
		)

	const { search } = useOptimisticLocation()

	return (
		<TabsList>
			<TabsListItem
				id={"undefined"}
				render={
					<Link
						viewTransition
						to={{
							pathname: route_user_list(params),
							search,
						}}
						preventScrollReset
					/>
				}
			>
				All
			</TabsListItem>
			{lists?.map((list, i) => {
				return (
					list.name && (
						<TabsListItem
							key={list.name}
							id={list.name}
							render={
								<Link
									viewTransition
									to={{
										pathname: list.name,
										search,
									}}
									preventScrollReset
								/>
							}
						>
							{list.name}
						</TabsListItem>
					)
				)
			})}
		</TabsList>
	)
}

function FilterButton() {
	let { pathname } = useLocation()

	const searchParams = useOptimisticSearchParams()
	const filterParams = copySearchParams(searchParams)
	filterParams.set("sheet", "filter")

	return (
		<M3.TooltipPlain>
			<M3.TooltipPlainTrigger
				render={
					<Link
						className={btnIcon({
							className: [searchParams.size && "text-tertiary"],
						})}
						to={{
							search: `?${filterParams}`,
							pathname,
						}}
					>
						<span className="sr-only">Filter</span>
						<MaterialSymbolsFilterList />
					</Link>
				}
			/>
			<M3.TooltipPlainContainer>Filter</M3.TooltipPlainContainer>
		</M3.TooltipPlain>
	)
}

export type ReadonlyURLSearchParams = Omit<
	URLSearchParams,
	"set" | "append" | "delete" | "sort"
>

export function ErrorBoundary({ error }: ErrorBoundaryProps): ReactNode {
	let location = useLocation()

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
			<Card variant="elevated">
				<Ariakit.Heading className="text-balance text-headline-md">
					Uh oh ...
				</Ariakit.Heading>
				<p className="text-headline-sm">Something went wrong.</p>
				<pre className="overflow-auto text-body-md">{errorMessage}</pre>{" "}
				<Link to={location} className={button()}>
					Try again
				</Link>
			</Card>
		</ExtraOutlets>
	)
}
