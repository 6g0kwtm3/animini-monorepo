import { useSearchParams } from "react-router"
import * as Order from "~/lib/Order"

import { TabsList, TabsListItem } from "~/components/Tabs"

import type { routeUserListTabsQuery as UserListTabsQueryOperation } from "~/gql/routeUserListTabsQuery.graphql"

import { A } from "@anitrove/a"
import ReactRelay from "react-relay"
import {
	useFragment,
	usePreloadedQuery,
	type NodeAndQueryFragment,
} from "~/lib/Network"
import type { UserListTabs_query$key } from "~/gql/UserListTabs_query.graphql"

const { graphql } = ReactRelay

const UserListTabs_query = graphql`
	fragment UserListTabs_query on Query {
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
			}
		}
	}
`

export function UserListTabs(props: {
	queryRef: NodeAndQueryFragment<UserListTabsQueryOperation>
}) {
	const queryKey: UserListTabs_query$key = usePreloadedQuery(props.queryRef)
	const data = useFragment(UserListTabs_query, queryKey)
	const lists = data.MediaListCollection?.lists
		?.filter((el) => el != null)
		.toSorted(
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? ""))
		)

	const [searchParams] = useSearchParams()

	return (
		<TabsList>
			<TabsListItem
				id={"undefined"}
				render={<A href={`.?${searchParams}`} relative="path"></A>}
			>
				All
			</TabsListItem>
			{lists?.map((list) => {
				return list.name != null ? (
					<TabsListItem
						key={list.name}
						data-key={list.name}
						id={list.name}
						render={<A href={`${list.name}?${searchParams}`}></A>}
					>
						{list.name}
					</TabsListItem>
				) : null
			})}
		</TabsList>
	)
}
