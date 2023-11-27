import { QueryStore } from "~/lib/cache.svelte"
import { TypelistQuery } from "./page"

export const load = (event) => {
	const { params } = event
	const TypelistQueryVariables = {
		type: params.typelist,
		userName: params.userName,
	}

	return {
		TypelistQuery: new QueryStore(TypelistQuery, TypelistQueryVariables).fetch(
			event,
		),
	}
}
