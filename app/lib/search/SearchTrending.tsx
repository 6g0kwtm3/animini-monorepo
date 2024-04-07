import * as Ariakit from "@ariakit/react"
import { ReadonlyArray } from "effect"
import { serverOnly$ } from "vite-env-only"
import { List } from "~/components/List"
import {
    SearchViewBody,
    SearchViewBodyGroup,
    SearchViewItem
} from "~/components/SearchView"
import type { FragmentType } from "~/lib/graphql"
import { graphql, readFragment } from "~/lib/graphql"
import { SearchItem } from "./SearchItem"

import type { ReactNode } from "react"
import { M3 } from "../components"

const SearchTrending_query = serverOnly$(
	graphql(`
		fragment Search_query on Query {
			trending: Page(perPage: 10) {
				media(sort: [TRENDING_DESC]) {
					id
					...SearchItem_media
				}
			}
		}
	`)
)

export type SearchTrending_query = typeof SearchTrending_query

export function SearchTrending(props: {
	query: FragmentType<SearchTrending_query>
}): ReactNode {
	const data = readFragment<SearchTrending_query>(props.query)

	return (
		data.trending?.media &&
		ReadonlyArray.isNonEmptyArray(data.trending.media) && (
			<SearchViewBody>
				<SearchViewBodyGroup>
					<Ariakit.ComboboxGroupLabel render={<M3.Subheader lines={"one"} />}>
						Trending
					</Ariakit.ComboboxGroupLabel>

					<List lines={"one"} render={<div />} className="-mt-2">
						{data.trending.media
							.filter((el) => el != null)
							.map((media) => (
								<SearchViewItem
									key={media.id}
									render={<SearchItem media={media} />}
								/>
							))}
					</List>
				</SearchViewBodyGroup>
			</SearchViewBody>
		)
	)
}
