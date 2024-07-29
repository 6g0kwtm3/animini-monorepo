import { redirect } from "@remix-run/node"
import { unstable_defineClientAction } from "@remix-run/react"
import environment, { commitLocalUpdate } from "~/lib/Network"

export const clientAction = unstable_defineClientAction(async (args) => {
	const url = new URL(args.request.url)

	sessionStorage.removeItem("anilist-token")

	commitLocalUpdate(environment, (store) => {
		store.invalidateStore()
	})

	return redirect(url.searchParams.get("redirect") ?? "/", {})
})
