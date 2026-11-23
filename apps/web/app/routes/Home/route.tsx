import { Card } from "@animedes/components/Card"
import { LayoutBody, LayoutPane } from "@animedes/components/Layout"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "@animedes/components/List"
import { stable } from "@animedes/react-stable"
import { A } from "@anitrove/a"
import { state } from "@anitrove/design"
import { precompileStyles } from "@anitrove/unstyled"
// console.log(R)
import { Composite, CompositeItem, useCompositeStore } from "@ariakit/react"
import { ErrorBoundary } from "@sentry/react-router"
import { Markdown, type MarkdownProps } from "markdown/Markdown"
import { useEffect, useId, type ReactNode } from "react"
import ReactRelay from "react-relay"
import { client } from "~/lib/feature-flags"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"

import { options } from "./options"
import { TextActivity } from "./TextActivity"

import type { Route } from "./+types/route"
import type { routeNavFeedQuery } from "~/gql/routeNavFeedQuery.graphql"
const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const page = args.context.get(loadQuery)<routeNavFeedQuery>(
		graphql`
			query routeNavFeedQuery($perPage: Int)
			@raw_response_type
			@throwOnFieldError {
				Page(perPage: $perPage) {
					activities(sort: [ID_DESC], type_in: [TEXT]) {
						... on TextActivity @alias {
							id
							...TextActivity_textActivity @alias
						}
					}
				}
			}
		`,
		{}
	)

	// const ids =
	// 	page?.activities?.flatMap((activity) => {
	// 		if (activity?.__typename === "TextActivity") {
	// 			return activity.text ? matchMediaId(activity.text) : []
	// 		}
	// 		return []
	// 	}) ?? []

	return { page }
}

export default function Index({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(loaderData.page)

	const id = useId()
	const activities = data.Page?.activities?.filter((el) => el != null)

	return (
		<LayoutBody>
			<LayoutPane>
				<title id={id}>Feed</title>
				<Composite
					store={useCompositeStore()}
					render={<div></div>}
					role="feed"
					aria-labelledby={id}
					className="flex flex-col gap-2"
				>
					{activities?.map((node, i) => {
						if (node.TextActivity) {
							const activity = node.TextActivity
							return (
								<CompositeItem
									render={<article></article>}
									aria-posinset={i + 1}
									aria-setsize={activities.length}
									key={activity.id}
									data-key={activity.id}
									className="animate-appear [animation-range:entry_5%_cover_20%] [animation-timeline:view()]"
								>
									<TextActivity
										activityKey={activity.TextActivity_textActivity}
										first={i === 0}
										last={i === activities.length - 1}
									></TextActivity>
								</CompositeItem>
							)
						}

						return null
					})}
				</Composite>
				{/* <div className="flex justify-center gap-4">
					<Button>Previous page</Button>
					<Button>Next page</Button>
				</div> */}
			</LayoutPane>
		</LayoutBody>
	)
}
