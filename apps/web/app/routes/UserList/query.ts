/* eslint-disable eslint-plugin-relay/must-colocate-fragment-spreads */
import ReactRelay from "react-relay"

const { graphql } = ReactRelay

export const UserListTabsQuery = graphql`
	query routeUserListTabsQuery($userName: String!, $type: MediaType!) {
		...UserListTabs_query
	}
`
