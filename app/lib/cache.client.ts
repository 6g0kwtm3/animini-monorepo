import type { SerializeFrom } from "@remix-run/node"
import type { ClientLoaderFunctionArgs } from "@remix-run/react"

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

type CacheOptions<K, T> = {
	maxAge?: number
	staleWhileRevalidate?: number
	lookup: (args: K) => Promise<T>
}

class Entry<T> {
	constructor(
		private createdAt: number,
		readonly value: T,
		private options: {
			maxAge: number
			staleWhileRevalidate: number
		}
	) {}

	private get maxAgeAt() {
		return this.createdAt + this.options.maxAge * 1000
	}
	private get staleWhileRevalidateAt() {
		return this.maxAgeAt + this.options.staleWhileRevalidate * 1000
	}

	isFresh() {
		return this.maxAgeAt < Date.now()
	}

	isStaleWhileRevalidate() {
		return this.staleWhileRevalidateAt < Date.now()
	}
}

class LRUCache<K, T> {
	constructor(private options: CacheOptions<K, T>) {}
	private cached: Entry<T> | null = null
	set(value: T): T {
		this.cached = new Entry(Date.now(), value, {
			maxAge: this.options.maxAge ?? 0,
			staleWhileRevalidate: this.options.staleWhileRevalidate ?? 0
		})
		return value
	}

	async get(key: K): Promise<T> {
		if (this.cached?.isFresh()) {
			return this.cached.value
		}
		if (this.cached?.isStaleWhileRevalidate()) {
			this.options.lookup(key).then(this.set).catch()
			return this.cached.value
		}
		// stale
		return this.set(await this.options.lookup(key))
	}
}

export class LoaderCache<T> {
	cache: LRUCache<ClientLoaderFunctionArgs, T>

	constructor(options: CacheOptions<ClientLoaderFunctionArgs, T>) {
		this.cache = new LRUCache(options)
	}

	isInitialRequest = true
	async get(args: ClientLoaderFunctionArgs): Promise<T> {
		if (this.isInitialRequest) {
			this.isInitialRequest = false
			return this.cache.set(await args.serverLoader<any>())
		}
		return await this.cache.get(args)
	}
}

export const client = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24 // 24 hours
			// networkMode: "offlineFirst"
		}
	}
})

const localStoragePersister = createSyncStoragePersister({
	storage: window.localStorage
})

const [, loadPersister] = persistQueryClient({
	queryClient: client,
	persister: localStoragePersister,
	buster: __BUSTER__
})
await loadPersister
await client.resumePausedMutations()
// await client.invalidateQueries()

console.log({ __BUSTER__ })

export function createGetInitialData(): <T = any>(
	args: ClientLoaderFunctionArgs
) => Promise<SerializeFrom<T>> | undefined {
	let isInitialRequest = true

	return function getInitialData<T>(args: ClientLoaderFunctionArgs) {
		if (isInitialRequest) {
			isInitialRequest = false
			return args.serverLoader<T>()
		}
	}
}
