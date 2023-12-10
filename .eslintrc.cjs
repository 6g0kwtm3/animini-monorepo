/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [ "plugin:compat/recommended", "@remix-run/eslint-config", "@remix-run/eslint-config/node"],
  plugins: ["react-refresh", "compat"],
  overrides: [
    {
      files: ["*.js"],
      processor: "@graphql-eslint/graphql",
    },
    {
      files: ["*.graphql"],
      extends: "plugin:@graphql-eslint/operations-recommended",
    },
  ],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
        allowExportNames: ["meta", "links", "headers", "loader", "action","clientAction","clientLoader"],
      },
    ],
  },
}
