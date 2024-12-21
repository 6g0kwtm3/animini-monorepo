import { Schema } from "@effect/schema"

const mutableArray = <S extends Schema.Schema.Any>(schema: S) =>
	Schema.mutable(Schema.Array(schema))

const mutableStruct = <F extends Schema.Struct.Fields>(schema: F) =>
	Schema.mutable(Schema.Struct<F>(schema))

export class Timeout extends Schema.TaggedError<Timeout>()("Timeout", {
	reset: Schema.String,
}) {}

const PayloadData = Schema.mutable(
	Schema.Record({ key: Schema.String, value: Schema.Any })
)

const PayloadError = mutableStruct({
	message: Schema.String,
	locations: Schema.optional(
		mutableArray(
			mutableStruct({
				line: Schema.Number,
				column: Schema.Number,
			})
		)
	),
	path: Schema.optional(
		mutableArray(Schema.Union(Schema.String, Schema.Number))
	),
	// Not officially part of the spec, but used at Anilist
	status: Schema.optional(Schema.Number),
})

const PayloadExtensions = Schema.mutable(
	Schema.Record({ key: Schema.String, value: Schema.Any })
)

const GraphQLResponseWithData = mutableStruct({
	data: PayloadData,
	errors: Schema.optional(mutableArray(PayloadError)),
	extensions: Schema.optional(PayloadExtensions),
	label: Schema.optional(Schema.String),
	path: Schema.optional(
		mutableArray(Schema.Union(Schema.String, Schema.Number))
	),
})

const GraphQLResponseWithoutData = mutableStruct({
	data: Schema.optional(PayloadData),
	errors: mutableArray(PayloadError),
	extensions: Schema.optional(PayloadExtensions),
	label: Schema.optional(Schema.String),
	path: Schema.optional(
		mutableArray(Schema.Union(Schema.String, Schema.Number))
	),
})

const GraphQLResponseWithExtensionsOnly = mutableStruct({
	data: Schema.Null,
	extensions: PayloadExtensions,
})

export const GraphQLSingularResponse = Schema.Union(
	GraphQLResponseWithData,
	GraphQLResponseWithExtensionsOnly,
	GraphQLResponseWithoutData
)

export const GraphQLResponse = Schema.Union(
	GraphQLSingularResponse,
	Schema.Array(GraphQLSingularResponse)
)
