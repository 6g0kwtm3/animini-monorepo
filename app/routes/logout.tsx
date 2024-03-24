import type { ActionFunction } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import type { ClientActionFunction } from "@remix-run/react"
import cookie from "cookie"
import { client } from "~/lib/cache.client"

export const action = (async (args) => {
	const url = new URL(args.request.url)
	return redirect(url.searchParams.get("redirect") ?? "/", {
		headers: {
			"Set-Cookie": cookie.serialize(`anilist-token`, "", {
				sameSite: "lax",
				maxAge: 0,
				path: "/"
			})
		}
	})
}) satisfies ActionFunction

export const clientAction: ClientActionFunction = async ({ serverAction }) => {
	const result = await serverAction<typeof action>()
	await client.invalidateQueries()
	return result
}