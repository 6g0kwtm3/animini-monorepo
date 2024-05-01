import { Schema } from "@effect/schema"

const Viewer = Schema.Struct({
	name: Schema.String,
	id: Schema.Number
})

export const Token = Schema.Struct({
	token: Schema.Trim,
	viewer: Viewer
})

export const JsonToToken = Schema.parseJson(Token)
