import type { CodegenConfig } from "@graphql-codegen/cli"
import { optimizeDocuments } from "@graphql-tools/relay-operation-optimizer"
import { buildASTSchema, Kind } from "graphql"

const config: CodegenConfig = {
	schema: "schema.graphql",
	documents: ["app/**/*.{ts,tsx}"],
	emitLegacyCommonJSImports: false,
	ignoreNoDocuments: true,
	config: {
		avoidOptionals: {
			field: true,
			inputValue: false
		},
		futureProofUnions: true,
		futureProofEnums: true,
		defaultScalarType: "unknown",
		dedupeFragments: true,
		scalars: {
			Json: "~/lib/urql.server#JSONValue",
			CountryCode: "~/lib/urql.server#CountryCode",
			FuzzyDateInt: "number"
		},
		useTypeImports: true,
		documentMode: "string"
	},
	generates: {
		"app/gql/": {
			preset: "client",
			config: {},
			documentTransforms: [
				{
					transform({ documents, schema, config, pluginContext }) {
						const fragments = Object.fromEntries(
							documents
								.flatMap(({ document }) =>
									document ? document.definitions : []
								)
								.flatMap((definition) =>
									definition.kind === Kind.FRAGMENT_DEFINITION
										? [[definition.name.value, definition]]
										: []
								)
						)

						// return documents

						const docs = optimizeDocuments(
							buildASTSchema(schema),
							documents.flatMap(({ document }) => (document ? [document] : [])),
							// {
							//   includeFragments: true,
							// },
						)

						return docs
							.concat(
								Object.values(fragments).map((definition) => ({
									definitions: [definition],
									kind: Kind.DOCUMENT
								}))
							)
							.map((document) => ({ document }))
					}
				}
			]
		}
	}
}

export default config
