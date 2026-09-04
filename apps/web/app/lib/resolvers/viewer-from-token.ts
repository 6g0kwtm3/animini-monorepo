import { suspenseSentinel, type LiveState } from "relay-runtime"

/**
 * @relayField Query.userFromToken: RelayResolverValue
 * @live
 */
export function userFromToken(): LiveState<null | {
	readonly id: number
	readonly name: string
}> {
	let status:
		| { readonly error: unknown; readonly kind: "Error" }
		| { readonly kind: "Loading" }
		| {
				readonly kind: "Ready"
				readonly value: null | { readonly id: number; readonly name: string }
		  } = { kind: "Loading" }

	const callbacks = new Set<{ callback: () => void }>()

	void cookieStore
		.get("anilist-token")

		.then((cookie) => {
			if (status.kind === "Loading") {
				status = {
					kind: "Ready",
					value: cookie != null ? parseViewerCookie(cookie) : null,
				}
				for (const { callback } of callbacks) {
					callback()
				}
			}
		})
		.catch((error: unknown) => {
			if (status.kind === "Loading") {
				status = { kind: "Error", error }
				for (const { callback } of callbacks) {
					callback()
				}
			}
		})

	return {
		read() {
			switch (status.kind) {
				case "Loading":
					return suspenseSentinel()
				case "Ready":
					return status.value
				case "Error":
					throw status.error
			}
		},
		subscribe(callback) {
			const wrapper = { callback }
			void callbacks.add(wrapper)
			const controller = new AbortController()
			cookieStore.addEventListener(
				"change",
				(e) => {
					for (const cookie of e.changed) {
						if (cookie.name === "anilist-token") {
							status = { kind: "Ready", value: parseViewerCookie(cookie) }
							callback()
						}
					}
					for (const cookie of e.deleted) {
						if (cookie.name === "anilist-token") {
							status = { kind: "Ready", value: null }
							callback()
						}
					}
				},
				{ signal: controller.signal }
			)

			return () => {
				controller.abort()
				void callbacks.delete(wrapper)
			}
		},
	}
}

import { ArkErrors } from "arktype"
import { JsonToToken } from "../viewer"

function parseViewerCookie(cookie: CookieListItem): {
	readonly id: number
	readonly name: string
} {
	const result = JsonToToken(cookie.value)
	if (result instanceof ArkErrors) {
		throw result
	}
	return result.viewer
}
