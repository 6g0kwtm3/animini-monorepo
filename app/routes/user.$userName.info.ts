import { Schema } from "@effect/schema"
import type { LoaderFunction, SerializeFrom } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"

import type { ClientLoaderFunctionArgs } from "@remix-run/react"
import { clientOnly$ } from "vite-env-only"
import { graphql } from "~/gql"
import { client, createGetInitialData, persister } from "~/lib/cache.client"
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
	return data
}

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

const isInitialRequest = clientOnly$(createGetInitialData())
export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	return client.ensureQueryData({
		revalidateIfStale: true,
		persister,
		queryKey: ["_nav", args.params.userName, "info"],
		queryFn: async () => infoLoader(args),
		initialData:
			isInitialRequest?.() && (await args.serverLoader<typeof loader>())
	})
}
clientLoader.hydrate = true

export const loader = (async (args) => {
	return json(await infoLoader(args), {
		headers: {
			"Cache-Control": getCacheControl(cacheControl)
		}
	})
}) satisfies LoaderFunction
