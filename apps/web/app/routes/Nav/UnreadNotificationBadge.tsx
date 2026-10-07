import { fab } from "@animedes/components/button.styles"
import { Layout } from "@animedes/components/Layout"
import {
	Navigation,
	NavigationItem,
	NavigationItemLargeBadge,
} from "@animedes/components/Navigation"
import { A } from "@anitrove/a"
import * as Ariakit from "@ariakit/react"
import { ErrorBoundary } from "@sentry/react"
import { Suspense, type ReactNode } from "react"
import ReactRelay, { useFragment } from "react-relay"
import { Outlet, useLocation, useRouteLoaderData } from "react-router"
import {
	loadQuery,
	usePreloadedQuery,
	type NodeAndQueryFragment,
} from "~/lib/Network"
import { route_login, route_user, route_user_list } from "~/lib/route"
import { Search, SearchButton } from "~/lib/search/Search"
import { SearchTrending } from "~/lib/search/SearchTrending"
import MaterialSymbolsFeed from "~icons/material-symbols/feed"
import MaterialSymbolsFeedOutline from "~icons/material-symbols/feed-outline"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"
import MaterialSymbolsNotifications from "~icons/material-symbols/notifications"
import MaterialSymbolsNotificationsOutline from "~icons/material-symbols/notifications-outline"
import MaterialSymbolsPerson from "~icons/material-symbols/person"
import MaterialSymbolsPersonOutline from "~icons/material-symbols/person-outline"
import MaterialSymbolsPlayArrow from "~icons/material-symbols/play-arrow"
import MaterialSymbolsPlayArrowOutline from "~icons/material-symbols/play-arrow-outline"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"

import { styles } from "./route.styles" with { type: "macro" }

import type { Route } from "./+types/route"
import type { routeNavQuery } from "~/gql/routeNavQuery.graphql"
import type { routeNavTrendingQuery } from "~/gql/routeNavTrendingQuery.graphql"
import type { UnreadNotificationBadge_query$key } from "~/gql/UnreadNotificationBadge_query.graphql"
import type { clientLoader as rootLoader } from "~/root"

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
