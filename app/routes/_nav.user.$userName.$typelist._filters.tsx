import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"
import { Schema } from "@effect/schema"
import type { LoaderFunction, SerializeFrom } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import {
	Form,
	Link,
	Outlet,
	useLocation,
	useNavigate,
	useNavigation,
	useParams,
	useSearchParams,
	useSubmit,
	type ClientLoaderFunctionArgs,
	type ShouldRevalidateFunction
} from "@remix-run/react"

import { Order } from "effect"
import type { ReactNode } from "react"
import { AppBar, AppBarTitle } from "~/components/AppBar"
import { Button as ButtonText, Icon } from "~/components/Button"
import { Card } from "~/components/Card"
import { Checkbox, Radio } from "~/components/Checkbox"
import { ChipFilter } from "~/components/Chip"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentTitle
} from "~/components/List"
import { Sheet, SheetBody } from "~/components/Sheet"
import { Tabs, TabsTab } from "~/components/Tabs"
import { MediaFormat, MediaSort, MediaStatus, MediaType } from "~/gql/graphql"
import { Ariakit } from "~/lib/ariakit"
import { client_get_client } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import { getCacheControl } from "~/lib/getCacheControl"

import { graphql } from "~/lib/graphql"
import { m } from "~/lib/paraglide"
import { HashNavLink } from "~/lib/search/HashNavLink"
import MaterialSymbolsFilterList from "~icons/material-symbols/filter-list"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsSearch from "~icons/material-symbols/search"
import { copySearchParams } from "./copySearchParams"

export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
	formMethod,
	defaultShouldRevalidate
}) => {
	if (
		formMethod?.toUpperCase() === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.typelist === nextParams.typelist
	) {
		return false
	}
	return defaultShouldRevalidate
}

export const loader = (async (args) => {
	const params = await Schema.decodeUnknownSync(
		Schema.struct({
			userName: Schema.string,
			typelist: Schema.literal("animelist", "mangalist")
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

	return json(data, {
		headers: {
			"Cache-Control": getCacheControl(cacheControl)
		}
	})
}) satisfies LoaderFunction
const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	return args.serverLoader<typeof loader>()
}
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
									<ul className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_STATUS_OPTIONS
												: MANGA_STATUS_OPTIONS
										).map(([value, label]) => {
											return (
												<li key={value}>
													<ChipFilter name="status" value={value}>
														{label}
													</ChipFilter>
												</li>
											)
										})}
									</ul>
								</Group>
							</CheckboxProvider>
							<CheckboxProvider value={searchParams.getAll("format")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Format</GroupLabel>
									<ul className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_FORMAT_OPTIONS
												: MANGA_FORMAT_OPTIONS
										).map(([value, label]) => {
											return (
												<li key={value}>
													<ChipFilter name="format" value={value}>
														{label}
													</ChipFilter>
												</li>
											)
										})}
									</ul>
								</Group>
							</CheckboxProvider>
							<CheckboxProvider value={searchParams.getAll("progress")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Progress</GroupLabel>
									<ul className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_PROGRESS_OPTIONS
												: MANGA_PROGRESS_OPTIONS
										).map(([value, label]) => {
											return (
												<li key={value}>
													<ChipFilter name="progress" value={value}>
														{label}
													</ChipFilter>
												</li>
											)
										})}
									</ul>
								</Group>
							</CheckboxProvider>

							<CheckboxProvider value={searchParams.getAll("sort")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Sort</GroupLabel>
									<ul className="flex flex-wrap gap-2">
										{Object.entries(
											params.typelist === "animelist"
												? ANIME_SORT_OPTIONS
												: MANGA_SORT_OPTIONS
										).map(([value, label]) => {
											return (
												<li key={value}>
													<ChipFilter name="sort" value={value}>
														{label}
													</ChipFilter>
												</li>
											)
										})}
									</ul>
								</Group>
							</CheckboxProvider>

							<ButtonText type="submit">Filter</ButtonText>
							<ButtonText type="reset">Reset</ButtonText>
						</Form>
					</Card>
				</LayoutPane>
				<LayoutPane>
					<Card variant="elevated" className="max-sm:contents">
						<div className="flex flex-col gap-4 ">
							<div className="sticky top-0 sm:-mx-4 sm:-mt-4 sm:bg-surface md:static">
								<AppBar
									hide
									className="-mx-4 sm:mx-0 sm:rounded-t-md sm:bg-surface-container-low"
								>
									<div className="flex items-center gap-2 p-2">
										<AppBarTitle>Anime list</AppBarTitle>
										<div className="flex-1" />
										<Icon>
											<MaterialSymbolsSearch />
										</Icon>
										<FilterButton />
										<Icon>
											<MaterialSymbolsMoreHoriz />
										</Icon>
									</div>
									<ListTabs />
								</AppBar>
							</div>
							<Ariakit.HeadingLevel>
								<Outlet />
							</Ariakit.HeadingLevel>
						</div>
					</Card>
				</LayoutPane>
			</LayoutBody>

			<Filter />
		</>
	)
}

function ListTabs() {
	const data = useRawLoaderData<typeof clientLoader>()

	const lists = data?.MediaListCollection?.lists
		?.filter((el) => el != null)
		.sort(
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? ""))
		)

	const [searchParams] = useSearchParams()

	return (
		<Tabs>
			{lists?.map((list, i) => {
				return (
					list.name && (
						<TabsTab key={list.name} to={`${list.name}?${searchParams}`}>
							{list.name}
						</TabsTab>
					)
				)
			})}
		</Tabs>
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
	const params = useParams<"typelist">()

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
				<Tabs
					grow
					className="sticky top-0 z-10 rounded-t-xl bg-surface-container-low"
				>
					<TabsTab render={<HashNavLink to={`?${filterParams}`} />}>
						Filter
					</TabsTab>
					<TabsTab render={<HashNavLink to={`?${sortParams}`} />}>Sort</TabsTab>
				</Tabs>

				<SheetBody>
					<List lines="one" render={<Group />}>
						{filter && (
							<>
								<ListItem
									render={<GroupLabel />}
									className="text-body-md text-on-surface-variant force:hover:state-none"
								>
									<Ariakit.Heading className="col-span-full ">
										Status
									</Ariakit.Heading>
								</ListItem>
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
								<ListItem className="text-body-md text-on-surface-variant force:hover:state-none">
									<Ariakit.Heading className="col-span-full ">
										Format
									</Ariakit.Heading>
								</ListItem>
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
								<ListItem className="text-body-md text-on-surface-variant force:hover:state-none">
									<Ariakit.Heading className="col-span-full ">
										Progress
									</Ariakit.Heading>
								</ListItem>
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
							</>
						)}

						{sort && (
							<>
								<ListItem className="text-body-md text-on-surface-variant force:hover:state-none">
									<Ariakit.Heading className="col-span-full ">
										Sort
									</Ariakit.Heading>
								</ListItem>
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
							</>
						)}
					</List>
				</SheetBody>
			</Sheet>
		</Form>
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
	UNSEEN: "Unseen",
	STARTED: "Started"
}

const MANGA_PROGRESS_OPTIONS = {
	UNSEEN: "Unread",
	STARTED: "Started"
}

const ANIME_SORT_OPTIONS = {
	[MediaSort.TitleEnglish]: m.media_sort_title(),
	[MediaSort.ScoreDesc]: m.media_sort_score(),
	[MediaSort.UpdatedAtDesc]: m.media_sort_last_updated()
}
const MANGA_SORT_OPTIONS = { ...ANIME_SORT_OPTIONS }

const MANGA_FORMAT_OPTIONS = {
	[MediaFormat.Manga]: m.media_format_manga(),
	[MediaFormat.Novel]: m.media_format_novel(),
	[MediaFormat.OneShot]: m.media_format_one_shot()
}
