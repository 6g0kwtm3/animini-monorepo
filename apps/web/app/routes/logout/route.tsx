import { setUser } from "@sentry/react"
import { redirect, type ClientLoaderFunctionArgs } from "react-router"
import { commitLocalUpdate } from "~/lib/Network"

export const clientAction = async (args: ClientLoaderFunctionArgs) => {
	const url = new URL(args.request.url)
	await cookieStore.delete(`anilist-token`)
	setUser(null)
	commitLocalUpdate((store) => {
		store.invalidateStore()
	})
	return redirect(url.searchParams.get("redirect") ?? "/")
}
