import { ErrorBoundary } from "@sentry/react"
import { useId, type ReactNode } from "react"
import ReactRelay from "react-relay"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "~/components/List"

// console.log(R)

import { A } from "@anitrove/a"
import { state } from "@anitrove/design"
import { precompileStyles } from "@anitrove/unstyled"
import { Composite, CompositeItem, useCompositeStore } from "@ariakit/react"
import { Markdown } from "markdown/Markdown"
import type { routeNavFeedQuery } from "~/gql/routeNavFeedQuery.graphql"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import type { Route } from "./+types/route"
import { options } from "./options"
const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const page = args.context.get(loadQuery)<routeNavFeedQuery>(
		graphql`
			query routeNavFeedQuery($perPage: Int) {
				Page(perPage: $perPage) {
					activities(sort: [ID_DESC], type_in: [TEXT]) {
						__typename
						... on TextActivity {
							id
							createdAt
							text
							user {
								id
								name
								avatar {
									large
									medium
								}
							}
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
					{activities?.map((activity, i) => {
						if (activity.__typename === "TextActivity") {
							return (
								<CompositeItem
									render={<article></article>}
									aria-posinset={i + 1}
									aria-setsize={activities.length}
									key={activity.id}
									data-key={activity.id}
									className="animate-appear [animation-range:entry_5%_cover_20%] [animation-timeline:view()]"
								>
									<Card
										variant="filled"
										render={<div />}
										className="grid max-w-7xl gap-4 rounded-[1.75rem]"
									>
										<List
											style={precompileStyles({ margin: "-1rem" })}
											render={<address />}
										>
											<ListItem style={precompileStyles({ ...state("none") })}>
												<div className="col-start-1 h-10 w-10">
													{activity.user?.avatar?.large ? (
														<img
															alt=""
															loading="lazy"
															src={activity.user.avatar.large}
															className="h-10 w-10 rounded-full bg-(image:--bg) bg-cover object-cover"
															style={
																activity.user.avatar.medium
																	? {
																			"--bg": `url(${activity.user.avatar.medium})`,
																		}
																	: undefined
															}
														/>
													) : null}
												</div>
												<ListItemContent>
													<ListItemTitle>
														{activity.user?.name ? (
															<A href={`/user/${activity.user.name}`}>
																{activity.user.name}
															</A>
														) : null}
													</ListItemTitle>
													<ListItemSubtitle>
														{activity.createdAt}
													</ListItemSubtitle>
												</ListItemContent>
												{/* <ListItemTrailingSupportingText></ListItemTrailingSupportingText> */}
											</ListItem>
										</List>
										<ErrorBoundary fallback={<>Failed to parse markdown</>}>
											<div className="prose md:prose-lg lg:prose-xl dark:prose-invert prose-img:inline prose-img:rounded-md prose-video:inline prose-video:rounded-md max-w-full overflow-x-auto">
												{activity.text ? (
													<Markdown options={options}>{activity.text}</Markdown>
												) : null}
											</div>
										</ErrorBoundary>
									</Card>
								</CompositeItem>
							)
						}
						activity.__typename satisfies "%other"
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
