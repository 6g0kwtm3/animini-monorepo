import { Form, Link, useParams, useRouteLoaderData } from "@remix-run/react"

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
import { route_media } from "../route"
import { MediaCover } from "./MediaListCover"
import { formatWatch, toWatch } from "./toWatch"

const MediaListItem_entry = serverOnly$(
	graphql(`
		fragment ListItem_entry on MediaList {
			...ToWatch_entry
			...Progress_entry
			score
			progress
			media {
				id
				title {
					userPreferred
				}
				...MediaCover_media
			}
		}
	`)
)
export const Library = createContext<
	Record<string, NonEmptyArray<AnitomyResult>>
>({})

export function MediaListItem(props: {
	entry: FragmentType<typeof MediaListItem_entry>
}) {
	const entry = readFragment<typeof MediaListItem_entry>(props.entry)
	const library = useContext(Library)[entry.media?.title?.userPreferred ?? ""]

	const libraryHasNextEpisode = library?.some(
		({ episode }) => episode.number === (entry.progress || 0) + 1
	)

	return (
		entry.media && (
			<li className="col-span-full grid grid-cols-subgrid">
				<ListItem
					render={<Link to={route_media({ id: entry.media.id })}></Link>}
				>
					<ListItemImg>
						<MediaCover
							media={entry.media}
							layoutId={`media-cover-${entry.media.id}`}
						></MediaCover>
					</ListItemImg>
					<ListItemContent>
						<ListItemContentTitle>
							{libraryHasNextEpisode && (
								<span className="i i-inline text-primary">priority_high</span>
								// <span className="i i-inline text-primary">video_library</span>
							)}
							{entry.media.title?.userPreferred}
						</ListItemContentTitle>
						<ListItemContentSubtitle className="flex flex-wrap gap-1">
							<div>
								<span className="i i-inline">grade</span>
								{entry.score}
							</div>
							&middot;
							<div>
								<span className="i i-inline">timer</span>
								{toWatch(entry) > 0
									? formatWatch(toWatch(entry))
									: "Nothing"}{" "}
								to watch
							</div>
						</ListItemContentSubtitle>
					</ListItemContent>
					<ListItemTrailingSupportingText>
						<Progress entry={entry}></Progress>
					</ListItemTrailingSupportingText>
				</ListItem>
			</li>
		)
	)
}

export function ListItemLoader(props: {}) {
	return (
		<ListItem>
			<div className="col-start-1 h-14 w-14">
				<div className="h-14 w-14 animate-pulse bg-surface-container-highest text-transparent"></div>
			</div>
			<div className="col-start-2 grid grid-cols-subgrid">
				<span className="truncate text-body-lg">
					<Skeleton>Mahou Shoujo ni Akogarete</Skeleton>
				</span>
				<div className="flex flex-wrap gap-1 text-body-md text-on-surface-variant">
					<div>
						<Skeleton>
							<span className="i i-inline">grade</span>7
						</Skeleton>
					</div>
					&middot;
					<div>
						<Skeleton>
							<span className="i i-inline">timer</span>
							24min to watch
						</Skeleton>
					</div>
				</div>
			</div>

			<div className="col-start-3 text-label-sm text-on-surface-variant">
				<Skeleton>1/12</Skeleton>
			</div>
		</ListItem>
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
						avalible !== entry.media?.episodes ? (
							<>
								{m.avalible_episodes({ avalible: avalible ?? "unknown" })}
								<br />
								{m.total_episodes({
									total: entry.media?.episodes ?? "unknown"
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
									<ButtonTextIcon>add</ButtonTextIcon>
									{m.increment_progress()}
								</ButtonText>
							</Form>
						</TooltipRichActions>
					)}
			</TooltipRichContainer>
		</TooltipRich>
	)
}
