import cookie from "cookie"
import { redirect, type ClientLoaderFunctionArgs } from "react-router"

export const clientAction = async (args: ClientLoaderFunctionArgs) => {
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
}
