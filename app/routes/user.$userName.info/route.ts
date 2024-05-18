import { Schema } from "@effect/schema"
import { unstable_defineLoader } from "@remix-run/cloudflare"

import { unstable_defineClientLoader } from "@remix-run/react"
import { clientOnly$ } from "vite-env-only"
import { graphql } from "~/gql"
import { client, createGetInitialData, persister } from "~/lib/cache.client"
import { client_operation, type AnyLoaderFunctionArgs } from "~/lib/client"
import { getCacheControl } from "~/lib/getCacheControl"
async function infoLoader(args: AnyLoaderFunctionArgs) {
	const params = Schema.decodeUnknownSync(
		Schema.Struct({
			userName: Schema.String
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
	return data
}

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

const isInitialRequest = clientOnly$(createGetInitialData())
export const clientLoader = unstable_defineClientLoader(async (args) => {
	return client.ensureQueryData({
		revalidateIfStale: true,
		persister,
		queryKey: ["_nav", args.params.userName, "info"],
		queryFn: async () => infoLoader(args),
		initialData:
			isInitialRequest?.() && (await args.serverLoader<typeof loader>())
	})
})
clientLoader.hydrate = true

export const loader = unstable_defineLoader(async (args) => {
	args.response?.headers.append("Cache-Control", getCacheControl(cacheControl))
	return infoLoader(args)
})
