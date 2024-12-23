import {
	Form,
	useActionData,
	useNavigation,
	useParams,
	useRouteLoaderData,
	useSearchParams,
} from "@remix-run/react"
import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { ClientOnly } from "remix-utils/client-only"
import * as Predicate from "~/lib/Predicate"

import type { clientLoader as rootLoader } from "~/root"
import type { clientAction as selectedAction } from "~/routes/_nav.user.$userName.$typelist._filters.($selected)/route"
import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsFavorite from "~icons/material-symbols/favorite"
import MaterialSymbolsForward from "~icons/material-symbols/forward"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsPlaylistAdd from "~icons/material-symbols/playlist-add"
import { M3 } from "../components"
import { useFragment } from "../Network"

import type { Progress_entry$key } from "~/gql/Progress_entry.graphql"
import type { ProgressIncrement_entry$key } from "~/gql/ProgressIncrement_entry.graphql"
import type { MediaListStatus } from "~/gql/routeUserSetStatusMutation.graphql"
const { graphql } = ReactRelay

const ProgressIncrement_entry = graphql`
	fragment ProgressIncrement_entry on MediaList {
		id
		progress
		...Progress_entry
		media @required(action: LOG) {
			avalible
			type
			id
			episodes
			chapters
			title @required(action: LOG) {
				userPreferred @required(action: LOG)
			}
		}
	}
`

export function ProgressIncrement(props: {
	entry: ProgressIncrement_entry$key
}): ReactNode {
	const entry = useFragment(ProgressIncrement_entry, props.entry)
	const data = useRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()
	const actionData = useActionData<typeof selectedAction>()
	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const [search] = useSearchParams()

	if (!entry) {
		return null
	}

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	search.set("sheet", String(entry.id))

	const episodes = entry.media.episodes ?? entry.media.chapters

	return (
		<div className="flex justify-end">
			{Predicate.isString(data?.Viewer?.name) &&
				data.Viewer.name === params.userName && (
					<Form className="hidden @md:block" method="post">
						<input type="hidden" name="progress" value={progress + 1} />
						<input type="hidden" name="id" value={entry.id} />
						<input type="hidden" name="intent" value="increment" />
						<M3.TooltipPlain>
							<M3.TooltipPlainTrigger render={<M3.Button type="submit" />}>
								<Progress entry={entry} />
								<M3.ButtonIcon>
									<MaterialSymbolsAdd />
								</M3.ButtonIcon>
							</M3.TooltipPlainTrigger>
							{entry.media.avalible !== episodes && (
								<M3.TooltipPlainContainer>
									{!episodes ? (
										<>some more to release</>
									) : Predicate.isNumber(entry.media.avalible) ? (
										<>{episodes - entry.media.avalible} more to release</>
									) : (
										<>more to release</>
									)}
								</M3.TooltipPlainContainer>
							)}
						</M3.TooltipPlain>
					</Form>
				)}
			<M3.Menu>
				<M3.Icon render={<M3.MenuTrigger />}>
					<MaterialSymbolsMoreHoriz />
				</M3.Icon>
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
					<ClientOnly>
						{() => {
							const shareData: ShareData = {
								title: entry.media.title.userPreferred,
								text: entry.media.title.userPreferred,
								url: `https://${location.host}/media/${entry.media.id}`,
							}

							const canShare =
								typeof navigator.canShare === "function" &&
								navigator.canShare(shareData)

							return (
								canShare && (
									<M3.MenuListItem
										render={<button type="button" />}
										onClick={() => {
											void (async () => {
												await navigator.share(shareData)
											})()
										}}
									>
										<M3.MenuItemLeadingIcon>
											<MaterialSymbolsForward />
										</M3.MenuItemLeadingIcon>
										Share
									</M3.MenuListItem>
								)
							)
						}}
					</ClientOnly>
					<M3.MenuListItem>
						<M3.MenuItemLeadingIcon>
							<MaterialSymbolsFavorite />
						</M3.MenuItemLeadingIcon>
						Favourite
					</M3.MenuListItem>

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
				</M3.MenuList>
			</M3.Menu>
		</div>
	)
}
const Progress_entry = graphql`
	fragment Progress_entry on MediaList {
		id
		progress
		media {
			avalible
			id
			episodes
			chapters
		}
	}
`

export function Progress(props: { entry: Progress_entry$key }): ReactNode {
	const entry = useFragment(Progress_entry, props.entry)

	const actionData = useActionData<typeof selectedAction>()
	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	const episodes = entry.media?.episodes ?? entry.media?.chapters

	return (
		<span>
			{progress}
			{episodes === progress ? null : Predicate.isNumber(
					entry.media?.avalible
			  ) ? (
				<>
					/
					<span
						className={
							entry.media.avalible !== episodes
								? "underline decoration-dotted"
								: ""
						}
					>
						{entry.media.avalible}
					</span>
				</>
			) : (
				`/${episodes ?? "-"}`
			)}
		</span>
	)
}
