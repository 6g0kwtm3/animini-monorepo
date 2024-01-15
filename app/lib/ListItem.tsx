import { Form, Link, useParams, useRouteLoaderData } from "@remix-run/react"

import { Predicate } from "effect"
import { ButtonText } from "~/components/Button"
import {
	TooltipRich,
	TooltipRichActions,
	TooltipRichContainer,
	TooltipRichSupportingText,
	TooltipRichTrigger,
} from "~/components/Tooltip"
import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"

import { avalible as getAvalible } from "./avalible"

import type { AnitomyResult } from "anitomy"
import type { NonEmptyArray } from "effect/ReadonlyArray"
import { createContext, useContext } from "react"
import type { loader as rootLoader } from "~/root"
import { formatWatch, toWatch } from "./toWatch"

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
		({ episode }) => episode.number === entry.progress + 1,
	)

	return (
		<div className="group relative flex grid-flow-col items-start gap-4 px-4 py-3 text-on-surface state-on-surface hover:state-hover">
			{/* <div
				style={{
					gridTemplateColumns: `repeat(${entry.media?.episodes}, minmax(0, 1fr))`,
				}}
				className="absolute grid bottom-0 left-0 right-0 gap-[0.0625rem]"
			>
				{Array.from({ length: entry.progress }).map((_, i) => (
					<div
						style={{
							gridColumnStart: i+1,
						}}
						key={i}
						className={`row-start-1 h-[0.25rem] bg-primary-container`}
					></div>
				))}
			</div> */}
			{/* <div
				style={{
					gridTemplateColumns: `repeat(${entry.media?.episodes}, minmax(0, 1fr))`,
				}}
				className="absolute grid bottom-0 left-0 right-0 gap-[0.0625rem]"
			>
				{Array.from({ length: entry.media.episodes }).map((_, i) => (
					<div
						style={{
							gridColumnStart: i+1,
						}}
						key={i}
						className={`row-start-1 h-[0.0625rem] ${
							Array.isArray(entry.library) &&
							entry.library.some(({ episode }) => episode.number === i+1)
								? "bg-primary"
								: (i < getAvalible(entry.media))
									? "bg-primary-container"
									: "hidden"
						}`}
					></div>
				))}
			</div> */}
			<>
				<div className="relative h-14 w-14 shrink-0">
					{/* {libraryHasNextEpisode && (
						<span className="bg-tertiary border-tertiary-container absolute left-0 -translate-x-1/2 top-0 h-3.5 w-3.5 -translate-y-1/2 transform rounded-full border-2"></span>
					)} */}
					<img
						src={entry.media?.coverImage?.extraLarge || ""}
						className="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
						style={{
							"--bg": `url(${entry.media?.coverImage?.medium})`,
						}}
						loading="lazy"
						alt=""
					/>
					<div className="i hidden p-1 i-12 group-hover:block">more_horiz</div>
				</div>
				<Link to={`/${entry.media?.id}/`}>
					<span className="line-clamp-1 text-balance text-body-lg">
						{entry.media?.title?.userPreferred}
					</span>
					<div className="flex flex-wrap gap-1 text-body-md text-on-surface-variant">
						<div>
							<span className="i i-inline">grade</span>
							{entry.score}
						</div>
						<>
							&middot;
							<div>
								<span className="i i-inline">timer</span>
								{formatWatch(toWatch(entry))} to watch
							</div>
						</>

						{/* {libraryHasNextEpisode ? (
							<>
								&middot;
								<div>
									<span className="i i-inline">next_plan</span>
								</div>
							</>
						) : null} */}

						{/* &middot;
						<div>
							<span className="i i-inline">next_plan</span>
							{behind(entry)} behind
						</div> */}
					</div>
				</Link>

				<div className="ms-auto shrink-0 text-label-sm text-on-surface-variant">
					<Progress entry={entry}></Progress>
				</div>
			</>
		</div>
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
