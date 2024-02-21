import { Schema } from "@effect/schema"
import { HeadersFunction, json, type LoaderFunction } from "@remix-run/cloudflare"
import { Form, Link, useLocation } from "@remix-run/react"
import { ButtonText } from "~/components/Button"
import { LayoutPane } from "~/components/Layout"
import { graphql } from "~/gql"
import { button } from "~/lib/button"
import { client_operation } from "~/lib/client"
import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"
import type { loader as rootLoader } from "~/root"

export const loader = (async (args) => {
	const { userName } = Schema.decodeUnknownSync(params())(args.params)

	const data = await client_operation(
		graphql(`
			query UserQuery($userName: String!) {
				User(name: $userName) {
					id
					name
				}
			}
		`),
		{ userName },
		args
	)

	if (!data?.User) {
		throw new Response("User not found", {
			status: 404
		})
	}

	return json(
		{ user: data.User },
		{
			headers: {
				"Cache-Control": "max-age=5, stale-while-revalidate=55, private"
			}
		}
	)
}) satisfies LoaderFunction

export const headers: HeadersFunction = () => {
	return { "Cache-Control": "max-age=5, stale-while-revalidate=55, private" }
}

function params() {
	return Schema.struct({
		userName: Schema.string
	})
}

export default function Page() {
	const rootData = useRawRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<>
			<LayoutPane>
				<nav>
					<Link to="animelist" className={button()}>
						Anime List
					</Link>
					<Link to="mangalist" className={button()}>
						Manga List
					</Link>
				</nav>

				{rootData?.Viewer?.name === data.user.name && (
					<Form
						method="post"
						action={`/logout/?${new URLSearchParams({
							redirect: pathname
						})}`}
					>
						<ButtonText type="submit">Logout</ButtonText>
					</Form>
				)}
			</LayoutPane>
		</>
	)
}
