import { type } from "arktype"
import { Data } from "effect"

export class Timeout extends Data.TaggedError("Timeout")<{
	reset: string
}> {}

const PayloadErrors = type([
	{
		message: "string",
		"status?": "number",
	},
	"[]",
])

const PayloadData = type("Record<string,unknown>")
const PayloadExtensions = type("Record<string,unknown>")

const GraphQLResponseWithData = type({
	data: PayloadData,
	"extensions?": PayloadExtensions,
	"errors?": PayloadErrors,
})

const GraphQLResponseWithExtensionsOnly = type({
	data: "null",
	extensions: PayloadExtensions,
})

const GraphQLResponseWithoutData = type({
	"data?": PayloadData,
	"extensions?": PayloadExtensions,
	errors: PayloadErrors,
})

export const GraphQLResponse = GraphQLResponseWithExtensionsOnly.or(
	GraphQLResponseWithoutData
).or(GraphQLResponseWithData)
