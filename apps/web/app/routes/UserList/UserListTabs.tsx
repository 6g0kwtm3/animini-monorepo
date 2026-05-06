import { useSearchParams } from "react-router"
import * as Order from "~/lib/Order"

import { TabsList, TabsListItem } from "~/components/Tabs"

import type { routeUserListTabsQuery as UserListTabsQueryOperation } from "~/gql/routeUserListTabsQuery.graphql"

import { A } from "@anitrove/a"
import ReactRelay from "react-relay"
import type { UserListTabs_query$key } from "~/gql/UserListTabs_query.graphql"
import {
	useFragment,
	usePreloadedQuery,
	type NodeAndQueryFragment,
} from "~/lib/Network"
import { numberToString } from "~/lib/numberToString"

const { graphql } = ReactRelay

const UserListTabs_query = graphql`
	fragment UserListTabs_query on Query {
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
				entries {
					id
				}
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

	const total = lists?.reduce<null | number>(
		(acc, list) => (list.entries ? list.entries.length + (acc ?? 0) : acc),
		null
	)

	return (
		<TabsList>
			<TabsListItem
				id={"undefined"}
				render={<A href={`.?${searchParams}`} relative="path"></A>}
			>
				All {total != null ? `(${numberToString(total)})` : ""}
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
							{list.entries?.length != null
								? ` (${numberToString(list.entries.length)})`
								: ""}
						</TabsListItem>
					)
				)
			})}
		</TabsList>
	)
}
