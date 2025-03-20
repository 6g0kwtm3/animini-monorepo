import { type MetaFunction } from "react-router"

import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "~/components/List"
import * as Predicate from "~/lib/Predicate"

// import * as R from '@remix-run/router'
// console.log(R)

// import {RouterProvider} from 'react-router-dom'

import type { routeNavFeedMediaQuery } from "~/gql/routeNavFeedMediaQuery.graphql"
import type { routeNavFeedQuery } from "~/gql/routeNavFeedQuery.graphql"
import { createList, ListContext } from "~/lib/list"
import { getThemeFromHex } from "~/lib/theme"
import type { Options } from "./Markdown"
import { Markdown } from "./Markdown"
import { UserLink } from "./UserLink"

import { fetchQuery } from "~/lib/Network"
import type { Route } from "./+types/route"
import { MediaLink } from "./MediaLink"

const { graphql } = ReactRelay

function matchMediaId(s: string) {
	return [...s.matchAll(/https:\/\/anilist.co\/(anime|manga)\/(\d+)/g)]
		.map((group) => Number(group[2]))
		.filter(isFinite)
}

async function getPage() {
	const data = await fetchQuery<routeNavFeedQuery>(
		graphql`
			query routeNavFeedQuery @raw_response_type {
				Page(perPage: 10) {
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
	return data.Page
}
async function getMedia(variables: routeNavFeedMediaQuery["variables"]) {
	const data = await fetchQuery<routeNavFeedMediaQuery>(
		graphql`
			query routeNavFeedMediaQuery($ids: [Int]) @raw_response_type {
				Page {
					media(id_in: $ids) {
						id
						title @required(action: LOG) {
							...MediaTitle_mediaTitle
						}
						type
						coverImage {
							color
						}
						...MediaCover_media
					}
				}
			}
		`,
		variables
	)

	return Object.fromEntries(
		data.Page?.media
			?.filter((el) => el != null)
			.map(
				(media) =>
					[
						String(media.id),
						{
							media,
							theme: Predicate.isString(media.coverImage?.color)
								? getThemeFromHex(media.coverImage.color)
								: {},
						},
					] as const
			) ?? []
	)
}

export const clientLoader = async () => {
	const page = await getPage()

	const ids =
		page?.activities?.flatMap((activity) => {
			if (activity?.__typename === "TextActivity") {
				return activity.text ? matchMediaId(activity.text) : []
			}
			return []
		}) ?? []

	return {
		page,
		media:
			ids.length > 0
				? getMedia({ ids: ids })
				: Promise.resolve<Awaited<ReturnType<typeof getMedia>>>({}),
	}
}

export default function Index({
	loaderData: data,
}: Route.ComponentProps): ReactNode {
	const list = createList({ lines: "two" })

	return (
		<LayoutBody>
			<LayoutPane>
				<ul className="flex flex-col gap-2">
					{data.page?.activities
						?.filter((el) => el != null)
						.map((activity) => {
							if (activity.__typename === "TextActivity") {
								return (
									<li
										key={activity.id}
										data-id={activity.id}
										className="animate-appear [animation-range:entry_5%_cover_20%] [animation-timeline:view()]"
									>
										<Card
											variant="filled"
											className="grid max-w-7xl gap-4 rounded-[1.75rem]"
										>
											<ListContext value={list}>
												<address
													className={list.root({
														className: "-mx-4 -my-4",
													})}
												>
													<ListItem className="hover:state-none">
														<div className="col-start-1 h-10 w-10">
															{activity.user?.avatar?.large && (
																<img
																	alt=""
																	loading="lazy"
																	src={activity.user.avatar.large}
																	className="h-10 w-10 rounded-full bg-[image:--bg] bg-cover object-cover"
																	style={{
																		"--bg": `url(${activity.user.avatar.medium})`,
																	}}
																/>
															)}
														</div>
														<ListItemContent>
															<ListItemTitle>
																{activity.user?.name}
															</ListItemTitle>
															<ListItemSubtitle>
																{activity.createdAt}
															</ListItemSubtitle>
														</ListItemContent>
														{/* <ListItemTrailingSupportingText></ListItemTrailingSupportingText> */}
													</ListItem>
												</address>
											</ListContext>
											{activity.text && (
												<Markdown
													className="prose md:prose-lg lg:prose-xl dark:prose-invert prose-img:inline prose-img:rounded-md prose-video:inline prose-video:rounded-md max-w-full overflow-x-auto"
													options={options}
												>
													{activity.text}
												</Markdown>
											)}
										</Card>
									</li>
								)
							}
							return null
						})}
				</ul>
				{/* <div className="flex justify-center gap-4">
					<Button>Previous page</Button>
					<Button>Next page</Button>
				</div> */}
			</LayoutPane>
		</LayoutBody>
	)
}

const options = {
	replace: {
		center(props) {
			return <center {...props} />
		},
		p(props) {
			return <div {...props} />
		},
		a(props) {
			if (!props.href?.trim()) {
				return <span className="text-primary">{props.children}</span>
			}

			// @ts-expect-error dataset attributes are not typed
			if (props.className === "media-link" && props["data-id"]) {
				// @ts-expect-error dataset attributes are not typed
				return <MediaLink mediaId={props["data-id"]} />
			}

			// @ts-expect-error dataset attributes are not typed
			if (props["data-user-name"]) {
				return (
					// @ts-expect-error dataset attributes are not typed
					<UserLink userName={props["data-user-name"]}>
						{props.children}
					</UserLink>
				)
			}

			return (
				<a {...props} rel="noopener noreferrer" target="_blank">
					{props.children}
				</a>
			)
		},
	},
} satisfies Options

export const meta = (() => {
	return [{ title: "Feed" }]
}) satisfies MetaFunction
