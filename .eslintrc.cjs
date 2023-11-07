/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "plugin:compat/recommended",
    "plugin:unicorn/recommended",
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
  ],
  plugins: ["react-refresh", "compat"],
  env: {
    browser: true,
  },
  rules: {
    "unicorn/prevent-abbreviations": [
      "error",
      {
        replacements: {
          props: {
            properties: false,
          },
          param: {
            parameter: false,
          },
          params: {
            parameters: false,
          },
          ref: {
            reference: false,
          },
        },
      },
    ],
    "unicorn/no-array-method-this-argument": "off",
    "unicorn/no-array-callback-reference": "off",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    "unicorn/no-nested-ternary": "off",
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
        allowExportNames: ["meta", "links", "headers", "loader", "action"],
      },
    ],
  },
}
