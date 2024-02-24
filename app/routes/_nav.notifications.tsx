import type { LoaderFunction } from "@remix-run/cloudflare"
import { Link, json } from "@remix-run/react"
import { Effect, Predicate, pipe } from "effect"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import List from "~/components/List"
import { graphql } from "~/gql"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { m } from "~/lib/paraglide"
import { route_media } from "~/lib/route"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"
import { sourceLanguageTag } from "~/paraglide/runtime"

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)

			return yield* _(
				client.query(
					graphql(`
						query NotificationsQuery {
							Page {
								notifications(type_in: [AIRING, RELATED_MEDIA_ADDITION]) {
									__typename
									... on AiringNotification {
										id
										episode
										createdAt
										media {
											title {
												userPreferred
											}
											coverImage {
												extraLarge
												medium
											}
											id
										}
									}
									... on RelatedMediaAdditionNotification {
										id
										context
										createdAt
										media {
											id
										}
									}
								}
							}
						}
					`),
					{}
				)
			)
		}),
		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=5, stale-while-revalidate=55, private"
				}
			})
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	return (
		<LayoutBody>
			<LayoutPane>
				<List lines={{ initial: "three", sm: "two" }}>
					{data?.Page?.notifications
						?.filter(Predicate.isNotNull)
						.map((notification) => {
							if (notification.__typename === "AiringNotification") {
								return (
									<li
										key={notification.id}
										className="col-span-full grid grid-cols-subgrid"
									>
										<List.Item
											render={
												<Link
												
													to={route_media({
														id: notification.media?.id
													})}
												/>
											}
										>
											<div className="col-start-1 h-14 w-14">
												<img
													src={notification.media?.coverImage?.extraLarge || ""}
													className="h-14 w-14 bg-[image:--bg] bg-cover object-cover"
													style={{
														"--bg": `url(${notification.media?.coverImage?.medium})`
													}}
													loading="lazy"
													alt=""
												/>
											</div>
											<div className="col-start-2 grid grid-cols-subgrid">
												<List.Item.Title>
													{m.episode_aired({ episode: notification.episode })}
													{/* Episode {notification.episode} of{" "}
													{notification.media?.title?.userPreferred} aired. */}
												</List.Item.Title>
												<List.Item.Subtitle
													title={
														notification.media?.title?.userPreferred ?? undefined
													}
												>
													{notification.media?.title?.userPreferred}
												</List.Item.Subtitle>
											</div>
											{notification.createdAt && (
												<List.Item.TrailingSupportingText>
													{format(notification.createdAt - Date.now() / 1000)}
												</List.Item.TrailingSupportingText>
											)}
										</List.Item>
									</li>
								)
							}
							return null
						})}
				</List>
			</LayoutPane>
		</LayoutBody>
	)
}

function format(seconds: number) {
	const rtf = new Intl.RelativeTimeFormat(sourceLanguageTag, {})

	if (Math.abs(seconds) < 60) {
		return rtf.format(seconds, "seconds")
	}

	if (Math.abs(seconds) < 60 * 60) {
		return rtf.format(Math.trunc(seconds / 60), "minutes")
	}

	if (Math.abs(seconds) < 60 * 60 * 24) {
		return rtf.format(Math.trunc(seconds / (60 * 60)), "hours")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 7) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24)), "days")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 365) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 7)), "weeks")
	}

	return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 365)), "years")
}
