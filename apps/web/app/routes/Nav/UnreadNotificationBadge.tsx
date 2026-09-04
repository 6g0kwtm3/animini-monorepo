import ReactRelay, { useFragment } from "react-relay"
import { Outlet, useLocation, useRouteLoaderData } from "react-router"
import type { clientLoader as rootLoader } from "~/root"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"

import {
	Navigation,
	NavigationItem,
	NavigationItemLargeBadge,
} from "~/components/Navigation"
import { SearchTrending } from "~/lib/search/SearchTrending"
import { Suspense, type ReactNode } from "react"
import { route_login, route_user, route_user_list } from "~/lib/route"
import { Search, SearchButton } from "~/lib/search/Search"

import MaterialSymbolsNotifications from "~icons/material-symbols/notifications"
import MaterialSymbolsNotificationsOutline from "~icons/material-symbols/notifications-outline"
import MaterialSymbolsPerson from "~icons/material-symbols/person"

import MaterialSymbolsPersonOutline from "~icons/material-symbols/person-outline"

import MaterialSymbolsFeed from "~icons/material-symbols/feed"
import MaterialSymbolsFeedOutline from "~icons/material-symbols/feed-outline"
import MaterialSymbolsPlayArrow from "~icons/material-symbols/play-arrow"
import MaterialSymbolsPlayArrowOutline from "~icons/material-symbols/play-arrow-outline"

import { Layout } from "~/components/Layout"

import type { routeNavQuery } from "~/gql/routeNavQuery.graphql"
import { A } from "@anitrove/a"
import * as Ariakit from "@ariakit/react"
import { ErrorBoundary } from "@sentry/react"
import { fab } from "~/lib/button"
import {
	loadQuery,
	usePreloadedQuery,
	type NodeAndQueryFragment,
} from "~/lib/Network"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"
import type { Route } from "./+types/route"
import { styles } from "./route.styles" with { type: "macro" }
import type { routeNavTrendingQuery } from "~/gql/routeNavTrendingQuery.graphql"
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
