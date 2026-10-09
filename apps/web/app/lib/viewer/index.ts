import { type } from "arktype"

export const Viewer = type({ name: "string", id: "number.integer" })

export const Token = type({
	token: "string.trim",
	viewer: Viewer,
	sessionId: "string",
})

export const JsonToToken = type("string.json.parse").to(Token)
