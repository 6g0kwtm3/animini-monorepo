import {
	CheckboxProvider,
	Group,
	GroupLabel,
	RadioProvider,
} from "@ariakit/react"
import {
	Form,
	isRouteErrorResponse,
	Outlet,
	useLocation,
	useNavigate,
	useNavigation,
	useParams,
	useRouteError,
	useSubmit,
} from "react-router"

import type { ReactNode } from "react"
import { AppBar, AppBarTitle } from "~/components/AppBar"
import { Button as ButtonText, Icon } from "~/components/Button"
import { Card } from "~/components/Card"
import { Checkbox, Radio } from "~/components/Checkbox"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentTitle,
	Subheader,
} from "~/components/List"
import { Sheet, SheetBody } from "~/components/Sheet"
import { Tabs, TabsList, TabsListItem, TabsPanel } from "~/components/Tabs"
import type { UserListTabsQuery as UserListTabsQueryOperation } from "~/gql/UserListTabsQuery.graphql"

import * as Ariakit from "@ariakit/react"

import { m } from "~/lib/paraglide"
import MaterialSymbolsFilterList from "~icons/material-symbols/filter-list"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsSearch from "~icons/material-symbols/search"

import { MediaListSort } from "~/lib/MediaListSort"

import { copySearchParams } from "~/lib/copySearchParams"

import { A } from "@anitrove/a"
import { captureException } from "@sentry/react"
import { type } from "arktype"
import { ExtraOutlets } from "extra-outlet"
import {
	ChipFilter,
	ChipFilterCheckbox,
	ChipFilterRadio,
} from "~/components/Chip"
import { Label } from "~/components/Label"
import { button } from "~/lib/button"
import { invariant } from "~/lib/invariant"
import { loadQuery } from "~/lib/Network"
import type { Route } from "./+types/route"
import { UserListTabs, UserListTabsQuery } from "./UserListTabs"

function useOptimisticLocation() {
	let location = useLocation()
	const navigation = useNavigation()

	if (navigation.location?.pathname === location.pathname) {
		location = navigation.location
	}
	return location
}

function useOptimisticSearchParams(): URLSearchParams {
	const { search } = useOptimisticLocation()

	return new URLSearchParams(search)
}

const Typelist = type('"animelist"|"mangalist"')
export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const typelist = invariant(Typelist(args.params.typelist))

	return {
		UserListTabsQuery: args.context.get(loadQuery)<UserListTabsQueryOperation>(
			UserListTabsQuery,
			{
				type: ({ animelist: "ANIME", mangalist: "MANGA" } as const)[typelist],
				userName: args.params.userName,
			}
		),
	}
}

export type ReadonlyURLSearchParams = Omit<
	URLSearchParams,
	"append" | "delete" | "set" | "sort"
>

export default function Filters({
	loaderData,
}: Route.ComponentProps): ReactNode {
	const submit = useSubmit()

	const searchParams = useOptimisticSearchParams()
	const { pathname } = useLocation()
	const params = useParams()

	return (
		<ExtraOutlets>
			<LayoutBody>
				<LayoutPane className="max-md:hidden" variant="fixed">
					<Card className="max-h-full overflow-y-auto" variant="elevated">
						<Form
							action={pathname}
							className="grid grid-cols-2 gap-2"
							onChange={(e) => {
								void submit(e.currentTarget)
							}}
							replace
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
												<ChipFilter data-key={value} key={value}>
													<ChipFilterCheckbox name="status" value={value} />
													{label}
												</ChipFilter>
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
												<ChipFilter data-key={value} key={value}>
													<ChipFilterCheckbox name="format" value={value} />
													{label}
												</ChipFilter>
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
												<ChipFilter data-key={value} key={value}>
													<ChipFilterCheckbox name="progress" value={value} />
													{label}
												</ChipFilter>
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
												<ChipFilter data-key={value} key={value}>
													<ChipFilterRadio name="sort" value={value} />
													{label}
												</ChipFilter>
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
					<Card className="max-sm:contents" variant="elevated">
						<div className="flex flex-col gap-4">
							<Tabs selectedId={String(params.selected)}>
								<div className="bg-surface sm:bg-surface-container-low sticky top-0 z-50 -mx-4 grid sm:-mt-4">
									<AppBar
										className="sm:bg-surface-container-low"
										variant="large"
									>
										<Icon title="Show list search" tooltip>
											<MaterialSymbolsSearch />
										</Icon>
										<AppBarTitle>
											{params.typelist === "animelist"
												? "Anime list"
												: "Manga list"}
										</AppBarTitle>
										<div className="flex-1" />
										<Icon title="Show list search" tooltip>
											<MaterialSymbolsSearch />
										</Icon>
										<FilterButton />
										<Icon title="Show more options" tooltip>
											<MaterialSymbolsMoreHoriz />
										</Icon>
									</AppBar>
									<UserListTabs queryRef={loaderData.UserListTabsQuery} />
								</div>
								<TabsPanel
									className="flex flex-col gap-4"
									tabId={params.selected}
								>
									<Ariakit.HeadingLevel>
										<Outlet />
									</Ariakit.HeadingLevel>
								</TabsPanel>
							</Tabs>
						</div>
					</Card>
				</LayoutPane>
			</LayoutBody>

			<Filter />
		</ExtraOutlets>
	)
}

function Filter() {
	const { pathname } = useLocation()

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
			action={pathname}
			onChange={(e) => {
				void submit(e.currentTarget, {})
			}}
			replace
		>
			{sheet && <input name="sheet" type="hidden" value={sheet} />}
			<Sheet
				onClose={() => {
					void navigate({ search: `?${searchParams}` })
				}}
				open={filter || sort}
			>
				<Tabs selectedId={sheet}>
					<TabsList
						className="bg-surface-container-low sticky top-0 z-10 rounded-t-xl"
						grow
					>
						<TabsListItem
							id="filter"
							render={<A href={`?${filterParams}`}></A>}
						>
							Filter
						</TabsListItem>
						<TabsListItem id="sort" render={<A href={`?${sortParams}`}></A>}>
							Sort
						</TabsListItem>
					</TabsList>

					<TabsPanel tabId={sheet}>
						<SheetBody>
							{filter && <SheetFilter />}
							{sort && <SheetSort />}
						</SheetBody>
					</TabsPanel>
				</Tabs>
			</Sheet>
		</Form>
	)
}

function FilterButton() {
	const { pathname } = useLocation()

	const searchParams = useOptimisticSearchParams()

	searchParams.delete("filter")

	const filterParams = copySearchParams(searchParams)
	filterParams.append("sheet", "filter")

	return (
		<Icon
			className={`md:hidden${searchParams.size > 0 ? "text-tertiary" : ""}`}
			render={<A href={{ pathname, search: `?${filterParams}` }}></A>}
			title={"Show list filters"}
			tooltip
		>
			<MaterialSymbolsFilterList />
		</Icon>
	)
}

function SheetFilter() {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"
	const listLines = "list-one"
	return (
		<>
			<Group>
				<Subheader lines={lines} render={<GroupLabel />}>
					Status
				</Subheader>
				<List className={`-mt-2 ${listLines}`} render={<div />}>
					<CheckboxProvider value={searchParams.getAll("status")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_STATUS_OPTIONS
								: MANGA_STATUS_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem data-key={value} key={value} render={<Label />}>
									<Checkbox name="status" value={value} />
									<div className="col-span-2 col-start-2">
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</div>
								</ListItem>
							)
						})}
					</CheckboxProvider>
				</List>
			</Group>
			<Group>
				<Subheader lines={lines} render={<GroupLabel />}>
					Format
				</Subheader>
				<List className={`-mt-2 ${listLines}`} render={<div />}>
					<CheckboxProvider value={searchParams.getAll("format")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_FORMAT_OPTIONS
								: MANGA_FORMAT_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem data-key={value} key={value} render={<Label />}>
									<Checkbox name="format" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</ListItem>
							)
						})}
					</CheckboxProvider>
				</List>
			</Group>
			<Group>
				<Subheader lines={lines} render={<GroupLabel />}>
					Progress
				</Subheader>
				<List className={`-mt-2 ${listLines}`} render={<div />}>
					<CheckboxProvider value={searchParams.getAll("progress")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_PROGRESS_OPTIONS
								: MANGA_PROGRESS_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem data-key={value} key={value} render={<Label />}>
									<Checkbox name="progress" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</ListItem>
							)
						})}
					</CheckboxProvider>
				</List>
			</Group>
		</>
	)
}

function SheetSort() {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"
	const listLines = "list-one"

	return (
		<Group>
			<Subheader className="-mb-2" lines={lines} render={<GroupLabel />}>
				Sort
			</Subheader>
			<List className={listLines} render={<div />}>
				<CheckboxProvider value={searchParams.getAll("sort")}>
					{Object.entries(
						params.typelist === "animelist"
							? ANIME_SORT_OPTIONS
							: MANGA_SORT_OPTIONS
					).map(([value, label]) => {
						return (
							<ListItem data-key={value} key={value} render={<Label />}>
								<Radio name="sort" value={value} />
								<ListItemContent>
									<ListItemContentTitle>{label}</ListItemContentTitle>
								</ListItemContent>
							</ListItem>
						)
					})}
				</CheckboxProvider>
			</List>
		</Group>
	)
}

const ANIME_STATUS_OPTIONS = {
	"MediaStatus.Cancelled": m.media_status_cancelled(),
	"MediaStatus.Finished": m.media_status_finished(),
	"MediaStatus.NotYetReleased": m.media_status_not_yet_released(),
	"MediaStatus.Releasing": m.media_status_releasing(),
}

const MANGA_STATUS_OPTIONS = {
	"MediaStatus.Cancelled": m.media_status_cancelled(),
	"MediaStatus.Finished": m.media_status_finished(),
	"MediaStatus.Hiatus": m.media_status_hiatus(),
	"MediaStatus.NotYetReleased": m.media_status_not_yet_released(),
	"MediaStatus.Releasing": m.media_status_releasing(),
}

const ANIME_FORMAT_OPTIONS = {
	"MediaFormat.Movie": m.media_format_movie(),
	"MediaFormat.Music": m.media_format_music(),
	"MediaFormat.Ona": m.media_format_ona(),
	"MediaFormat.Ova": m.media_format_ova(),
	"MediaFormat.Special": m.media_format_special(),
	"MediaFormat.Tv": m.media_format_tv(),
	"MediaFormat.TvShort": m.media_format_tv_short(),
}

const ANIME_PROGRESS_OPTIONS = { STARTED: "Started", UNSEEN: "Unwatched" }

const MANGA_PROGRESS_OPTIONS = { STARTED: "Started", UNSEEN: "Unread" }

const ANIME_SORT_OPTIONS = {
	[MediaListSort.AvgScore]: m.media_sort_avg_score(),
	[MediaListSort.FinishedOnDesc]: m.media_sort_completed_date(),
	[MediaListSort.IdDesc]: m.media_sort_last_added(),
	[MediaListSort.PopularityDesc]: m.media_sort_popularity(),
	[MediaListSort.ProgressDesc]: m.media_sort_progress(),
	[MediaListSort.ScoreDesc]: m.media_sort_score(),
	[MediaListSort.StartDateDesc]: m.media_sort_release_date(),
	[MediaListSort.StartedOnDesc]: m.media_sort_start_date(),
	[MediaListSort.TitleEnglish]: m.media_sort_title(),
	[MediaListSort.UpdatedTimeDesc]: m.media_sort_last_updated(),
}

const MANGA_SORT_OPTIONS = { ...ANIME_SORT_OPTIONS }

const MANGA_FORMAT_OPTIONS = {
	"MediaFormat.Manga": m.media_format_manga(),
	"MediaFormat.Novel": m.media_format_novel(),
	"MediaFormat.OneShot": m.media_format_one_shot(),
}

export function ErrorBoundary(): ReactNode {
	const error = useRouteError()
	const location = useLocation()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<ExtraOutlets>
				<LayoutBody>
					<LayoutPane>
						<div>
							<Ariakit.Heading>Oops</Ariakit.Heading>
							<p>Status: {error.status}</p>
							<p>{error.data}</p>
							<A className={button()} href={location}>
								Try again
							</A>
						</div>
					</LayoutPane>
				</LayoutBody>
			</ExtraOutlets>
		)
	}
	captureException(error)
	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<ExtraOutlets>
			<LayoutBody>
				<LayoutPane>
					<Card
						className="bg-error-container text-on-error-container m-4"
						variant="elevated"
					>
						<Ariakit.Heading className="text-headline-md text-balance">
							Uh oh ...
						</Ariakit.Heading>
						<p className="text-headline-sm">Something went wrong.</p>
						<pre className="text-body-md overflow-auto">{errorMessage}</pre>
					</Card>
				</LayoutPane>
			</LayoutBody>
		</ExtraOutlets>
	)
}
