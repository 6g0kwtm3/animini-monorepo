import { Schema } from "@effect/schema"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import type { ClientLoaderFunction } from "@remix-run/react"
import { clientOnly$ } from "vite-env-only"
import { graphql } from "~/gql"
import { LoaderCache } from "~/lib/cache.client"
import { client_operation, type AnyLoaderFunctionArgs } from "~/lib/client"
import { getCacheControl } from "~/lib/getCacheControl"

async function infoLoader(args: AnyLoaderFunctionArgs) {
	const params = Schema.decodeUnknownSync(
		Schema.struct({
			userName: Schema.string
		})
	)(args.params)

	const data = await client_operation(
		graphql(`
			query UserInfo($userName: String!) {
				User(name: $userName) {
					id
					isFollower
					isFollowing
					avatar {
						medium
						large
					}
					donatorBadge
				}
			}
		`),
		{ userName: params.userName },
		args
	)

	return json(data, {
		headers: {
			"Cache-Control": getCacheControl(cacheControl)
		}
	})
}

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

const cache = clientOnly$(
	new LoaderCache({
		...cacheControl,
		lookup: infoLoader
	})
)
export const clientLoader: ClientLoaderFunction = async (args) => await cache?.get(args)

export const loader = (async (args) => {
	return infoLoader(args)
}) satisfies LoaderFunction
