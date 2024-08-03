import ReactRelay, { type PreloadedQuery } from "react-relay"
const { graphql } = ReactRelay

export const searchTrendingQuery = graphql`
	query SearchTrendingQuery @raw_response_type {
		...SearchTrending_query
	}
`
