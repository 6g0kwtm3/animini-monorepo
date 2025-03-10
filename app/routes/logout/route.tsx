import { setUser } from "@sentry/react"
import * as cookie from "cookie"
import { redirect, type ClientLoaderFunctionArgs } from "react-router"

export const clientAction = (args: ClientLoaderFunctionArgs) => {
	const url = new URL(args.request.url)

	const setCookie = cookie.serialize(`anilist-token`, "", {
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	})
	document.cookie = setCookie
	setUser(null)
	return redirect(url.searchParams.get("redirect") ?? "/", {
		headers: {
			"Set-Cookie": setCookie,
		},
	})
}
