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
    type ShouldRevalidateFunction,
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
import { UserListTabsQuery as UserListTabsQueryOperation } from "~/gql/UserListTabsQuery.graphql"

import * as Ariakit from "@ariakit/react"

import { m } from "~/lib/paraglide"
import MaterialSymbolsFilterList from "~icons/material-symbols/filter-list"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsSearch from "~icons/material-symbols/search"

import { MediaListSort } from "~/lib/MediaListSort"

import { copySearchParams } from "~/lib/copySearchParams"

import { captureException } from "@sentry/react"
import { A } from "a"
import { type } from "arktype"
import { ExtraOutlets } from "extra-outlet"
import { Label } from "~/components/Label"
import { button } from "~/lib/button"
import { invariant } from "~/lib/invariant"
import { loadQuery } from "~/lib/Network"
import type { Route } from "./+types/route"
import { UserListTabs, UserListTabsQuery } from "./UserListTabs"
import { type ChipFilter, type ChipFilterCheckbox, ChipFilterRadio } from "~/components/Chip"

export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
	formMethod,
	defaultShouldRevalidate,
}) => {
	if (
		formMethod?.toLocaleUpperCase() === "GET"
		&& currentParams.userName === nextParams.userName
		&& currentParams.typelist === nextParams.typelist
	) {
		return false
	}
	return defaultShouldRevalidate
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

const Typelist = type('"animelist"|"mangalist"')
export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const typelist = invariant(Typelist(args.params.typelist))

	return {
		UserListTabsQuery: args.context.get(loadQuery)<UserListTabsQueryOperation>(
			UserListTabsQuery,
			{
				userName: args.params.userName,
				type: ({ animelist: "ANIME", mangalist: "MANGA" } as const)[typelist],
			}
		),
	}
}

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
				<LayoutPane variant="fixed" className="max-md:hidden">
					<Card variant="elevated" className="max-h-full overflow-y-auto">
						<Form
							action={pathname}
							replace
							onChange={(e) => {
								void submit(e.currentTarget)
							}}
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
												<ChipFilter key={value} data-key={value}>
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
												<ChipFilter key={value} data-key={value}>
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
												<ChipFilter key={value} data-key={value}>
													<ChipFilterCheckbox
														name="progress"
														value={value}
													/>
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
												<ChipFilter key={value} data-key={value}>
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
					<Card variant="elevated" className="max-sm:contents">
						<div className="flex flex-col gap-4">
							<Tabs selectedId={String(params.selected)}>
								<div className="bg-surface sm:bg-surface-container-low sticky top-0 z-50 -mx-4 grid sm:-mt-4">
									<AppBar
										variant="large"
										className="sm:bg-surface-container-low"
									>
										<Icon tooltip title="Show list search">
											<MaterialSymbolsSearch />
										</Icon>
										<AppBarTitle>
											{params.typelist === "animelist"
												? "Anime list"
												: "Manga list"}
										</AppBarTitle>
										<div className="flex-1" />
										<Icon tooltip title="Show list search">
											<MaterialSymbolsSearch />
										</Icon>
										<FilterButton />
										<Icon tooltip title="Show more options">
											<MaterialSymbolsMoreHoriz />
										</Icon>
									</AppBar>
									<UserListTabs queryRef={loaderData.UserListTabsQuery} />
								</div>
								<TabsPanel
									tabId={params.selected}
									className="flex flex-col gap-4"
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

function FilterButton() {
	const { pathname } = useLocation()

	const searchParams = useOptimisticSearchParams()

	searchParams.delete("filter")

	const filterParams = copySearchParams(searchParams)
	filterParams.append("sheet", "filter")

	return (
		<Icon
			className={`md:hidden${searchParams.size > 0 ? "text-tertiary" : ""}`}
			tooltip
			title={"Show list filters"}
			render={<A href={{ search: `?${filterParams}`, pathname }}></A>}
		>
			<MaterialSymbolsFilterList />
		</Icon>
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
			replace
			action={pathname}
			onChange={(e) => {
				void submit(e.currentTarget, {})
			}}
		>
			{sheet && <input type="hidden" name="sheet" value={sheet} />}
			<Sheet
				open={filter || sort}
				onClose={() => {
					void navigate({ search: `?${searchParams}` })
				}}
			>
				<Tabs selectedId={sheet}>
					<TabsList
						grow
						className="bg-surface-container-low sticky top-0 z-10 rounded-t-xl"
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

function SheetSort() {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"
	const listLines = "list-one"

	return (
		<Group>
			<Subheader lines={lines} render={<GroupLabel />} className="-mb-2">
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
							<ListItem render={<Label />} key={value} data-key={value}>
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
				<List render={<div />} className={`-mt-2 ${listLines}`}>
					<CheckboxProvider value={searchParams.getAll("status")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_STATUS_OPTIONS
								: MANGA_STATUS_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem render={<Label />} key={value} data-key={value}>
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
				<List render={<div />} className={`-mt-2 ${listLines}`}>
					<CheckboxProvider value={searchParams.getAll("format")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_FORMAT_OPTIONS
								: MANGA_FORMAT_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem render={<Label />} key={value} data-key={value}>
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
				<List render={<div />} className={`-mt-2 ${listLines}`}>
					<CheckboxProvider value={searchParams.getAll("progress")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_PROGRESS_OPTIONS
								: MANGA_PROGRESS_OPTIONS
						).map(([value, label]) => {
							return (
								<ListItem render={<Label />} key={value} data-key={value}>
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

export type ReadonlyURLSearchParams = Omit<
	URLSearchParams,
	"set" | "append" | "delete" | "sort"
>

const ANIME_STATUS_OPTIONS = {
	"MediaStatus.Finished": m.media_status_finished(),
	"MediaStatus.Releasing": m.media_status_releasing(),
	"MediaStatus.NotYetReleased": m.media_status_not_yet_released(),
	"MediaStatus.Cancelled": m.media_status_cancelled(),
}

const MANGA_STATUS_OPTIONS = {
	"MediaStatus.Finished": m.media_status_finished(),
	"MediaStatus.Releasing": m.media_status_releasing(),
	"MediaStatus.Hiatus": m.media_status_hiatus(),
	"MediaStatus.NotYetReleased": m.media_status_not_yet_released(),
	"MediaStatus.Cancelled": m.media_status_cancelled(),
}

const ANIME_FORMAT_OPTIONS = {
	"MediaFormat.Tv": m.media_format_tv(),
	"MediaFormat.TvShort": m.media_format_tv_short(),
	"MediaFormat.Movie": m.media_format_movie(),
	"MediaFormat.Special": m.media_format_special(),
	"MediaFormat.Ova": m.media_format_ova(),
	"MediaFormat.Ona": m.media_format_ona(),
	"MediaFormat.Music": m.media_format_music(),
}

const ANIME_PROGRESS_OPTIONS = { UNSEEN: "Unwatched", STARTED: "Started" }

const MANGA_PROGRESS_OPTIONS = { UNSEEN: "Unread", STARTED: "Started" }

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
	[MediaListSort.PopularityDesc]: m.media_sort_popularity(),
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
							<A href={location} className={button()}>
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
						variant="elevated"
						className="bg-error-container text-on-error-container m-4"
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
