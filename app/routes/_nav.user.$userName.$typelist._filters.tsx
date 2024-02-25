import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"
import { Schema } from "@effect/schema"
import type { LoaderFunction } from "@remix-run/cloudflare"
import type { Params } from "@remix-run/react"
import {
	Form,
	Link,
	Outlet,
	json,
	useLocation,
	useNavigate,
	useNavigation,
	useParams,
	useSearchParams,
	useSubmit
} from "@remix-run/react"

import { Button as ButtonText, Icon } from "~/components/Button"
import { ChipFilter } from "~/components/Chip"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"
import { Remix } from "~/lib/Remix/index.server"
import { createButton } from "~/lib/button"
import { graphql } from "~/lib/graphql"
import type { InferVariables } from "~/lib/urql.server"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"

import { Effect, Order, Predicate, pipe } from "effect"
import { AppBar, AppBarTitle } from "~/components/AppBar"
import { Card } from "~/components/Card"
import { Checkbox } from "~/components/Checkbox"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentTitle
} from "~/components/List"
import { Sheet } from "~/components/Sheet"
import { Tabs, TabsTab } from "~/components/Tabs"
import { useRawLoaderData } from "~/lib/data"
import { m } from "~/lib/paraglide"
import { HashNavLink } from "~/lib/search/HashNavLink"
const { root: button } = createButton()

function FiltersQueryVariables(
	params: Readonly<Params<string>>
): InferVariables<typeof FiltersQuery> {
	const type = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga
	}[String(params["typelist"])]

	if (!type) {
		throw new Error(`Invalid list type`)
	}

	return {
		userName: params["userName"]!,
		type
	}
}

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const params = yield* _(
				Remix.params({
					userName: Schema.string,
					typelist: Schema.string
				})
			)

			const client = yield* _(EffectUrql)

			const data = yield* _(
				client.query(
					graphql(`
						query UserListSelectedFiltersQuery(
							$userName: String!
							$type: MediaType!
						) {
							MediaListCollection(userName: $userName, type: $type) {
								lists {
									name
								}
							}
						}
					`),
					FiltersQueryVariables(params)
				)
			)

			return data
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=15, stale-while-revalidate=45, private"
				}
			})
		),
		Remix.runLoader
	)
}) satisfies LoaderFunction
export default function Filters() {
	const [searchParams] = useSearchParams()

	const data = useRawLoaderData<typeof loader>()

	const submit = useSubmit()

	const { pathname, hash } = useLocation()

	return (
		<>
			<LayoutBody>
				<LayoutPane variant="fixed" className="max-md:hidden">
					<Card variant="elevated" className="max-h-full overflow-y-auto">
						<Form
							replace
							action={[pathname, hash].filter(Boolean).join("")}
							onChange={(e) => submit(e.currentTarget)}
							className="grid grid-cols-2 gap-2"
						>
							<CheckboxProvider defaultValue={searchParams.getAll("status")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Status</GroupLabel>
									<ul className="flex flex-wrap gap-2">
										{Object.entries(ANIME_STATUS_OPTIONS).map(
											([value, label]) => {
												return (
													<li key={value}>
														<ChipFilter name="status" value={value}>
															{label}
														</ChipFilter>
													</li>
												)
											}
										)}
									</ul>
								</Group>
							</CheckboxProvider>
							<CheckboxProvider defaultValue={searchParams.getAll("format")}>
								<Group className="col-span-2" render={<fieldset />}>
									<GroupLabel render={<legend />}>Format</GroupLabel>
									<ul className="flex flex-wrap gap-2">
										{Object.entries(ANIME_FORMAT_OPTIONS).map(
											([value, label]) => {
												return (
													<li key={value}>
														<ChipFilter name="format" value={value}>
															{label}
														</ChipFilter>
													</li>
												)
											}
										)}
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
									className="-mx-4 sm:mx-0 sm:rounded-t-md sm:bg-surface-container-low sm:elevation-1"
								>
									<div className="flex items-center gap-2 p-2">
										<AppBarTitle>Anime list</AppBarTitle>
										<div className="flex-1"></div>
										<Icon>search</Icon>
										<Filter />
										<Icon>more_horiz</Icon>
									</div>

									<ListTabs></ListTabs>
								</AppBar>
							</div>

							<Outlet></Outlet>
						</div>
					</Card>
				</LayoutPane>
			</LayoutBody>
		</>
	)
}

function ListTabs() {
	const data = useRawLoaderData<typeof loader>()
	return (
		<Tabs>
			{data?.MediaListCollection?.lists
				?.filter(Predicate.isNotNull)
				.sort(
					Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? ""))
				)
				?.map((list) => {
					return (
						list.name && (
							<TabsTab key={list.name} to={list.name}>
								{list.name}
							</TabsTab>
						)
					)
				})}
		</Tabs>
	)
}

function Filter() {
	const navigation = useNavigation()

	let location = useLocation()

	if (navigation.state === "loading") {
		location = navigation.location
	}

	const { hash, pathname, search } = location

	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	const submit = useSubmit()

	const params = useParams<"typelist">()

	return (
		<>
			<Icon className="md:hidden" render={<Link to="#filter" />}>
				filter_list
			</Icon>

			<Sheet
				open={hash === "#filter" || hash === "#sort"}
				onClose={() =>
					navigate({
						pathname,
						search
					})
				}
			>
				<Tabs
					grow
					className="sticky top-0 z-10 rounded-t-xl bg-surface-container-low elevation-1"
				>
					<TabsTab render={<HashNavLink to="#filter" />}>Filter</TabsTab>
					<TabsTab render={<HashNavLink to="#sort" />}>Sort</TabsTab>
				</Tabs>

				<Form
					replace
					action={[pathname, hash].filter(Boolean).join("")}
					onChange={(e) => submit(e.currentTarget, {})}
				>
					<List lines="one" render={<Group />}>
						<ListItem
							render={<GroupLabel></GroupLabel>}
							className="text-body-md text-on-surface-variant force:hover:state-none"
						>
							<h2 className="col-span-full ">Status</h2>
						</ListItem>

						<CheckboxProvider defaultValue={searchParams.getAll("status")}>
							{Object.entries(
								params.typelist === "animelist"
									? ANIME_STATUS_OPTIONS
									: MANGA_STATUS_OPTIONS
							).map(([value, label]) => {
								return (
									<ListItem render={<label />} key={value}>
										<Checkbox name="status" value={value}></Checkbox>
										<div className="col-span-2 col-start-2">
											<ListItemContentTitle>{label}</ListItemContentTitle>
										</div>
									</ListItem>
								)
							})}
						</CheckboxProvider>

						<ListItem className="text-body-md text-on-surface-variant force:hover:state-none">
							<h2 className="col-span-full ">Format</h2>
						</ListItem>
						<CheckboxProvider defaultValue={searchParams.getAll("format")}>
							{Object.entries(
								params.typelist === "animelist"
									? ANIME_FORMAT_OPTIONS
									: MANGA_FORMAT_OPTIONS
							).map(([value, label]) => {
								return (
									<ListItem render={<label />} key={value}>
										<Checkbox name="format" value={value}></Checkbox>
										<ListItemContent className="">
											<ListItemContentTitle>{label}</ListItemContentTitle>
										</ListItemContent>
									</ListItem>
								)
							})}
						</CheckboxProvider>
					</List>
				</Form>
			</Sheet>
		</>
	)
}

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

const MANGA_FORMAT_OPTIONS = {
	[MediaFormat.Manga]: m.media_format_manga(),
	[MediaFormat.Novel]: m.media_format_novel(),
	[MediaFormat.OneShot]: m.media_format_one_shot()
}
