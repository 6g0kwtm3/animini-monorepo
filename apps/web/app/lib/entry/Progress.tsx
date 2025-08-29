import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import {
	Form,
	useActionData,
	useNavigation,
	useParams,
	useRouteLoaderData,
	useSearchParams,
} from "react-router"
import * as Predicate from "~/lib/Predicate"

import type { clientLoader as rootLoader } from "~/root"
import type { clientAction as selectedAction } from "~/routes/UserListSelected/route"
import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsFavorite from "~icons/material-symbols/favorite"
import MaterialSymbolsForward from "~icons/material-symbols/forward"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import MaterialSymbolsPlaylistAdd from "~icons/material-symbols/playlist-add"
import { useFragment } from "../Network"

import type { Progress_entry$key } from "~/gql/Progress_entry.graphql"
import type { ProgressIncrement_entry$key } from "~/gql/ProgressIncrement_entry.graphql"
import type { MediaListStatus } from "~/gql/routeUserSetStatusMutation.graphql"
import { numberToString } from "~/lib/numberToString"

import { Button, ButtonIcon, Icon } from "~/components/Button"
import {
	Menu,
	MenuItemLeadingIcon,
	MenuList,
	MenuListItem,
	MenuTrigger,
} from "~/components/Menu"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"
const { graphql } = ReactRelay

const ProgressIncrement_entry = graphql`
	fragment ProgressIncrement_entry on MediaList {
		id
		progress
		...Progress_entry
		media @required(action: LOG) {
			avalible
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
		actionData?.SaveMediaListEntry
		?? Object.fromEntries(navigation.formData ?? new FormData())

	const [search] = useSearchParams()

	if (!entry) {
		return null
	}

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	search.set("sheet", numberToString(entry.id))

	const episodes = entry.media.episodes ?? entry.media.chapters

	return (
		<div className="flex justify-end">
			{Predicate.isString(data?.Viewer?.name)
				&& data.Viewer.name === params.userName && (
					<Form className="@md:block hidden" method="post">
						<input name="progress" type="hidden" value={progress + 1} />
						<input name="id" type="hidden" value={entry.id} />
						<input name="intent" type="hidden" value="increment" />
						<TooltipPlain>
							<TooltipPlainTrigger render={<Button type="submit" />}>
								<Progress entry={entry} />
								<ButtonIcon>
									<MaterialSymbolsAdd />
								</ButtonIcon>
							</TooltipPlainTrigger>
							{entry.media.avalible !== episodes && (
								<TooltipPlainContainer>
									{!episodes ? (
										<>some more to release</>
									) : Predicate.isNumber(entry.media.avalible) ? (
										<>{episodes - entry.media.avalible} more to release</>
									) : (
										<>more to release</>
									)}
								</TooltipPlainContainer>
							)}
						</TooltipPlain>
					</Form>
				)}
			<Menu>
				<Icon render={<MenuTrigger />} title="Show more options" tooltip>
					<MaterialSymbolsMoreHoriz />
				</Icon>
				<MenuList>
					{/* <form action="">
						<MenuListItem>
							<MenuItemLeadingIcon>
								<MaterialSymbolsPlaylistAdd />
							</MenuItemLeadingIcon>
							Save
						</MenuListItem>
					</form> */}
					<MenuListItem>
						<MenuItemLeadingIcon />
						Edit
					</MenuListItem>

					{(() => {
						const shareData: ShareData = {
							text: entry.media.title.userPreferred,
							title: entry.media.title.userPreferred,
							url: `https://${location.host}/media/${numberToString(entry.media.id)}`,
						}

						const canShare =
							typeof navigator.canShare === "function"
							&& navigator.canShare(shareData)

						return (
							canShare && (
								<MenuListItem
									onClick={() => {
										void (async () => {
											await navigator.share(shareData)
										})()
									}}
									render={<button type="button" />}
								>
									<MenuItemLeadingIcon>
										<MaterialSymbolsForward />
									</MenuItemLeadingIcon>
									Share
								</MenuListItem>
							)
						)
					})()}

					<MenuListItem>
						<MenuItemLeadingIcon>
							<MaterialSymbolsFavorite />
						</MenuItemLeadingIcon>
						Favourite
					</MenuListItem>

					<Form action="" method="post">
						<input name="intent" type="hidden" value="set_status" />
						<input name="mediaId" type="hidden" value={entry.media.id} />

						<Menu>
							<MenuListItem render={<MenuTrigger />}>
								<MenuItemLeadingIcon>
									<MaterialSymbolsPlaylistAdd />
								</MenuItemLeadingIcon>
								Set status
							</MenuListItem>

							<MenuList shift={-9}>
								<MenuListItem
									render={
										<button
											name="status"
											type="submit"
											value={"COMPLETED" satisfies MediaListStatus}
										/>
									}
								>
									Completed
								</MenuListItem>
								<MenuListItem
									render={
										<button
											name="status"
											type="submit"
											value={"PAUSED" satisfies MediaListStatus}
										/>
									}
								>
									Paused
								</MenuListItem>
								<MenuListItem
									render={
										<button
											name="status"
											type="submit"
											value={"DROPPED" satisfies MediaListStatus}
										/>
									}
								>
									Dropped
								</MenuListItem>
							</MenuList>
						</Menu>
					</Form>
				</MenuList>
			</Menu>
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

function Progress(props: { entry: Progress_entry$key }): ReactNode {
	const entry = useFragment(Progress_entry, props.entry)

	const actionData = useActionData<typeof selectedAction>()
	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry
		?? Object.fromEntries(navigation.formData ?? new FormData())

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
				`/${Predicate.isNumber(episodes) ? numberToString(episodes) : "-"}`
			)}
		</span>
	)
}
