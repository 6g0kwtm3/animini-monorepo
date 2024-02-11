import type { LoaderFunction } from "@remix-run/cloudflare"
import { Link, useLoaderData } from "@remix-run/react"
import { Effect, Predicate, pipe } from "effect"
import List from "~/components/List"
import { graphql } from "~/gql"
import { Remix } from "~/lib/Remix/index.server"
import { list } from "~/lib/list"
import { m } from "~/lib/paraglide"
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
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export default function Page() {
	const data = useLoaderData<typeof loader>()

	return (
		<div>
			<List lines="two">
				{data?.Page?.notifications
					?.filter(Predicate.isNotNull)
					.map((notification) => {
						if (notification.__typename === "AiringNotification") {
							return (
								<li
									key={notification.id}
									className="col-span-full grid grid-cols-subgrid"
								>
									<Link
										className={item()}
										to={`/media/${notification.media?.id}`}
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
									</Link>
								</li>
							)
						}
						return null
					})}
			</List>
		</div>
	)
}

const { item } = list({ lines: "two" })

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
