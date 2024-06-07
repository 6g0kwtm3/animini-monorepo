import { redirect } from "@remix-run/node"
import { unstable_defineClientAction } from "@remix-run/react"
import cookie from "cookie"

export const clientAction = unstable_defineClientAction(async (args) => {
	const url = new URL(args.request.url)

	const setCookie = cookie.serialize(`anilist-token`, "", {
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	})
	document.cookie = setCookie
	return redirect(url.searchParams.get("redirect") ?? "/", {
		headers: {
			"Set-Cookie": setCookie,
		},
	})
})
