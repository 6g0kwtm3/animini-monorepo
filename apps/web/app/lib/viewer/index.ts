import { type } from "arktype"

export const Viewer = type({ name: "string", id: "number.integer" })

export const Token = type({ token: "string.trim", viewer: Viewer })

export const JsonToToken = type("string.json.parse").to(Token)
