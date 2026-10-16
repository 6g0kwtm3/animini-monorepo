import ReactRelay from "react-relay"
import { suspenseSentinel, type LiveState } from "relay-runtime"

import { readFragment } from "../Network"

import type { Html } from "markdown"
import type { SanitizeHTML_query$key } from "~/gql/SanitizeHTML_query.graphql"
const { graphql } = ReactRelay

/**
 * @relayField Query.sanitizeHTML: RelayResolverValue @semanticNonNull
 * @rootFragment SanitizeHTML_query
 * @live
 */
export function sanitizeHTML(
	key: SanitizeHTML_query$key
): LiveState<(html: Html) => Html> {
	const query = readFragment(
		graphql`
			fragment SanitizeHTML_query on Query @throwOnFieldError {
				featureFlags {
					enableSanitizerWebAPI
				}
			}
		`,
		key
	)

	if (query.featureFlags.enableSanitizerWebAPI) {
		return {
			read() {
				return sanitizeHtmlWebAPI
			},
			subscribe() {
				return () => {
					//
				}
			},
		}
	}

	let status:
		| { readonly error: unknown; readonly kind: "Error" }
		| { readonly kind: "Loading" }
		| { readonly kind: "Ready"; readonly value: (html: Html) => Html } = {
		kind: "Loading",
	}

	const callbacks = new Set<{ callback: () => void }>()
	void import("dompurify")
		.then((createDOMPurify) => {
			if (status.kind === "Loading") {
				status = {
					kind: "Ready",
					value: sanitizeHtmlDOMPurify.bind(
						null,
						createDOMPurify.default(window)
					),
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

			return () => {
				void callbacks.delete(wrapper)
			}
		},
	}
}

const ALLOWED_TAGS = [
	"a",
	"b",
	"blockquote",
	"br",
	"center",
	"del",
	"div",
	"em",
	"font",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"hr",
	"i",
	"img",
	"li",
	"ol",
	"p",
	"pre",
	"code",
	"span",
	"strike",
	"strong",
	"ul",
	"u",
	"ins",
]
const ALLOWED_ATTR = [
	"align",
	"height",
	"href",
	"src",
	"target",
	"width",
	"rel",
]

import type { DOMPurify } from "dompurify"

function sanitizeHtmlDOMPurify(dompurify: DOMPurify, t: string) {
	dompurify.addHook("afterSanitizeAttributes", (node) => {
		if ("target" in node) {
			node.setAttribute("target", "_blank")
			node.setAttribute("rel", "noopener noreferrer")
		}
	})

	const out: string = dompurify.sanitize(t, {
		ALLOWED_TAGS: ALLOWED_TAGS,
		ALLOWED_ATTR: ALLOWED_ATTR,
	})

	return out
}

function sanitizeHtmlWebAPI(t: string) {
	const div = document.createElement("div")
	const sanitizer = new Sanitizer({
		elements: ALLOWED_TAGS,
		attributes: ALLOWED_ATTR,
	})

	div.setHTML(t, { sanitizer })

	return div.innerHTML
}
