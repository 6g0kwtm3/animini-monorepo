import { Form, Link, useParams, useRouteLoaderData } from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import { Predicate } from "effect"
import { ButtonText, ButtonTextIcon } from "~/components/Button"
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
import List from "~/components/List"
import type { loader as rootLoader } from "~/root"
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
				coverImage {
					extraLarge
					medium
				}
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
		<List.Item >
			<div className="col-start-1 h-14 w-14">
				<img
					src={entry.media?.coverImage?.extraLarge || ""}
					className="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
					style={{
						"--bg": `url(${entry.media?.coverImage?.medium})`
					}}
					loading="lazy"
					alt=""
				/>
				<div className="i hidden p-1 i-12 group-hover:block">more_horiz</div>
			</div>
			<Link
				to={`/media/${entry.media?.id}/`}
				className="col-start-2 grid grid-cols-subgrid"
			>
				<List.Item.Title >
					{libraryHasNextEpisode && (
						<span className="i i-inline text-primary">priority_high</span>
						// <span className="i i-inline text-primary">video_library</span>
					)}
					{entry.media?.title?.userPreferred}
				</List.Item.Title>
				<List.Item.Subtitle className="flex flex-wrap gap-1">
					<div>
						<span className="i i-inline">grade</span>
						{entry.score}
					</div>
					&middot;
					<div>
						<span className="i i-inline">timer</span>
						{toWatch(entry) > 0 ? formatWatch(toWatch(entry)) : "Nothing"} to
						watch
					</div>
				</List.Item.Subtitle>
			</Link>

			<div className="col-start-3 text-label-sm text-on-surface-variant">
				<Progress entry={entry}></Progress>
			</div>
		</List.Item>
	)
}

export function ListItemLoader(props: {}) {
	return (
		<List.Item >
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
		</List.Item>
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
			<TooltipRichTrigger className="relative">
				{entry.progress}
				{Predicate.isNumber(avalible) ? (
					<>
						/
						<span
							className={
								avalible != entry.media?.episodes
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
					{avalible !== entry.media?.episodes ? (
						<>
							{m.avalible_episodes({ avalible: avalible ?? "unknown" })}
							<br />
							{m.total_episodes({
								total: entry.media?.episodes ?? "unknown"
							})}
						</>
					) : (
						<>{m.all_avalible()}</>
					)}
				</TooltipRichSupportingText>
				{Predicate.isString(data?.Viewer?.name) &&
					data.Viewer.name === params["userName"] && (
						<TooltipRichActions>
							<Form method="post">
								<input type="hidden" name="mediaId" value={entry.media?.id} />
								<input
									type="hidden"
									name="progress"
									value={(entry.progress ?? 0) + 1}
								/>
								<ButtonText type="submit" >
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
