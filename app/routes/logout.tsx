import type { ActionFunction } from "@vercel/remix"
import { redirect } from "@vercel/remix"
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
