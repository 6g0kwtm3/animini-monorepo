import { type } from "arktype"

const Viewer = type({ id: "number.integer", name: "string" })

export const Token = type({ token: "string.trim", viewer: Viewer })

export const JsonToToken = type("string.json.parse").to(Token)
