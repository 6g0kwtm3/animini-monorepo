import { Schema } from "@effect/schema"

export class Timeout extends Schema.TaggedError<Timeout>()("Timeout", {
	reset: Schema.String,
	cause: Schema.instanceOf(Error),
}) {}

const PayloadErrors = Schema.mutable(
	Schema.Array(
		Schema.mutable(
			Schema.Struct({
				message: Schema.String,
				status: Schema.optional(Schema.Number),
			})
		)
	)
)

const PayloadData = Schema.mutable(
	Schema.Record({ key: Schema.String, value: Schema.Any })
)
const PayloadExtensions = Schema.mutable(
	Schema.Record({ key: Schema.String, value: Schema.Any })
)

const GraphQLResponseWithData = Schema.mutable(
	Schema.Struct({
		data: PayloadData,
		extensions: Schema.optional(PayloadExtensions),
		errors: Schema.optional(PayloadErrors),
	})
)

const GraphQLResponseWithExtensionsOnly = Schema.mutable(
	Schema.Struct({
		data: Schema.Null,
		extensions: PayloadExtensions,
	})
)

const GraphQLResponseWithoutData = Schema.mutable(
	Schema.Struct({
		data: Schema.optional(PayloadData),
		extensions: Schema.optional(PayloadExtensions),
		errors: PayloadErrors,
	})
)

export const GraphQLResponse = Schema.Union(
	GraphQLResponseWithData,
	GraphQLResponseWithExtensionsOnly,
	GraphQLResponseWithoutData
)
