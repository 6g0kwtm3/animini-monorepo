/* eslint-disable eslint-plugin-relay/unused-fields, eslint-plugin-relay/must-colocate-fragment-spreads */
import ReactRelay from "react-relay"

const { graphql } = ReactRelay

export const navRouteQuery = graphql`
	query routeNavQuery($isToken: Boolean = false) {
		Viewer @include(if: $isToken) {
			unreadNotificationCount
		}
		...SearchTrending_query
	}
`
