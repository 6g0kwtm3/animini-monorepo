# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## 🏗️ Architecture Overview

This is a monorepo structure, managed by `turbo.json` and utilizing `pnpm`.

- **Monorepo Structure**: Code components and packages are organized under `packages/`.
- **Applications**: Primary front-end applications are located in the `apps/` directory (e.g., `apps/web`).
- **Localization (i18n)**: The entire application relies heavily on **inlang** for managing translation messages.
  - **Source of Truth**: All translation messages are defined in `.inlang` files (e.g., `apps/web/project.inlang`). These files are the source of truth for all keys and messages.
  - **Compilation Output**: Compiled, usable message functions are placed in auto-generated directories (e.g., `apps/web/app/paraglide/`).

## 🛠️ Common Development Commands

The project follows standard monorepo tooling conventions:

| Command                            | Purpose                                                    | Notes                                                          |
| :--------------------------------- | :--------------------------------------------------------- | :------------------------------------------------------------- |
| `pnpm build`                       | Compiles all necessary applications and packages.          | Uses `turbo.json` to manage build order.                       |
| `pnpm lint`                        | Runs linting across all defined packages.                  | Ensures code quality compliance.                               |
| `pnpm test`                        | Executes unit and integration tests across the repository. | Standard testing command.                                      |
| `pnpm run <package-name>:<script>` | Runs specific scripts in isolated packages.                | Use this for targeted work outside the main lifecycle scripts. |

## 🛑 Important Local Rules & Guidelines

These guidelines are crucial for maintaining code integrity, especially around localization.

### 1. Inlang Workflow (Localization)

- **Source of Truth**: **ALWAYS** treat `.inlang` files as the single source of truth for all messages. Changes to messages must originate here.
- **Do Not Edit**: Never manually edit any files inside the compiled output directories (e.g., `apps/web/app/paraglide/`). These folders are **auto-generated** by the inlang tooling and will be overwritten on the next build.
- **Message Identification**: All messages, components, and variables must be referenced by the message ID and key defined in the `.inlang` source.

### 2. Paraglide JS Implementation

- The output directory `apps/web/app/paraglide/` contains tree-shakeable message functions.
- These compiled assets are designed to be consumed via direct imports (e.g., `import * as m from "./paraglide/messages.js"`).
- **Markups**: Markup syntax (e.g., `{#b}text{/b}`) is controlled by the message definition, not the consuming component. When rendering in components, always use the dedicated framework adapter components (`<ParaglideMessage>`) where available to correctly render markup (bold, links, etc.).

### 3. Monorepo Practices

- **Dependency Management**: Use `pnpm` for package management and understand that `turbo.json` dictates the necessary build order between packages.
- **Readability**: When fixing or adding functionality, consider which package is responsible for the core logic versus which package simply consumes that logic.
