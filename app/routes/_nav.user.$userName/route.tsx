import {
	json,
	Link,
	Outlet,
	unstable_defineClientLoader,
	useLoaderData,
} from "@remix-run/react"
import type { ReactNode } from "react"

import { button } from "~/lib/button"
import { client_operation } from "~/lib/client"
import { M3 } from "~/lib/components"

import { Schema } from "@effect/schema"
import ReactRelay from "react-relay"
import type { routeNavUserQuery } from "~/gql/routeNavUserQuery.graphql"
import { Ariakit } from "~/lib/ariakit"

const { graphql } = ReactRelay

const Params = Schema.Struct({
	userName: Schema.String,
})

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const { userName } = Schema.decodeUnknownSync(Params)(args.params)

	const data = await client_operation<routeNavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!) {
				User(name: $userName) {
					id
					name
					bannerImage
					statistics {
						anime {
							count
						}
						manga {
							count
						}
					}
					avatar {
						large
						medium
					}
				}
			}
		`,
		{ userName }
	)

	if (!data?.User) {
		throw json("User not found", {
			status: 404,
		})
	}

	return { user: data.User }
})

export default function Page(): ReactNode {
	const data = useLoaderData<typeof clientLoader>()

	const src = data.user.avatar?.large ?? data.user.avatar?.medium
	return (
		<M3.LayoutBody>
			<M3.LayoutPane>
				<section className="-mx-4">
					{data.user.bannerImage && (
						<img
							src={data.user.bannerImage}
							alt=""
							className="w-full object-cover"
						/>
					)}
					<div className="flex gap-4 p-4">
						{data.user.avatar && (
							<div className="-mt-20 overflow-hidden rounded-full bg-surface p-4">
								{src && (
									<img
										src={src}
										alt=""
										className="bg-cover object-cover"
										style={{
											backgroundImage: `url(${data.user.avatar.medium})`,
										}}
									/>
								)}
							</div>
						)}
						<div>
							<Ariakit.Heading className="truncate text-headline-lg">
								{data.user.name}
							</Ariakit.Heading>
						</div>
					</div>
				</section>
				<nav>
					<Link to="animelist" className={button()}>
						Anime List
					</Link>
					<Link to="mangalist" className={button()}>
						Manga List
					</Link>
				</nav>
				<Outlet />
			</M3.LayoutPane>
		</M3.LayoutBody>
	)
}
