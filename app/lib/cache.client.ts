import { QueryClient } from "@tanstack/react-query"

import { experimental_createPersister } from "@tanstack/query-persist-client-core"

export function createGetInitialData(): () => boolean | undefined {
	let isInitialRequest = true

	return function getInitialData() {
		if (isInitialRequest) {
			isInitialRequest = false
			return true
		}
	}
}

export const client = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60_000,
			gcTime: 1000 * 60 * 60 * 24 // 24 hours
		}
	}
})

export const persister = experimental_createPersister({
	storage: window.localStorage,
	buster: __BUSTER__
})
