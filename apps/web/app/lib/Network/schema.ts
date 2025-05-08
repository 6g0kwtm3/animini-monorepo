import { type } from "arktype"

class Timeout extends Error {
	reset: string
	constructor(reset: string) {
		super()
		this.reset = reset
	}
}

const PayloadError = type({
	message: "string",
	"status?": "number",
	"validation?": "Record<string,string[]>",
	"locations?": [{ line: "number", column: "number" }, "[]"],
	"path?": "(string|number)[]",
})

const PayloadErrors = type([PayloadError, "...", [PayloadError, "[]"]])

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

const GraphQLSingularResponse = GraphQLResponseWithExtensionsOnly.or(
	GraphQLResponseWithoutData
).or(GraphQLResponseWithData)

export const GraphQLResponse = GraphQLSingularResponse.or(
	type(GraphQLSingularResponse, "[]")
)
