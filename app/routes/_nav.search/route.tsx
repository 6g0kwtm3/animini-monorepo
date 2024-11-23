import type { ReactNode } from "react"

import ReactRelay from "react-relay"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { List } from "~/components/List"
import type { routeNavSearchQuery } from "~/gql/routeNavSearchQuery.graphql"
import { client_get_client } from "~/lib/client"
import { SearchItem } from "~/lib/search/SearchItem"
import type { Route } from "./+types/route"
const { graphql } = ReactRelay

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const client = client_get_client()
	const { searchParams } = new URL(args.request.url)

	const data = await client.operation<routeNavSearchQuery>(
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
}

export default function Index({
	loaderData: data,
}: Route.ComponentProps): ReactNode {
	return (
		<LayoutBody>
			<LayoutPane>
				<Card variant="elevated" className="max-sm:contents">
					<div className="-mx-4">
						<List>
							{data?.page?.media
								?.filter((el) => el != null)
								.map((media) => (
									<SearchItem media={media} key={media.id} data-id={media.id} />
								))}
						</List>
					</div>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
