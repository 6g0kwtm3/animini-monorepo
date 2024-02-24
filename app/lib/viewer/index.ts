import { Schema } from "@effect/schema"

const Viewer = Schema.struct({
	name: Schema.string,
	id: Schema.number
})

export const Token = Schema.struct({
	token: Schema.Trim,
	viewer: Viewer
})

export const JsonToToken = Schema.parseJson(Token)
