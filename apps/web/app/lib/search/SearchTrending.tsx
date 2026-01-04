import * as Ariakit from "@ariakit/react"

import { List, Subheader } from "~/components/List"
import {
	SearchViewBody,
	SearchViewBodyGroup,
	SearchViewItem,
} from "~/components/SearchView"

import { SearchItem } from "./SearchItem"

import type { ReactNode } from "react"
import { useFragment } from "../Network"

import ReactRelay from "react-relay"
import type { SearchTrending_query$key } from "~/gql/SearchTrending_query.graphql"
import { precompileStyles } from "@anitrove/unstyled"
const { graphql } = ReactRelay

export function SearchTrending(props: {
	query: SearchTrending_query$key
}): ReactNode {
	const data = useFragment(
		graphql`
			fragment SearchTrending_query on Query {
				trending: Page(perPage: 10) {
					media(sort: [TRENDING_DESC]) {
						id
						...SearchItem_media
					}
				}
			}
		`,
		props.query
	)

	return data.trending?.media && data.trending.media.length > 0 ? (
		<SearchViewBody>
			<SearchViewBodyGroup>
				<Ariakit.ComboboxGroupLabel render={<Subheader lines={"one"} />}>
					Trending
				</Ariakit.ComboboxGroupLabel>

				<List
					render={<div />}
					lines={"one"}
					style={precompileStyles({ marginTop: "-.5rem" })}
				>
					{data.trending.media
						.filter((el) => el != null)
						.map((media) => (
							<SearchViewItem
								key={media.id}
								data-key={media.id}
								render={<SearchItem media={media} />}
							/>
						))}
				</List>
			</SearchViewBodyGroup>
		</SearchViewBody>
	) : null
}
