import { type } from "arktype"

export class Timeout extends Error {
	reset: string
	constructor(reset: string) {
		super()
		this.reset = reset
	}
}

const PayloadErrors = type([
	{
		message: "string",
		"status?": "number",
		"validation?": "Record<string,string[]>",
		"locations?": [{ line: "number", column: "number" }, "[]"],
		"path?": "(string|number)[]",
	},
	"[]",
])

const PayloadData = type("Record<string,unknown>")
const PayloadExtensions = type("Record<string,unknown>")

const GraphQLResponseWithData = type({
	data: PayloadData,
	"extensions?": PayloadExtensions,
	"errors?": PayloadErrors,
	"label?": "string",
	"path?": "(string|number)[]",
})

const GraphQLResponseWithExtensionsOnly = type({
	data: "null",
	extensions: PayloadExtensions,
})

const GraphQLResponseWithoutData = type({
	"data?": PayloadData,
	"extensions?": PayloadExtensions,
	errors: PayloadErrors,
	"label?": "string",
	"path?": "(string|number)[]",
})

export const GraphQLSingularResponse = GraphQLResponseWithExtensionsOnly.or(
	GraphQLResponseWithoutData
).or(GraphQLResponseWithData)

export const GraphQLResponse = GraphQLSingularResponse.or(
	type(GraphQLSingularResponse, "[]")
)
