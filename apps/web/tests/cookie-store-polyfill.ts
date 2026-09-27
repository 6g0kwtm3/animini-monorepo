/**
 * A `document.cookie` backed stand-in for the Cookie Store API.
 *
 * WebKit doesn't implement `cookieStore`, and the app reads, writes and
 * subscribes to `change` on it, so tests need this to run there at all.
 * Chromium and Electron keep their native implementation.
 *
 * Serialized into the page by `addInitScript`, so it must not close over
 * anything from this module.
 */
export const cookieStorePolyfill = () => {
	if ("cookieStore" in window) return

	type SameSite = "lax" | "none" | "strict"
	type CookieInit = {
		domain?: string
		expires?: number
		httpOnly?: boolean
		name: string
		partitioned?: boolean
		path?: string
		sameSite?: SameSite
		secure?: boolean
		value: string
	}
	type CookieListItem = {
		domain: string
		expires: number
		name: string
		path: string
		sameSite: SameSite
		secure: boolean
		value: string
	}

	// Neither the Cookie Store API nor `document.cookie` encodes values, so
	// neither does this: what `set` writes is what `get` reads back.
	const toInit = (
		nameOrInit: (CookieInit | string)[] | CookieInit | string,
		value?: string
	): CookieInit[] => {
		const entries = Array.isArray(nameOrInit) ? nameOrInit : [nameOrInit]
		return entries.map((entry) =>
			typeof entry === "string" ? { name: entry, value: value ?? "" } : entry
		)
	}

	// A cookie value is never included, only its length, so that a test using a
	// real credential can't leak one into a failure snapshot.
	const record = (attempt: {
		expected: number
		expires: string
		landed: boolean
		name: string
		readBack: string[]
	}) => {
		const registry = window as unknown as Record<string, unknown[]>
		const log = (registry.__cookieStoreWrites ??= [])
		void log.push(attempt)
	}

	const toItem = (name: string, value: string): CookieListItem => ({
		domain: location.hostname,
		expires: -1,
		name,
		path: "/",
		sameSite: "lax",
		secure: false,
		value,
	})

	const read = (name?: string): CookieListItem[] => {
		return (
			document.cookie
				// Not `"; "`: the spec's serializer joins with a semicolon and a space,
				// but a bare `;` is legal too, and splitting on the two character form
				// alone silently reads back a single nameless cookie.
				.split(";")
				.map((pair) => pair.trim())
				.filter((pair) => pair.length > 0)
				.map((pair) => {
					const separator = pair.indexOf("=")
					return {
						name: pair.slice(0, separator),
						value: pair.slice(separator + 1),
					}
				})
				.filter((pair) => name == null || pair.name === name)
				.map((pair) => toItem(pair.name, pair.value))
		)
	}

	// `CookieChangeEvent` is missing on WebKit too, so decorate a plain event.
	// The spec queues `change` as a task and chromium fires it before the
	// `set`/`delete` promise resolves; matching that keeps the app's live
	// queries updating at the same point in a flow as they do in chromium.
	const queueChange = (
		target: EventTarget,
		changed: CookieListItem[],
		deleted: CookieListItem[]
	) => {
		return new Promise<void>((resolve) => {
			void setTimeout(() => {
				void target.dispatchEvent(
					Object.assign(new Event("change"), { changed, deleted })
				)
				resolve()
			}, 0)
		})
	}

	class CookieStorePolyfill extends EventTarget {
		delete(nameOrInit: (CookieInit | string)[] | CookieInit | string) {
			const inits = toInit(nameOrInit)
			const deleted = inits
				.map((init) => read(init.name)[0])
				.filter((cookie) => cookie != null)
			for (const init of inits) {
				document.cookie = `${init.name}=; path=${init.path ?? "/"}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
			}
			return queueChange(this, [], deleted)
		}

		get(name: string) {
			return Promise.resolve(read(name)[0] ?? null)
		}

		getAll(name?: string) {
			return Promise.resolve(read(name))
		}

		set(
			nameOrInit: (CookieInit | string)[] | CookieInit | string,
			value?: string
		) {
			const before = new Map(read().map((cookie) => [cookie.name, cookie]))
			for (const init of toInit(nameOrInit, value)) {
				const expires =
					init.expires == null
						? ""
						: `expires=${new Date(init.expires).toUTCString()}`
				document.cookie = [
					`${init.name}=${init.value}`,
					`path=${init.path ?? "/"}`,
					expires,
					init.secure ? "secure" : "",
				]
					.filter((attribute) => attribute.length > 0)
					.join("; ")
				// A malformed `expires` makes the whole write get dropped without
				// a word, so report whether it landed for `fixtures.ts` to snapshot.
				record({
					name: init.name,
					expected: init.value.length,
					expires,
					landed: read(init.name).some((cookie) => cookie.value === init.value),
					readBack: read().map(
						(cookie) => `${cookie.name}:${cookie.value.length}`
					),
				})
			}
			const after = read()
			const names = new Set(after.map((cookie) => cookie.name))
			return queueChange(
				this,
				after.filter(
					(cookie) => before.get(cookie.name)?.value !== cookie.value
				),
				[...before.values()].filter((cookie) => !names.has(cookie.name))
			)
		}
	}

	void Object.defineProperty(window, "cookieStore", {
		configurable: true,
		value: new CookieStorePolyfill(),
	})
}
