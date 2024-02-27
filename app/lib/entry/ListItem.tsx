import { Form, NavLink, useParams, useRouteLoaderData } from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import { Predicate } from "effect"
import {
	Button as ButtonText,
	ButtonIcon as ButtonTextIcon
} from "~/components/Button"
import {
	TooltipRich,
	TooltipRichActions,
	TooltipRichContainer,
	TooltipRichSupportingText,
	TooltipRichTrigger
} from "~/components/Tooltip"
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
	ListItemImg,
	ListItemTrailingSupportingText
} from "~/components/List"
import { MediaType } from "~/gql/graphql"
import type { loader as rootLoader } from "~/root"
import MaterialSymbolsPriorityHigh from "~icons/material-symbols/priority-high"
import { route_media } from "../route"
import { MediaCover } from "./MediaListCover"
import { formatWatch, toWatch } from "./toWatch"

import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"

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
export const Library = createContext<
	Record<string, NonEmptyArray<AnitomyResult>>
>({})

export function MediaListItem(props: {
	entry: FragmentType<typeof MediaListItem_entry> | null
}) {
	const entry = readFragment<typeof MediaListItem_entry>(props.entry)

	return (
		<li className="col-span-full grid grid-cols-subgrid">
			<ListItem
				render={
					entry?.media ? (
						<NavLink
							unstable_viewTransition
							to={route_media({ id: entry.media.id })}
						/>
					) : (
						<div />
					)
				}
			>
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
				<ListItemTrailingSupportingText>
					<Skeleton>{entry && <Progress entry={entry} />}</Skeleton>
				</ListItemTrailingSupportingText>
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
	const data = useRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()

	return (
		<TooltipRich placement="top">
			<TooltipRichTrigger>
				{entry.progress}
				{Predicate.isNumber(avalible) ? (
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
				) : (
					""
				)}
			</TooltipRichTrigger>
			<TooltipRichContainer>
				<TooltipRichSupportingText>
					{entry.media?.type === MediaType.Anime ? (
						avalible !== entry.media.episodes ? (
							<>
								{m.avalible_episodes({ avalible: avalible ?? "unknown" })}
								<br />
								{m.total_episodes({
									total: entry.media.episodes ?? "unknown"
								})}
							</>
						) : (
							m.all_avalible()
						)
					) : avalible !== entry.media?.chapters ? (
						<>
							{m.avalible_chapters({ avalible: avalible ?? "unknown" })}
							<br />
							{m.total_chapters({
								total: entry.media?.chapters ?? "unknown"
							})}
						</>
					) : (
						m.all_chapters_avalible()
					)}
				</TooltipRichSupportingText>
				{Predicate.isString(data?.Viewer?.name) &&
					data?.Viewer?.name === params["userName"] && (
						<TooltipRichActions>
							<Form method="post">
								<input type="hidden" name="mediaId" value={entry.media?.id} />
								<input
									type="hidden"
									name="progress"
									value={(entry.progress ?? 0) + 1}
								/>
								<ButtonText type="submit">
									<ButtonTextIcon>
										<MaterialSymbolsAdd />
									</ButtonTextIcon>
									{m.increment_progress()}
								</ButtonText>
							</Form>
						</TooltipRichActions>
					)}
			</TooltipRichContainer>
		</TooltipRich>
	)
}
