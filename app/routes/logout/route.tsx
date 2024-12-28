import { redirect, type ClientActionFunction } from "react-router"
import { commitLocalUpdate } from "~/lib/Network"

export const clientAction = (async (args) => {
	const url = new URL(args.request.url)

	sessionStorage.removeItem("anilist-token")

	commitLocalUpdate((store) => {
		store.invalidateStore()
	})

	return redirect(url.searchParams.get("redirect") ?? "/", {})
}) satisfies ClientActionFunction
