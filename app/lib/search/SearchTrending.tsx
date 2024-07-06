import * as Ariakit from "@ariakit/react"
import { Array as ReadonlyArray } from "effect"

import {
	SearchViewBody,
	SearchViewBodyGroup,
	SearchViewItem,
} from "~/components/SearchView"

import { SearchItem } from "./SearchItem"

import type { ReactNode } from "react"
import { M3 } from "../components"
import { useFragment } from "../Network"

import ReactRelay from "react-relay"
import type { SearchTrending_query$key } from "~/gql/SearchTrending_query.graphql"
import { createList, ListContext } from "../list"
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

	const list = createList({ lines: "one" })

	return (
		data.trending?.media &&
		ReadonlyArray.isNonEmptyReadonlyArray(data.trending.media) && (
			<SearchViewBody>
				<SearchViewBodyGroup>
					<Ariakit.ComboboxGroupLabel render={<M3.Subheader lines={"one"} />}>
						Trending
					</Ariakit.ComboboxGroupLabel>

					<ListContext value={list}>
						<div className={list.root({ className: "-mt-2" })}>
							{data.trending.media.map(
								(media) =>
									media && (
										<SearchViewItem
											key={media.id}
											data-id={media.id}
											render={<SearchItem media={media} />}
										/>
									)
							)}
						</div>
					</ListContext>
				</SearchViewBodyGroup>
			</SearchViewBody>
		)
	)
}
