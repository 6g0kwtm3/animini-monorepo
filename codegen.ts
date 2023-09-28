import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["app/**/*.{ts,tsx}", "node_modules/@graphql-codegen/builder/**/*"],
  emitLegacyCommonJSImports: false,
  ignoreNoDocuments: true,
  config: { useTypeImports: true },
  generates: {
    "app/gql/": {
      preset: "client",
      plugins: ["typescript-urql-graphcache"],
    },
    // "app/builder.ts": {
    //   plugins: ["typescript","builder"],
    // },
  },
};

export default config;
