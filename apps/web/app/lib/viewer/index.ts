import { type } from "arktype"

export const Viewer = type({ name: "string", id: "number.integer" })

export const Token = type({
	token: "string.trim",
	viewer: Viewer,
	sessionId: "string",
})

export const CookieToToken = type("string")
	.pipe(decodeBase64)
	.pipe(decodeURIComponent)
	.to(type("string.json.parse"))
	.to(Token)

export const TokenToCookie = Token.pipe((value) => JSON.stringify(value))
	.pipe(encodeURIComponent)
	.pipe(encodeBase64)

function encodeBase64(text: string) {
	const bytes = new TextEncoder().encode(text)
	const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("")

	return btoa(binary)
}

function decodeBase64(base64: string) {
	const binary = atob(base64)
	const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))

	return new TextDecoder().decode(bytes)
}
