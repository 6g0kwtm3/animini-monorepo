import type { ClientLoaderFunctionArgs } from "@remix-run/react"
import { Predicate } from "effect"

export function getCacheControl(options: {
	maxAge?: number
	staleWhileRevalidate?: number
	private?: boolean
}): string {
	let header = ""
	if (Predicate.isNumber(options.maxAge)) {
		header += `max-age=${options.maxAge}`
	}

	if (Predicate.isNumber(options.staleWhileRevalidate)) {
		header += `${header ? ", " : ""}stale-while-revalidate=${options.maxAge}`
	}

	if (options.private) {
		header += `${header ? ", " : ""}private`
	}

	return header
}

type CacheOptions<K, T> = {
	maxAge?: number
	staleWhileRevalidate?: number
	lookup: (args: K) => Promise<T>
}

class LRUCache<K, T> {
	constructor(private options: CacheOptions<K, T>) {}
	private cache: { value: T; set: number } | null = null
	set(value: T): T {
		this.cache = { value, set: Date.now() }
		return value
	}
	async get(key: K): Promise<T> {
		if (!this.cache) {
			return this.set(await this.options.lookup(key))
		}
		if (this.cache.set + (this.options.maxAge ?? 0) * 1000 <= Date.now()) {
			// still fresh
			return this.cache.value
		}
		if (
			this.cache.set + (this.options.staleWhileRevalidate ?? 0) * 1000 <=
			Date.now()
		) {
			// stale while revalidate
			this.options.lookup(key).then(this.set).catch()
			return this.cache.value
		}
		// stale
		return this.set(await this.options.lookup(key))
	}
}

export class LoaderCache<T> {
	cache: LRUCache<ClientLoaderFunctionArgs, T>

	isInitialRequest = true

	constructor(options: CacheOptions<ClientLoaderFunctionArgs, T>) {
		this.cache = new LRUCache(options)
	}

	async get(args: ClientLoaderFunctionArgs): Promise<T> {
		if (this.isInitialRequest) {
			this.isInitialRequest = false
			return this.cache.set(await args.serverLoader<any>())
		}
		return await this.cache.get(args)
	}
}
