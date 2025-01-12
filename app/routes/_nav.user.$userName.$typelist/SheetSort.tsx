import { Group, GroupLabel } from "@ariakit/react"

import { useParams } from "react-router"

import type { ReactNode } from "react"
import { ListItemContent, ListItemContentTitle } from "~/components/List"

import { M3 } from "~/lib/components"

import { MediaListSort } from "~/lib/MediaListSort"

import { Ariakit } from "~/lib/ariakit"
import { createList, ListContext } from "~/lib/list"
import { usePreloadedQuery } from "~/lib/Network"
import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"
import type { Route } from "./+types/route"
import { ANIME_SORT_OPTIONS, MANGA_SORT_OPTIONS } from "./options"
import { LabelItem, LabelItemRadio } from "./SheetFilter"

export function SheetSort({ loaderData }: Route.ComponentProps): ReactNode {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"
	const list = createList({ lines })

	const data = usePreloadedQuery(...loaderData.routeNavUserListQuery)

	return (
		<ListContext value={list}>
			<Group>
				<M3.Subheader lines={lines} render={<GroupLabel />} className="-mb-2">
					Sort
				</M3.Subheader>
				<div className={list.root()}>
					<Ariakit.RadioProvider
						defaultValue={
							searchParams.get("sort") ??
							{
								title: MediaListSort.TitleEnglish,
								score: MediaListSort.Score,
							}[
								String(
									data.MediaListCollection?.user?.mediaListOptions?.rowOrder
								)
							] ??
							null
						}
					>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_SORT_OPTIONS
								: MANGA_SORT_OPTIONS
						).map(([value, label]) => {
							return (
								<LabelItem key={value}>
									<LabelItemRadio name="sort" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</LabelItem>
							)
						})}
					</Ariakit.RadioProvider>
				</div>
			</Group>
		</ListContext>
	)
}
