import { Form, Link, useParams, useRouteLoaderData } from "@remix-run/react"

import { Predicate } from "effect"
import { ButtonText } from "~/components/Button"
import {
	TooltipRich,
	TooltipRichActions,
	TooltipRichContainer,
	TooltipRichSupportingText,
	TooltipRichTrigger
} from "~/components/Tooltip"
import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"

import { avalible as getAvalible } from "../media/avalible"

import type { AnitomyResult } from "anitomy"
import type { NonEmptyArray } from "effect/ReadonlyArray"
import { createContext, useContext } from "react"
import type { loader as rootLoader } from "~/root"
import { formatWatch, toWatch } from "./toWatch"
import List from "~/components/List"

const ListItem_entry = graphql(`
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

export const Library = createContext<
	Record<string, NonEmptyArray<AnitomyResult>>
>({})

export function ListItem(props: {
	entry: FragmentType<typeof ListItem_entry>
}) {
	const entry = readFragment(ListItem_entry, props.entry)
	const library = useContext(Library)[entry.media?.title?.userPreferred ?? ""]

	const libraryHasNextEpisode = library?.some(
		({ episode }) => episode.number === (entry.progress || 0) + 1
	)

	return (
		<List.Item className="">
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
				<span className="line-clamp-1 text-body-lg">
					{libraryHasNextEpisode && (
						<span className="i i-inline text-primary">priority_high</span>
						// <span className="i i-inline text-primary">video_library</span>
					)}
					{entry.media?.title?.userPreferred}
				</span>
				<div className="flex flex-wrap gap-1 text-body-md text-on-surface-variant">
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
				</div>
			</Link>

			<div className="col-start-3 text-label-sm text-on-surface-variant">
				<Progress entry={entry}></Progress>
			</div>
		</List.Item>
	)
}

const Progress_entry = graphql(`
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

function Progress(props: { entry: FragmentType<typeof Progress_entry> }) {
	const entry = readFragment(Progress_entry, props.entry)
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
							Avalible episodes: {avalible ?? "unknown"}
							<br />
							Total episodes: {entry.media?.episodes ?? "unknown"}
						</>
					) : (
						<>All episodes are avalible</>
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
								<ButtonText type="submit" className="">
									<ButtonText.Icon>add</ButtonText.Icon>
									Increment progress
								</ButtonText>
							</Form>
						</TooltipRichActions>
					)}
			</TooltipRichContainer>
		</TooltipRich>
	)
}
