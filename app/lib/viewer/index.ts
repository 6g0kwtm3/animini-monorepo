import { Schema } from "@effect/schema"

const Viewer = Schema.struct({
	name: Schema.string,
	id: Schema.number
})

const Token = Schema.struct({
	token: Schema.string,
	viewer: Viewer
})

export const JsonToToken = Schema.parseJson(Token)
