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
      inputValue: false,
    },
    defaultScalarType: "unknown",
    dedupeFragments: true,
    scalars: { Json: "~/lib/urql#JSONValue" },
  },
  generates: {
    "app/gql/": {
      preset: "client",
      plugins: ["typescript-urql-graphcache"],
      config: {
        useTypeImports: true,
      },
      documentTransforms: [
        {
          transform({ documents, schema, config, pluginContext }) {
            const fragments = Object.fromEntries(
              documents
                .flatMap(({ document }) =>
                  document ? document.definitions : [],
                )
                .flatMap((definition) =>
                  definition.kind === Kind.FRAGMENT_DEFINITION
                    ? [[definition.name.value, definition]]
                    : [],
                ),
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
                  kind: Kind.DOCUMENT,
                })),
              )
              .map((document) => ({ document }))
          },
        },
      ],
    },
    "app/gql/introspection.json": {
      plugins: ["urql-introspection"],
    },
  },
}

export default config
