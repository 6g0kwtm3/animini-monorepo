# AGENTS.md

Pointers for agents working in this repo. Behaviour lives in the files below — no generic LLM advice is loaded here every session.

## Review-time standards

- `CODING_STANDARDS.md` — behavioural guidelines (think before coding, simplicity, surgical changes, goal-driven execution). Review-time material, not a session-start read.

## Docs

- `docs/agents/` — domain language and docs pointer (`domain.md`), issue tracker and triage labels (`issue-tracker.md`, `triage-labels.md`), ESLint rule authoring gotchas (`eslint-rule-authoring.md`)
- `docs/adr/` — architectural decision records

## Check commands (from the repo root)

- `pnpm check` — turbo `check` (transit + generate-code)
- `pnpm lint` — eslint, `--max-warnings 0` (note: the root script also passes `--fix`; a silent fix is not a pass)
- `pnpm test` — vitest over changed files vs `origin/master`
- `pnpm knip` — unused-export/dependency sweep

## Packages worth copying

- `packages/eslint-plugin-jsx/` — JSX ESLint plugin
- `packages/eslint-plugin-relay/` — Relay ESLint plugin
- `packages/eslint-plugin-json/` — newest example; `@eslint/json` rules

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
