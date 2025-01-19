import { type ComponentProps, type ReactNode } from "react"
import ReactRelay from "react-relay"
import { Form, useNavigation, useParams, useSearchParams } from "react-router"
import * as Predicate from "~/lib/Predicate"
import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsFavorite from "~icons/material-symbols/favorite"
import MaterialSymbolsForward from "~icons/material-symbols/forward"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsPlaylistAdd from "~icons/material-symbols/playlist-add"
import { M3 } from "../components"
import { useFragment } from "../Network"

import type { Progress_entry$key } from "~/gql/Progress_entry.graphql"
import type { ProgressIncrement_entry$key } from "~/gql/ProgressIncrement_entry.graphql"
import type { ProgressMoreMenu_entry$key } from "~/gql/ProgressMoreMenu_entry.graphql"
import type { ProgressShareMedia_media$key } from "~/gql/ProgressShareMedia_media.graphql"
import type { ProgressTooltip_media$key } from "~/gql/ProgressTooltip_media.graphql"
import type { MediaListStatus } from "~/gql/routeUserSetStatusMutation.graphql"
import { btnIcon } from "../button"
const { graphql } = ReactRelay

const ProgressIncrement_entry = graphql`
	fragment ProgressIncrement_entry on MediaList {
		id
		progress
		media {
			id
			...ProgressTooltip_media
		}
		...Progress_entry
	}
`

const ProgressIncrement_viewer = graphql`
	fragment ProgressIncrement_viewer on User {
		id
		name
	}
`

import type { ProgressIncrement_viewer$key } from "~/gql/ProgressIncrement_viewer.graphql"
import type { Route as SelectedRoute } from "../../routes/UserListSelected/+types/route"

export function ProgressIncrement(props: {
	entry: ProgressIncrement_entry$key
	actionData: SelectedRoute.ComponentProps["actionData"] | undefined
	viewer: ProgressIncrement_viewer$key | null | undefined
}): ReactNode {
	const entry = useFragment(ProgressIncrement_entry, props.entry)
	const viewer = useFragment(ProgressIncrement_viewer, props.viewer)
	const params = useParams()
	const navigation = useNavigation()

	const optimisticEntry =
		props.actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const [search] = useSearchParams()

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	search.set("sheet", String(entry.id))

	return (
		Predicate.isString(viewer?.name) &&
		viewer.name === params.userName && (
			<Form className="" method="post">
				<input type="hidden" name="progress" value={progress + 1} />
				<input type="hidden" name="id" value={entry.id} />
				<input type="hidden" name="intent" value="increment" />

				<M3.Button type="submit" className={"hidden @lg:inline-flex"}>
					<Progress entry={entry} actionData={props.actionData} />
					<M3.ButtonIcon>
						<MaterialSymbolsAdd />
					</M3.ButtonIcon>
				</M3.Button>
				<M3.Icon
					label="Increment progress"
					type="submit"
					tooltip={false}
					className={"@lg:hidden"}
				>
					<MaterialSymbolsAdd />
				</M3.Icon>
			</Form>
		)
	)
}

const ProgressTooltip_media = graphql`
	fragment ProgressTooltip_media on Media {
		id
		episodes
		chapters
		avalible
	}
`

export function ProgressTooltip(props: {
	media: ProgressTooltip_media$key
}): ReactNode {
	const media = useFragment(ProgressTooltip_media, props.media)

	const episodes = media.episodes ?? media.chapters

	return (
		media.avalible !== episodes && (
			<M3.TooltipPlainContainer>
				{!episodes ? (
					<>some more to release</>
				) : Predicate.isNumber(media.avalible) ? (
					<>{episodes - media.avalible} more to release</>
				) : (
					<>more to release</>
				)}
			</M3.TooltipPlainContainer>
		)
	)
}

const Progress_entry = graphql`
	fragment Progress_entry on MediaList {
		id
		progress
		media {
			id
			episodes
			chapters
			avalible
		}
	}
`

const ProgressMoreMenu_entry = graphql`
	fragment ProgressMoreMenu_entry on MediaList {
		id
		media {
			id
			...ProgressShareMedia_media
		}
	}
`

export function MoreMenu(props: {
	entry: ProgressMoreMenu_entry$key
}): ReactNode {
	const entry = useFragment(ProgressMoreMenu_entry, props.entry)

	return (
		<M3.Menu>
			<M3.MenuTrigger className={btnIcon()}>
				<MaterialSymbolsMoreHoriz />
				<M3.TouchTarget />
			</M3.MenuTrigger>
			<M3.MenuList>
				{/* <form action="">
            <M3.MenuListItem>
                <M3.MenuItemLeadingIcon>
                    <MaterialSymbolsPlaylistAdd />
                </M3.MenuItemLeadingIcon>
                Save
            </M3.MenuListItem>
        </form> */}
				<M3.MenuListItem>
					<M3.MenuItemLeadingIcon />
					Edit
				</M3.MenuListItem>
				{entry.media && <ShareMedia media={entry.media} />}
				<M3.MenuListItem>
					<M3.MenuItemLeadingIcon>
						<MaterialSymbolsFavorite />
					</M3.MenuItemLeadingIcon>
					Favourite
				</M3.MenuListItem>

				{entry.media && (
					<Form action="" method="post">
						<input type="hidden" name="intent" value="set_status" />
						<input type="hidden" name="mediaId" value={entry.media.id} />

						<M3.Menu>
							<M3.MenuListItem render={<M3.MenuTrigger />}>
								<M3.MenuItemLeadingIcon>
									<MaterialSymbolsPlaylistAdd />
								</M3.MenuItemLeadingIcon>
								Set status
							</M3.MenuListItem>

							<M3.MenuList shift={-9}>
								<M3.MenuListItem
									render={
										<button
											type="submit"
											name="status"
											value={"COMPLETED" satisfies MediaListStatus}
										/>
									}
								>
									Completed
								</M3.MenuListItem>
								<M3.MenuListItem
									render={
										<button
											type="submit"
											name="status"
											value={"PAUSED" satisfies MediaListStatus}
										/>
									}
								>
									Paused
								</M3.MenuListItem>
								<M3.MenuListItem
									render={
										<button
											type="submit"
											name="status"
											value={"DROPPED" satisfies MediaListStatus}
										/>
									}
								>
									Dropped
								</M3.MenuListItem>
							</M3.MenuList>
						</M3.Menu>
					</Form>
				)}
			</M3.MenuList>
		</M3.Menu>
	)
}

const ProgressShareMedia_media = graphql`
	fragment ProgressShareMedia_media on Media {
		id

		title @required(action: LOG) {
			userPreferred @required(action: LOG)
		}
	}
`

function ShareMedia(props: { media: ProgressShareMedia_media$key }): ReactNode {
	const media = useFragment(ProgressShareMedia_media, props.media)

	if (!media) return null

	const shareData: ShareData = {
		title: media.title.userPreferred,
		text: media.title.userPreferred,
		url: `https://${location.host}/media/${media.id}`,
	}

	const canShare =
		typeof navigator.canShare === "function" && navigator.canShare(shareData)

	return (
		canShare && (
			<M3.MenuListItem
				render={<button type="button" />}
				onClick={() => {
					void navigator.share(shareData)
				}}
			>
				<M3.MenuItemLeadingIcon>
					<MaterialSymbolsForward />
				</M3.MenuItemLeadingIcon>
				Share
			</M3.MenuListItem>
		)
	)
}

export function Progress({
	entry,
	actionData,
	...props
}: ComponentProps<"span"> & {
	entry: Progress_entry$key
	actionData: SelectedRoute.ComponentProps["actionData"] | undefined
}): ReactNode {
	const data = useFragment(Progress_entry, entry)

	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const progress =
		(Number(optimisticEntry.id) === data.id
			? Number(optimisticEntry.progress)
			: data.progress) ?? 0

	const episodes = data.media?.episodes ?? data.media?.chapters

	return (
		<span {...props}>
			<span className="">{progress}</span>
			{episodes === progress ? null : (
				<>
					<span>/</span>
					<span className="">
						{Predicate.isNumber(data.media?.avalible) ? (
							<span
								className={
									data.media.avalible !== episodes
										? "underline decoration-dotted"
										: ""
								}
							>
								{data.media.avalible}
							</span>
						) : (
							`${episodes ?? "-"}`
						)}
					</span>
				</>
			)}
		</span>
	)
}
