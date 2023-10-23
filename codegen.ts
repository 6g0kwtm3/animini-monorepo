import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: [
    "app/**/*.{ts,tsx}",
    "node_modules/@graphql-codegen/builder/**/*",
  ],
  emitLegacyCommonJSImports: false,
  ignoreNoDocuments: true,
  config: {
    avoidOptionals: {
      field: true,
      inputValue: false,
    },
    defaultScalarType: "unknown",
    scalars: { Json: "~/lib/urql#JSONValue" },
  },
  generates: {
    "app/gql/": {
      preset: "client",
      plugins: ["typescript-urql-graphcache"],
      config: { useTypeImports: true },
    },
    "app/gql/sizzle.ts": {
      plugins: ["typescript", "sizzle-gql"],
      config: { useTypeImports: true },
    },
    "app/gql/introspection.json": {
      plugins: ["urql-introspection"],
    },
    // "app/builder.ts": {
    //   plugins: ["typescript","builder"],
    // },
  },
}

export default config
