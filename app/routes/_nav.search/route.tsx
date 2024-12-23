import { unstable_defineClientLoader } from "@remix-run/react"
import type { ReactNode } from "react"

import ReactRelay from "react-relay"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { List } from "~/components/List"
import type { routeNavSearchQuery } from "~/gql/routeNavSearchQuery.graphql"
import { client_get_client } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import { SearchItem } from "~/lib/search/SearchItem"
const { graphql } = ReactRelay

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const client = client_get_client()
	const { searchParams } = new URL(args.request.url)

	const data = await client.query<routeNavSearchQuery>(
		graphql`
			query routeNavSearchQuery(
				$q: String
				$sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
			) @raw_response_type {
				page: Page(perPage: 10) {
					media(search: $q, sort: $sort) {
						id
						...SearchItem_media
					}
				}
			}
		`,
		{
			q: searchParams.get("q"),
		}
	)
	return data
})

export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof clientLoader>()

	return (
		<LayoutBody>
			<LayoutPane>
				<Card variant="elevated" className="max-sm:contents">
					<div className="-mx-4">
						<List>
							{data?.page?.media
								?.filter((el) => el != null)
								.map((media) => <SearchItem media={media} key={media.id} />)}
						</List>
					</div>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
