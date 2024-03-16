import type { LoaderFunction, SerializeFrom } from "@vercel/remix"
import { json } from "@vercel/remix"

import { type ClientLoaderFunctionArgs } from "@remix-run/react"
import type { ReactNode } from "react"
import { clientOnly$ } from "vite-env-only"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { List } from "~/components/List"
import { client, createGetInitialData, persister } from "~/lib/cache.client"
import { client_get_client, type AnyLoaderFunctionArgs } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import { graphql, makeFragmentData } from "~/lib/graphql"
import { SearchItem, type SearchItem_media } from "~/lib/search/SearchItem"

async function searchLoader(args: AnyLoaderFunctionArgs) {
	const client = client_get_client(args)
	const { searchParams } = new URL(args.request.url)

	const data = await client.operation(
		graphql(`
			query SearchQuery(
				$q: String
				$sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
				$coverExtraLarge: Boolean = false
			) {
				page: Page(perPage: 10) {
					media(search: $q, sort: $sort) {
						id
						...SearchItem_media
					}
				}
			}
		`),
		{
			q: searchParams.get("q")
		}
	)
	return data
}

export const loader = (async (args) => {
	return json(await searchLoader(args), {
		headers: {
			"Cache-Control": `max-age=${24 * 60 * 60}, stale-while-revalidate=${365 * 24 * 60 * 60}, private`
		}
	})
}) satisfies LoaderFunction

const isInitialRequest = clientOnly$(createGetInitialData())
export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	return client.ensureQueryData({
		revalidateIfStale: true,
		staleTime: 60 * 60 * 1000, //1 hour
		queryKey: ["_nav.search", new URL(args.request.url).searchParams.get("q")],
		queryFn: () => searchLoader(args),
		persister,
		initialData: isInitialRequest && (await args.serverLoader<typeof loader>())
	})
}
clientLoader.hydrate = true

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
								.map((media) => (
									<SearchItem
										media={makeFragmentData<SearchItem_media>(media)}
										key={media.id}
									/>
								))}
						</List>
					</div>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
