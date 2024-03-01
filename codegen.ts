import type { CodegenConfig } from "@graphql-codegen/cli"

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
		}
	},
	generates: {
		"app/gql/": {
			preset: "client",
			config: {
				useTypeImports: true
			}
		}
	}
}

export default config
