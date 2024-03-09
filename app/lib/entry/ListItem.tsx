import { NavLink, useFetcher, useNavigation, useParams } from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import { Predicate } from "effect"
import { Button, ButtonIcon, Icon } from "~/components/Button"
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
import type { loader as rootLoader } from "~/root"
import MaterialSymbolsPriorityHigh from "~icons/material-symbols/priority-high"
import { route_media } from "../route"
import { MediaCover } from "./MediaListCover"
import { formatWatch, toWatch } from "./toWatch"

import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import { useRawRouteLoaderData } from "../data"

import * as Ariakit from "@ariakit/react"

const MediaListItem_entry = serverOnly$(
	graphql(`
		fragment ListItem_entry on MediaList {
			...ProgressButton_entry
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
}) {
	const entry = readFragment<typeof MediaListItem_entry>(props.entry)

	let children = (
		<>
			<ListItemImg>
				<Skeleton full>
					{entry?.media ? <MediaCover media={entry.media} /> : null}
				</Skeleton>
			</ListItemImg>
			<ListItemContent>
				<ListItemContentTitle>
					<Skeleton>{entry && <MediaListItemTitle entry={entry} />}</Skeleton>
				</ListItemContentTitle>
				<ListItemContentSubtitle className="flex flex-wrap gap-1">
					<Skeleton className="force:max-w-[21.666666666666668ch]">
						{entry && <MediaListItemSubtitle entry={entry} />}
					</Skeleton>
				</ListItemContentSubtitle>
			</ListItemContent>
		</>
	)

	const Wrapper = entry?.media ? (
		<NavLink
			className={"col-span-2 grid grid-flow-col grid-cols-subgrid"}
			unstable_viewTransition
			to={route_media({ id: entry.media.id })}
		>
			{children}
		</NavLink>
	) : (
		<div className={"col-span-2 grid grid-flow-col grid-cols-subgrid"}>
			{children}
		</div>
	)

	return (
		<ListItem>
			{Wrapper}

			<div className="flex justify-end gap-2">
				{entry && (
					<ProgressButton entry={entry}>
						<Progress entry={entry} />
					</ProgressButton>
				)}

				<Icon>
					<MaterialSymbolsMoreHoriz />
				</Icon>
			</div>
		</ListItem>
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

const ProgressButton_entry = serverOnly$(
	graphql(`
		fragment ProgressButton_entry on MediaList {
			id
			progress
			media {
				id
			}
		}
	`)
)

function ProgressButton(props: {
	entry: FragmentType<typeof ProgressButton_entry>
	children?: ReactNode
}) {
	const entry = readFragment<typeof ProgressButton_entry>(props.entry)

	const data = useRawRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()

	const fetcher = useFetcher()

	const progress =
		Number(fetcher.formData?.get("progress")) || entry.progress || 0

	if (
		data?.Viewer?.name === undefined ||
		data.Viewer.name !== params["userName"] ||
		entry.media?.id === undefined
	) {
		return props.children
	}

	return (
		<fetcher.Form method="post" action="/entry/progress/increment">
			<input type="hidden" name="mediaId" value={entry.media.id} />
			<input type="hidden" name="progress" value={progress + 1} />
			<Button type="submit" className="max-sm:hidden md:hidden lg:inline-flex">
				{props.children}
				<ButtonIcon>
					<MaterialSymbolsAdd />
				</ButtonIcon>
				<Ariakit.VisuallyHidden>
					{m.increment_progress()}
				</Ariakit.VisuallyHidden>
			</Button>
		</fetcher.Form>
	)
}

const Progress_entry = serverOnly$(
	graphql(`
		fragment Progress_entry on MediaList {
			id
			progress
			media {
				...Avalible_media
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

	const navigation = useNavigation()

	const progress =
		Number(navigation.formData?.get("progress")) || entry.progress || 0

	return (
		<span>
			{progress}
			{Predicate.isNumber(avalible) && (
				<>
					/
					<span
						className={
							avalible !== (entry.media?.episodes ?? entry.media?.chapters)
								? "underline decoration-dotted"
								: ""
						}
					>
						{avalible}
					</span>
				</>
			)}
		</span>
	)
}
