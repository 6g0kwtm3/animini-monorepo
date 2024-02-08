import type { ActionFunction } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import cookie from "cookie"

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
