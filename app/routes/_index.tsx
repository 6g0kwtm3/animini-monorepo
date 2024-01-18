import type { ActionFunction, MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useSearchParams } from "@remix-run/react"
import {
	ButtonElevated,
	ButtonFilled,
	ButtonOutlined,
	ButtonTonal,
	ButtonText as Text,
} from "~/components/Button"
import { UrqlForm } from "~/components/UrqlForm"
import { graphql } from "~/gql"

import { getClient } from "~/lib/urql"
import { loadQuery, useQuery } from "~/schema/resolvers"

export const meta: MetaFunction = () => {
	return [
		{ title: "New Remix App" },
		{ name: "description", content: "Welcome to Remix!" },
	]
}

const MUTATION = graphql(/* GraphQL */ `
	mutation HomeMutation($animeId: Int) {
		ToggleFavourite(animeId: $animeId) {
			__typename
		}
	}
`)

export const action = (async (arguments_) => {
	const formData = await arguments_.request.formData()
	await getClient(arguments_.request)
		.mutation(MUTATION, HomeMutationVariables(formData))
		.toPromise()
}) satisfies ActionFunction

function HomeMutationVariables(data: FormData) {
	return {
		animeId: Number(data.get("animeId")),
		isFavourite: "true" === data.get("isFavourite"),
	}
}

const QUERY = graphql(`
	query Test {
		MediaListCollection(userName: "Hoodboi", type: ANIME) {
			lists {
				MediaGroup
				name
				entries {
					id
					behind
					toWatch
					#  {
					# 	raw
					# 	string
					# }
					ListItem
				}
			}
		}
	}
`)

export const loader = async ({ request }) => {
	return {
		Test: await loadQuery(request, QUERY, {}),
	}
}

export default function Index() {
	const { Test } = useLoaderData<typeof loader>()

	const { data } = useQuery(Test)
	console.log({ Test, data })

	const [params] = useSearchParams()

	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
			<h1>Welcome to Remix</h1>

			<pre>
				{data?.MediaListCollection?.lists?.[7]?.entries?.[
					+params.get("entry")
				]?.ListItem?.({})}
			</pre>
			<pre>
				{
					data?.MediaListCollection?.lists?.[7]?.entries?.[+params.get("entry")]
						?.behind
				}
			</pre>
			<pre>
				{JSON.stringify(
					data?.MediaListCollection?.lists?.[7]?.entries?.[+params.get("entry")]
						?.toWatch,
				)}
			</pre>

			<Link to={`?entry=${(+params.get("entry") || 0) - 1}`}>prev</Link>
			<Link to={`?entry=${(+params.get("entry") || 0) + 1}`}>next</Link>

			<UrqlForm mutation={MUTATION} variables={HomeMutationVariables}>
				<input type="hidden" value={data?.Media?.id} name="animeId" />
				<input
					type="hidden"
					name="isFavourite"
					value={String(data?.Media?.isFavourite)}
				/>

				<div className="flex gap-2">
					<ButtonElevated type="submit">Toggle</ButtonElevated>
					<ButtonFilled type="submit">Toggle</ButtonFilled>
					<ButtonTonal type="submit">Toggle</ButtonTonal>
					<ButtonOutlined type="submit">Toggle</ButtonOutlined>
					<Text type="submit">Toggle</Text>
				</div>
			</UrqlForm>

			<ul>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/blog"
						rel="noreferrer"
					>
						15m Quickstart Blog Tutorial
					</a>
				</li>
				<li>
					<a
						target="_blank"
						href="https://remix.run/tutorials/jokes"
						rel="noreferrer"
					>
						Deep Dive Jokes App Tutorial
					</a>
				</li>
				<li>
					<a target="_blank" href="https://remix.run/docs" rel="noreferrer">
						Remix Docs
					</a>
				</li>
			</ul>
		</div>
	)
}
