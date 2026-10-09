import { NavigationItemLargeBadge } from "@animedes/components/Navigation"
import { type ReactNode } from "react"
import ReactRelay, { useFragment } from "react-relay"

import type { UnreadNotificationBadge_query$key } from "~/gql/UnreadNotificationBadge_query.graphql"

const { graphql } = ReactRelay

const UnreadNotificationBadge_query = graphql`
	fragment UnreadNotificationBadge_query on Query @throwOnFieldError {
		Viewer @required(action: THROW) {
			unreadNotificationCount
		}
	}
`

export function UnreadNotificationBadge({
	queryKey,
}: {
	queryKey: UnreadNotificationBadge_query$key
}): ReactNode {
	const data = useFragment(UnreadNotificationBadge_query, queryKey)

	return (
		(data.Viewer.unreadNotificationCount ?? 0) > 0 && (
			<NavigationItemLargeBadge>
				{data.Viewer.unreadNotificationCount}
			</NavigationItemLargeBadge>
		)
	)
}
