import {
	CheckboxProvider,
	Group,
	GroupLabel,
	RadioProvider
} from "@ariakit/react"
import { Schema } from "@effect/schema"
import {
	Form,
	isRouteErrorResponse,
	Link,
	Outlet,
	unstable_defineClientLoader,
	useLocation,
	useNavigate,
	useNavigation,
	useParams,
	useRouteError,
	useSearchParams,
	useSubmit,
	type ShouldRevalidateFunction
} from "@remix-run/react"

import { Order } from "effect"
import type { ReactNode } from "react"
import { AppBar, AppBarTitle } from "~/components/AppBar"
import { Button as ButtonText, Icon } from "~/components/Button"
import { Card } from "~/components/Card"
import { Checkbox, Radio } from "~/components/Checkbox"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	ListItem,
	ListItemContent,
	ListItemContentTitle
} from "~/components/List"
import { Sheet, SheetBody } from "~/components/Sheet"
import { TabsList, TabsListItem } from "~/components/Tabs"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"
import { Ariakit } from "~/lib/ariakit"
import { useRawLoaderData } from "~/lib/data"
import { getCacheControl } from "~/lib/getCacheControl"

import { M3 } from "~/lib/components"
import { graphql } from "~/lib/graphql"
import { m } from "~/lib/paraglide"
import MaterialSymbolsFilterList from "~icons/material-symbols/filter-list"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsSearch from "~icons/material-symbols/search"

import { MediaListSort } from "~/lib/MediaListSort"
import { client_get_client } from "~/lib/client"
import { copySearchParams } from "~/lib/copySearchParams"
import { route_user_list } from "~/lib/route"

import { unstable_defineLoader } from "@remix-run/cloudflare"

export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
	formMethod,
	defaultShouldRevalidate
}) => {
	if (
		formMethod?.toLocaleUpperCase() === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.typelist === nextParams.typelist
	) {
		return false
	}
	return defaultShouldRevalidate
}
export const loader = unstable_defineLoader(async (args) => {
	const params = await Schema.decodeUnknownSync(
		Schema.Struct({
			userName: Schema.String,
			typelist: Schema.Literal("animelist", "mangalist")
		})
	)(args.params)

	const client = await client_get_client(args)

	const data = await client.operation(UserListSelectedFiltersQuery(), {
		userName: params.userName,
		type: {
			animelist: MediaType.Anime,
			mangalist: MediaType.Manga
		}[params.typelist]
	})

	args.response.headers.append("Cache-Control", getCacheControl(cacheControl))

	return { data, params }
})
const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

export const clientLoader = unstable_defineClientLoader(async (args) =>
	args.serverLoader<typeof loader>()
)
clientLoader.hydrate = true

function UserListSelectedFiltersQuery() {
	return graphql(`
		query UserListSelectedFiltersQuery($userName: String!, $type: MediaType!) {
			MediaListCollection(userName: $userName, type: $type) {
				lists {
					name
				}
			}
		}
	`)
}

function useOptimisticSearchParams(): URLSearchParams {
	const { search } = useOptimisticLocation()

	return new URLSearchParams(search)
}

function useOptimisticLocation() {
	let location = useLocation()
	const navigation = useNavigation()

	if (navigation.location?.pathname === location.pathname) {
		location = navigation.location
	}
	return location
}

export default function Filters(): ReactNode {
	const submit = useSubmit()

	const searchParams = useOptimisticSearchParams()
	const { pathname } = useLocation()
	const params = useParams()

	return (
		<>
			<LayoutBody>
				<LayoutPane variant="fixed" className="max-md:hidden">
					<Card variant="elevated" className="max-h-full overflow-y-auto">
						<Form
							action={pathname}
							replace
							onChange={(e) => submit(e.currentTarget)}
							className="grid grid-cols-2 gap-2"
						>
							<CheckboxProvider value={searchParams.getAll("status")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Status</GroupLabel>
									<div className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_STATUS_OPTIONS
												: MANGA_STATUS_OPTIONS
										).map(([value, label]) => {
											return (
												<M3.ChipFilter key={value}>
													<M3.ChipFilterCheckbox name="status" value={value} />
													{label}
												</M3.ChipFilter>
											)
										})}
									</div>
								</Group>
							</CheckboxProvider>
							<CheckboxProvider value={searchParams.getAll("format")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Format</GroupLabel>
									<div className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_FORMAT_OPTIONS
												: MANGA_FORMAT_OPTIONS
										).map(([value, label]) => {
											return (
												<M3.ChipFilter key={value}>
													<M3.ChipFilterCheckbox name="format" value={value} />
													{label}
												</M3.ChipFilter>
											)
										})}
									</div>
								</Group>
							</CheckboxProvider>
							<CheckboxProvider value={searchParams.getAll("progress")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Progress</GroupLabel>
									<div className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_PROGRESS_OPTIONS
												: MANGA_PROGRESS_OPTIONS
										).map(([value, label]) => {
											return (
												<M3.ChipFilter key={value}>
													<M3.ChipFilterCheckbox
														name="progress"
														value={value}
													/>
													{label}
												</M3.ChipFilter>
											)
										})}
									</div>
								</Group>
							</CheckboxProvider>

							<RadioProvider value={searchParams.get("sort")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Sort</GroupLabel>
									<div className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_SORT_OPTIONS
												: MANGA_SORT_OPTIONS
										).map(([value, label]) => {
											return (
												<M3.ChipFilter key={value}>
													<M3.ChipFilterRadio name="sort" value={value} />
													{label}
												</M3.ChipFilter>
											)
										})}
									</div>
								</Group>
							</RadioProvider>

							<ButtonText type="submit">Filter</ButtonText>
							<ButtonText type="reset">Reset</ButtonText>
						</Form>
					</Card>
				</LayoutPane>
				<LayoutPane>
					<Card variant="elevated" className="max-sm:contents">
						<div className="flex flex-col gap-4">
							<M3.Tabs selectedId={String(params.selected)}>
								<div className="sticky top-0 z-50 -mx-4 grid bg-surface sm:-mt-4 sm:bg-surface-container-low">
									<AppBar
										variant="large"
										className="sm:bg-surface-container-low "
									>
										<Icon>
											<MaterialSymbolsSearch />
										</Icon>
										<AppBarTitle>
											{params.typelist === "animelist"
												? "Anime list"
												: "Manga list"}
										</AppBarTitle>
										<div className="flex-1" />
										<Icon>
											<MaterialSymbolsSearch />
										</Icon>
										<FilterButton />
										<Icon>
											<MaterialSymbolsMoreHoriz />
										</Icon>
									</AppBar>
									<ListTabs />
								</div>
								<M3.TabsPanel
									tabId={params.selected}
									className="flex flex-col gap-4"
								>
									<Ariakit.HeadingLevel>
										<Outlet />
									</Ariakit.HeadingLevel>
								</M3.TabsPanel>
							</M3.Tabs>
						</div>
					</Card>
				</LayoutPane>
			</LayoutBody>

			<Filter />
		</>
	)
}

function ListTabs() {
	const { data, params } = useRawLoaderData<typeof clientLoader>()

	const lists = data?.MediaListCollection?.lists
		?.filter((el) => el != null)
		.sort(
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? ""))
		)

	const [searchParams] = useSearchParams()

	return (
		<TabsList>
			<TabsListItem
				id={"undefined"}
				render={<Link to={`${route_user_list(params)}?${searchParams}`} />}
			>
				All
			</TabsListItem>
			{lists?.map((list, i) => {
				return (
					list.name && (
						<TabsListItem
							key={list.name}
							id={list.name}
							render={<Link to={`${list.name}?${searchParams}`} />}
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

	searchParams.delete("filter")

	const filterParams = copySearchParams(searchParams)
	filterParams.append("sheet", "filter")

	return (
		<Icon
			className={`md:hidden${searchParams.size > 0 ? " text-tertiary" : ""}`}
			render={
				<Link
					to={{
						search: `?${filterParams}`,
						pathname
					}}
				/>
			}
		>
			<MaterialSymbolsFilterList />
		</Icon>
	)
}

function Filter() {
	let { pathname } = useLocation()

	const navigate = useNavigate()
	const searchParams = useOptimisticSearchParams()
	const submit = useSubmit()

	const sheet = searchParams.get("sheet")
	const filter = sheet === "filter"
	const sort = sheet === "sort"
	searchParams.delete("sheet")

	const filterParams = copySearchParams(searchParams)
	filterParams.set("sheet", "filter")

	const sortParams = copySearchParams(searchParams)
	sortParams.set("sheet", "sort")

	return (
		<Form
			replace
			action={pathname}
			onChange={(e) => submit(e.currentTarget, {})}
		>
			{sheet && <input type="hidden" name="sheet" value={sheet} />}
			<Sheet
				open={filter || sort}
				onClose={() => {
					navigate({
						search: `?${searchParams}`
					})
				}}
			>
				<M3.Tabs selectedId={sheet}>
					<TabsList
						grow
						className="sticky top-0 z-10 rounded-t-xl bg-surface-container-low"
					>
						<TabsListItem id="filter" render={<Link to={`?${filterParams}`} />}>
							Filter
						</TabsListItem>
						<TabsListItem id="sort" render={<Link to={`?${sortParams}`} />}>
							Sort
						</TabsListItem>
					</TabsList>

					<M3.TabsPanel tabId={sheet}>
						<SheetBody>
							{filter && <SheetFilter />}
							{sort && <SheetSort />}
						</SheetBody>
					</M3.TabsPanel>
				</M3.Tabs>
			</Sheet>
		</Form>
	)
}

function SheetSort() {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"

	return (
		<Group>
			<M3.Subheader lines={lines} render={<GroupLabel />} className="-mb-2">
				Sort
			</M3.Subheader>
			<M3.List lines={lines} render={<div />}>
				<CheckboxProvider value={searchParams.getAll("sort")}>
					{Object.entries(
						params.typelist === "animelist"
							? ANIME_SORT_OPTIONS
							: MANGA_SORT_OPTIONS
					).map(([value, label]) => {
						return (
							<ListItem render={<label />} key={value}>
								<Radio name="sort" value={value} />
								<ListItemContent>
									<ListItemContentTitle>{label}</ListItemContentTitle>
								</ListItemContent>
							</ListItem>
						)
					})}
				</CheckboxProvider>
			</M3.List>
		</Group>
	)
}

function SheetFilter() {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"

	return (
		<>
			<Group>
				<M3.Subheader lines={lines} render={<GroupLabel />}>
					Status
				</M3.Subheader>
				<M3.List lines={lines} render={<div />} className="-mt-2">
					<CheckboxProvider value={searchParams.getAll("status")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_STATUS_OPTIONS
								: MANGA_STATUS_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem render={<label />} key={value}>
									<Checkbox name="status" value={value} />
									<div className="col-span-2 col-start-2">
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</div>
								</ListItem>
							)
						})}
					</CheckboxProvider>
				</M3.List>
			</Group>
			<Group>
				<M3.Subheader lines={lines} render={<GroupLabel />}>
					Format
				</M3.Subheader>
				<M3.List lines={lines} render={<div />} className="-mt-2">
					<CheckboxProvider value={searchParams.getAll("format")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_FORMAT_OPTIONS
								: MANGA_FORMAT_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem render={<label />} key={value}>
									<Checkbox name="format" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</ListItem>
							)
						})}
					</CheckboxProvider>
				</M3.List>
			</Group>
			<Group>
				<M3.Subheader lines={lines} render={<GroupLabel />}>
					Progress
				</M3.Subheader>
				<M3.List lines={lines} render={<div />} className="-mt-2">
					<CheckboxProvider value={searchParams.getAll("progress")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_PROGRESS_OPTIONS
								: MANGA_PROGRESS_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem render={<label />} key={value}>
									<Checkbox name="progress" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</ListItem>
							)
						})}
					</CheckboxProvider>
				</M3.List>
			</Group>
		</>
	)
}

export type ReadonlyURLSearchParams = Omit<
	URLSearchParams,
	"set" | "append" | "delete" | "sort"
>

const ANIME_STATUS_OPTIONS = {
	[MediaStatus.Finished]: m.media_status_finished(),
	[MediaStatus.Releasing]: m.media_status_releasing(),
	[MediaStatus.NotYetReleased]: m.media_status_not_yet_released(),
	[MediaStatus.Cancelled]: m.media_status_cancelled()
}

const MANGA_STATUS_OPTIONS = {
	[MediaStatus.Finished]: m.media_status_finished(),
	[MediaStatus.Releasing]: m.media_status_releasing(),
	[MediaStatus.Hiatus]: m.media_status_hiatus(),
	[MediaStatus.NotYetReleased]: m.media_status_not_yet_released(),
	[MediaStatus.Cancelled]: m.media_status_cancelled()
}

const ANIME_FORMAT_OPTIONS = {
	[MediaFormat.Tv]: m.media_format_tv(),
	[MediaFormat.TvShort]: m.media_format_tv_short(),
	[MediaFormat.Movie]: m.media_format_movie(),
	[MediaFormat.Special]: m.media_format_special(),
	[MediaFormat.Ova]: m.media_format_ova(),
	[MediaFormat.Ona]: m.media_format_ona(),
	[MediaFormat.Music]: m.media_format_music()
}

const ANIME_PROGRESS_OPTIONS = {
	UNSEEN: "Unwatched",
	STARTED: "Started"
}

const MANGA_PROGRESS_OPTIONS = {
	UNSEEN: "Unread",
	STARTED: "Started"
}

const ANIME_SORT_OPTIONS = {
	[MediaListSort.TitleEnglish]: m.media_sort_title(),
	[MediaListSort.ScoreDesc]: m.media_sort_score(),
	[MediaListSort.ProgressDesc]: m.media_sort_progress(),
	[MediaListSort.UpdatedTimeDesc]: m.media_sort_last_updated(),
	[MediaListSort.IdDesc]: m.media_sort_last_added(),
	[MediaListSort.StartedOnDesc]: m.media_sort_start_date(),
	[MediaListSort.FinishedOnDesc]: m.media_sort_completed_date(),
	[MediaListSort.StartDateDesc]: m.media_sort_release_date(),
	[MediaListSort.AvgScore]: m.media_sort_avg_score(),
	[MediaListSort.PopularityDesc]: m.media_sort_popularity()
}

const MANGA_SORT_OPTIONS = { ...ANIME_SORT_OPTIONS }

const MANGA_FORMAT_OPTIONS = {
	[MediaFormat.Manga]: m.media_format_manga(),
	[MediaFormat.Novel]: m.media_format_novel(),
	[MediaFormat.OneShot]: m.media_format_one_shot()
}

export function ErrorBoundary(): ReactNode {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<LayoutBody>
				<LayoutPane>
					<div>
						<Ariakit.Heading>Oops</Ariakit.Heading>
						<p>Status: {error.status}</p>
						<p>{error.data}</p>
						<M3.Button render={<Link to="." />}>Try again</M3.Button>
					</div>
				</LayoutPane>
			</LayoutBody>
		)
	}

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<LayoutBody>
			<LayoutPane>
				<Card
					variant="elevated"
					className="m-4 force:bg-error-container force:text-on-error-container"
				>
					<Ariakit.Heading className="text-balance text-headline-md">
						Uh oh ...
					</Ariakit.Heading>
					<p className="text-headline-sm">Something went wrong.</p>
					<pre className="overflow-auto text-body-md">{errorMessage}</pre>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
