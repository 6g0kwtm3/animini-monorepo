import {
	Form,
	Link,
	useActionData,
	useNavigation,
	useParams,
	useSearchParams
} from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import { Predicate } from "effect"

import type { FragmentType } from "~/lib/graphql"
import { graphql, useFragment as readFragment } from "~/lib/graphql"

import { avalible as getAvalible } from "../media/avalible"

import type { AnitomyResult } from "anitomy"
import type { NonEmptyArray } from "effect/ReadonlyArray"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { serverOnly$ } from "vite-env-only"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg
} from "~/components/List"
import type { clientLoader as rootLoader } from "~/root"
import MaterialSymbolsPriorityHigh from "~icons/material-symbols/priority-high"

import { route_media } from "../route"
import { MediaCover } from "./MediaListCover"
import { formatWatch, toWatch } from "./toWatch"

import type { clientAction as selectedAction } from "~/routes/_nav.user.$userName.$typelist._filters.$selected"
import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import { M3 } from "../components"
import { useRawRouteLoaderData } from "../data"

const MediaListItem_entry = serverOnly$(
	graphql(`
		fragment ListItem_entry on MediaList {
			...Progress_entry
			...MediaListItemTitle_entry
			...MediaListItemSubtitle_entry
			media {
				id
				...MediaCover_media
			}
		}
	`)
)

export type ListItem_EntryFragment = typeof MediaListItem_entry

export const Library = createContext<
	Record<string, NonEmptyArray<AnitomyResult>>
>({})

export function MediaListItem(props: {
	entry: FragmentType<typeof MediaListItem_entry> | null
}): ReactNode {
	const entry = readFragment<typeof MediaListItem_entry>(props.entry)

	return (
		<li className="col-span-full grid grid-cols-subgrid">
			<ListItem render={<div />}>
				<ListItemImg>
					<Skeleton full>
						{entry?.media ? <MediaCover media={entry.media} /> : null}
					</Skeleton>
				</ListItemImg>
				<ListItemContent
					render={
						entry?.media ? (
							<Link
								unstable_viewTransition
								to={route_media({ id: entry.media.id })}
							/>
						) : (
							<div />
						)
					}
				>
					<ListItemContentTitle>
						<Skeleton>{entry && <MediaListItemTitle entry={entry} />}</Skeleton>
					</ListItemContentTitle>
					<ListItemContentSubtitle className="flex flex-wrap gap-1">
						<Skeleton className="force:max-w-[21.666666666666668ch]">
							{entry && <MediaListItemSubtitle entry={entry} />}
						</Skeleton>
					</ListItemContentSubtitle>
				</ListItemContent>

				<Skeleton>{entry && <Progress entry={entry} />}</Skeleton>
			</ListItem>
		</li>
	)
}

const MediaListItemTitle_entry = serverOnly$(
	graphql(`
		fragment MediaListItemTitle_entry on MediaList {
			id
			progress
			media {
				title {
					userPreferred
				}
			}
		}
	`)
)

function MediaListItemTitle(props: {
	entry: FragmentType<typeof MediaListItemTitle_entry>
}): ReactNode {
	const entry = readFragment<typeof MediaListItemTitle_entry>(props.entry)
	const library = useContext(Library)[entry.media?.title?.userPreferred ?? ""]

	const libraryHasNextEpisode = library?.some(
		({ episode }) => episode.number === (entry.progress || 0) + 1
	)

	return (
		<>
			{libraryHasNextEpisode && (
				<MaterialSymbolsPriorityHigh className="i-inline inline text-primary" />

				// <span className="i-inline text-primary">video_library</span>
			)}
			{entry.media?.title?.userPreferred}
		</>
	)
}

const MediaListItemSubtitle_entry = serverOnly$(
	graphql(`
		fragment MediaListItemSubtitle_entry on MediaList {
			id
			score
			...ToWatch_entry
		}
	`)
)

function MediaListItemSubtitle(props: {
	entry: FragmentType<typeof MediaListItemSubtitle_entry>
}): ReactNode {
	const entry = readFragment<typeof MediaListItemSubtitle_entry>(props.entry)

	return (
		<>
			<div>
				<MaterialSymbolsStarOutline className="i-inline inline" /> {entry.score}
			</div>
			&middot;
			<div>
				<MaterialSymbolsTimerOutline className="i-inline inline" />{" "}
				{toWatch(entry) > 0
					? m.time_to_watch({ time: formatWatch(toWatch(entry)) })
					: m.nothing_to_watch()}
			</div>
		</>
	)
}

const Progress_entry = serverOnly$(
	graphql(`
		fragment Progress_entry on MediaList {
			id
			progress
			media {
				...Avalible_media
				type
				id
				episodes
				chapters
			}
		}
	`)
)

function Progress(props: { entry: FragmentType<typeof Progress_entry> }) {
	const entry = readFragment<typeof Progress_entry>(props.entry)
	const avalible = getAvalible(entry.media)
	const data = useRawRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()
	const actionData = useActionData<typeof selectedAction>()
	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	const [search] = useSearchParams()

	search.set("sheet", String(entry.id))

	return (
		<div className="flex">
			{Predicate.isString(data?.Viewer?.name) &&
				data.Viewer.name === params.userName && (
					<Form className="hidden @md:block" method="post">
						<input type="hidden" name="progress" value={progress + 1} />
						<input type="hidden" name="id" value={entry.id} />
						<input type="hidden" name="intent" value="increment" />
						<M3.Button type="submit">
							<span>
								{progress}
								{Predicate.isNumber(avalible) ? (
									<>
										/
										<span
											className={
												avalible !==
												(entry.media?.episodes ?? entry.media?.chapters)
													? "underline decoration-dotted"
													: ""
											}
										>
											{avalible}
										</span>
									</>
								) : (
									""
								)}
							</span>
							<M3.ButtonIcon>
								<MaterialSymbolsAdd />
							</M3.ButtonIcon>
						</M3.Button>
					</Form>
				)}
			<M3.Icon render={<Link to={`?${search}`} />}>
				<MaterialSymbolsMoreHoriz />
			</M3.Icon>
		</div>
	)
}
