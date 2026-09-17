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
import type { SearchRecentMedia_query$key } from "~/gql/SearchRecentMedia_query.graphql"
import { precompileStyles } from "@anitrove/unstyled"
const { graphql } = ReactRelay

export function SearchRecentMedia(props: {
	query: SearchRecentMedia_query$key
	recentMediaIds: ReadonlySet<number>
}): ReactNode {
	const data = useFragment(
		graphql`
			fragment SearchRecentMedia_query on Query @throwOnFieldError {
				recentMedia: Page {
					media(id_in: $recentMediaIds) {
						id
						...SearchItem_media @alias
					}
				}
			}
		`,
		props.query
	)

	const order = new Map(props.recentMediaIds.values().map((id, i) => [id, i]))

	return data.recentMedia?.media && data.recentMedia.media.length !== 0 ? (
		<SearchViewBodyGroup>
			<Ariakit.ComboboxGroupLabel render={<Subheader lines={"one"} />}>
				Recent
			</Ariakit.ComboboxGroupLabel>

			<List
				render={<div />}
				lines={"one"}
				style={precompileStyles({ marginTop: "-.5rem" })}
			>
				{data.recentMedia.media
					.filter((el) => el != null)
					.toSorted(
						(a, b) =>
							(order.get(Number(a.id)) ?? -1) - (order.get(Number(b.id)) ?? -1)
					)
					.map((media, i, arr) => (
						<SearchViewItem
							key={media.id}
							data-key={media.id}
							render={
								<SearchItem
									first={i === 0}
									last={i === arr.length - 1}
									media={media.SearchItem_media}
								/>
							}
						/>
					))}
			</List>
		</SearchViewBodyGroup>
	) : null
}
