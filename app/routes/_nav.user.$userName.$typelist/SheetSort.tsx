import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"

import { useLoaderData, useParams } from "@remix-run/react"

import type { ReactNode } from "react"
import { Radio } from "~/components/Checkbox"
import { ListItemContent, ListItemContentTitle } from "~/components/List"

import { M3 } from "~/lib/components"

import { MediaListSort } from "~/lib/MediaListSort"

import { createList } from "~/lib/list"
import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"
import { ANIME_SORT_OPTIONS, MANGA_SORT_OPTIONS } from "./options"
import type { clientLoader } from "./route"

export function SheetSort(): ReactNode {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"
	const list = createList({ lines })

	const { data } = useLoaderData<typeof clientLoader>()

	return (
		<Group>
			<M3.Subheader lines={lines} render={<GroupLabel />} className="-mb-2">
				Sort
			</M3.Subheader>
			<div className={list.root()}>
				<CheckboxProvider
					value={
						searchParams.getAll("sort").length > 0
							? searchParams.getAll("sort")
							: ({
									title: [MediaListSort.TitleEnglish],
									score: [MediaListSort.ScoreDesc],
								}[
									String(
										data?.MediaListCollection?.user?.mediaListOptions?.rowOrder
									)
								] ?? [])
					}
				>
					{Object.entries(
						params.typelist === "animelist"
							? ANIME_SORT_OPTIONS
							: MANGA_SORT_OPTIONS
					).map(([value, label]) => {
						return (
							<label className={list.item()} key={value}>
								<Radio name="sort" value={value} />
								<ListItemContent>
									<ListItemContentTitle>{label}</ListItemContentTitle>
								</ListItemContent>
							</label>
						)
					})}
				</CheckboxProvider>
			</div>
		</Group>
	)
}
