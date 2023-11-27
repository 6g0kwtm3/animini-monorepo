import { browser, dev } from "$app/environment"
import { InMemoryCache, type NormalizedCacheObject } from "@apollo/client/core"
import { LocalStorageWrapper, persistCache } from "apollo3-cache-persist"

import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev"

if (dev) {
	loadDevMessages()
	loadErrorMessages()
}

const cache = new InMemoryCache({})

declare global {
	interface Window {
		__APOLLO_STATE__: NormalizedCacheObject
	}
}

if (browser) {
	await persistCache({
		cache,
		storage: new LocalStorageWrapper(window.localStorage),
	})

	// cache.restore(window.__APOLLO_STATE__)
}

export { cache }

import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import type { LoadEvent } from "@sveltejs/kit"
import {
	get,
	type Invalidator,
	type Readable,
	type Subscriber,
	type Unsubscriber,
	type Updater,
	type Writable,
} from "svelte/store"
import type { AnyVariables } from "urql"
import { urql } from "./urql"

interface QueryStore_<Result, Variables extends AnyVariables>
	extends Writable<Result | undefined> {
	fetch(event: LoadEvent): Promise<QueryStore_<Result, Variables>>
}

class BaseDecorator<Result, Variables extends AnyVariables>
	implements QueryStore_<Result, Variables>
{
	constructor(protected store: QueryStore_<Result, Variables>) {}

	fetch(event: LoadEvent) {
		return this.store.fetch(event)
	}

	set = (value: Result | undefined): void => {
		this.store.set(value)
	}

	update = (updater: Updater<Result | undefined>): void => {
		this.store.update(updater)
	}

	subscribe = (
		run: Subscriber<Result | undefined>,
		invalidate?: Invalidator<Result | undefined> | undefined,
	): Unsubscriber => {
		return this.store.subscribe(run, invalidate)
	}
}

const RefocusDecorator = browser
	? class RefocusDecorator<
			Result,
			Variables extends AnyVariables,
	  > extends BaseDecorator<Result, Variables> {
			subscribe = (
				run: Subscriber<Result | undefined>,
				invalidate?: Invalidator<Result | undefined> | undefined,
			): Unsubscriber => {
				const listener = async () => {
					const { data, error } = await this.request()
					if (error?.networkError || !data) {
						return
					}
					this.set(data)
				}

				const unsubscribe = this.store.subscribe(run, invalidate)
				window.addEventListener("focus", listener)

				return () => {
					window.removeEventListener("focus", listener)
					unsubscribe()
				}
			}
	  }
	: BaseDecorator

export const QueryStore = browser
	? class QueryStore<Result, Variables extends AnyVariables>
			implements QueryStore_<Result, Variables>
	  {
			constructor(
				private query: TypedDocumentNode<Result, Variables>,
				private variables: Variables,
			) {}

			async fetch(event: LoadEvent) {
				const { data, error } = await urql
					.query<Result, Variables>(this.query, this.variables, {
						fetch: event.fetch,
						requestPolicy: "network-only",
					})
					.toPromise()

				if (error) throw error

				this.set(data)

				return this
			}

			set = (value: Result | undefined): void => {
				cache.writeQuery({
					data: value,
					query: this.query,
					variables: this.variables,
					broadcast: true,
				})
			}

			update = (updater: Updater<Result | undefined>): void => {
				this.set(updater(get(this)))
			}

			subscribe = (
				run: Subscriber<Result | undefined>,
				invalidate?: Invalidator<Result> | undefined,
			): Unsubscriber => {
				let first = false

				const listener = async () => {
					const { data, error } = await urql
						.query<Result, Variables>(this.query, this.variables, {
							requestPolicy: "network-only",
						})
						.toPromise()

					if (error?.networkError || !data) {
						return
					}

					cache.writeQuery({
						data: data,
						query: this.query,
						variables: this.variables,
						broadcast: true,
					})
				}

				window.addEventListener("focus", listener)

				const unsubscribe = cache.watch({
					query: this.query,
					callback: ({ result }) => {
						first && invalidate?.()
						first = true
						run(result)
					},
					variables: this.variables,
					immediate: true,
					optimistic: true,
					returnPartialData: true,
				})

				return () => {
					window.removeEventListener("focus", listener)
					unsubscribe()
				}
			}
	  }
	: class QueryStore<Result, Variables extends AnyVariables>
			implements QueryStore_<Result, Variables>
	  {
			private data: Result | undefined

			constructor(
				private query: TypedDocumentNode<Result, Variables>,
				private variables: Variables,
			) {}

			set = (value: Result | undefined): void => {
				this.data = value
			}

			update = (updater: Updater<Result | undefined>): void => {
				this.set(updater(this.data))
			}

			async fetch(event: LoadEvent) {
				const { data, error } = await urql
					.query<Result, Variables>(this.query, this.variables, {
						fetch: event.fetch,
						requestPolicy: "network-only",
					})
					.toPromise()

				if (error) throw error

				this.set(data)

				return this
			}

			subscribe = (
				run: Subscriber<Result | undefined>,
				invalidate?: Invalidator<Result> | undefined,
			): Unsubscriber => {
				run(this.data)
				return () => {}
			}
	  }
