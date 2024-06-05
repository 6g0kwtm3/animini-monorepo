import * as Ariakit from "@ariakit/react"
import { Array as ReadonlyArray } from "effect"

import { List } from "~/components/List"
import {
	SearchViewBody,
	SearchViewBodyGroup,
	SearchViewItem
} from "~/components/SearchView"

import { SearchItem } from "./SearchItem"

import type { ReactNode } from "react"
import { M3 } from "../components"
import { useFragment } from "../Network"

import ReactRelay from "react-relay"
import type { SearchTrending_query$key } from "~/gql/SearchTrending_query.graphql"
const { graphql } = ReactRelay

const SearchTrending_query = graphql`
	fragment SearchTrending_query on Query {
		trending: Page(perPage: 10) {
			media(sort: [TRENDING_DESC]) {
				id
				...SearchItem_media
			}
		}
	}
`

export function SearchTrending(props: {
	query: SearchTrending_query$key
}): ReactNode {
	const data = useFragment(SearchTrending_query, props.query)

	return (
		data.trending?.media &&
		ReadonlyArray.isNonEmptyReadonlyArray(data.trending.media) && (
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
