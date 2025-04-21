import { useSearchParams } from "react-router"
import * as Order from "~/lib/Order"

import { TabsList, TabsListItem } from "~/components/Tabs"

import { UserListTabsQuery as UserListTabsQueryOperation } from "~/gql/UserListTabsQuery.graphql"

import { A } from "a"
import ReactRelay from "react-relay"
import { usePreloadedQuery, type NodeAndQueryFragment } from "~/lib/Network"

const { graphql } = ReactRelay

export const UserListTabsQuery = graphql`
	query UserListTabsQuery($userName: String!, $type: MediaType!) {
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
	const data = usePreloadedQuery(props.queryRef)

	const lists = data.MediaListCollection?.lists
		?.filter((el) => el != null)
		.sort(
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
				return (
					list.name && (
						<TabsListItem
							key={list.name}
							data-key={list.name}
							id={list.name}
							render={<A href={`${list.name}?${searchParams}`}></A>}
						>
							{list.name}
						</TabsListItem>
					)
				)
			})}
		</TabsList>
	)
}
