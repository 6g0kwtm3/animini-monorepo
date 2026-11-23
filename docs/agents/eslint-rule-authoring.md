# ESLint Rule Authoring

Non-obvious rules for writing ESLint rules in this repo, learned by reading vendored sources — none of them are visible from a diff.

## Four gotchas

1. **A JSON-parsed AST has no `getAllComments`.** Any JS/React rule must carry a `files` glob. `eslint-config-react` spreads `eslint-plugin-react`'s legacy flat configs, which have no `files` glob — add one explicitly.
2. **`eslint-vitest-rule-tester` needs `{ messageId, data }` objects** when the rule message interpolates `data` (plain strings fail).
3. **A plugin must not devDep the config package that configures it** — turbo rejects the whole graph ("Cyclic dependency detected").
4. **`.gitignore` does not keep a directory's `package.json` out of a config's `files: ["**/package.json"]`.** The root config needs the directory in `ignores` (`.vscode/apm_modules`, already ignored at `.gitignore:33`).

## Package shape to copy

- `packages/eslint-plugin-jsx/` or `packages/eslint-plugin-relay/` — the plugin shape to copy.
- `packages/eslint-plugin-json/` — the newest example.
