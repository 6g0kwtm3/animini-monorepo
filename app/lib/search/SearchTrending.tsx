import * as Ariakit from "@ariakit/react"
import { Predicate, ReadonlyArray } from "effect"
import { serverOnly$ } from "vite-env-only"
import { List, ListItem } from "~/components/List"
import { SearchViewBody, SearchViewBodyGroup } from "~/components/SearchView"
import type { FragmentType } from "~/lib/graphql"
import { graphql, useFragment } from "~/lib/graphql"
import { SearchItem } from "./SearchItem"

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
}) {
	const data = useFragment<SearchTrending_query>(props.query)

	return (
		data.trending?.media &&
		ReadonlyArray.isNonEmptyArray(data.trending.media) && (
			<SearchViewBody>
				<SearchViewBodyGroup 			render={
				<List
					lines={"one"}
					className="force:py-0"
					render={ <div />}
				/>
			}>
					<Ariakit.ComboboxGroupLabel
						render={<ListItem render={<div />} />}
						className="force:hover:state-none"
					>
						<div className="col-span-full text-body-md text-on-surface-variant">
							Trending
						</div>
					</Ariakit.ComboboxGroupLabel>
					{data.trending.media.filter(Predicate.isNotNull).map((media) => (
						<SearchItem media={media} key={media.id} />
					))}
				</SearchViewBodyGroup>
			</SearchViewBody>
		)
	)
}
