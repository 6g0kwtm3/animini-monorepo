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
		defaultScalarType: "unknown",
		dedupeFragments: true,
		scalars: { Json: "~/lib/urql.server#JSONValue" }
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
