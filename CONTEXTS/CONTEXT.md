# Domain Context: Remix PWA Monorepo

## Core Concepts

**PWA Builder** — The main application that enables users to build Progressive Web Apps with a no-code interface.

**Project** — A PWA blueprint created by the user, containing pages, navigation, settings, and other configuration.

**Template** — A pre-defined project structure that users can choose from when creating a new PWA.

**App** — The generated web application within a project.

**Preview** — Real-time preview of a project during editing.

**Publishing** — Exporting a project to various platforms (website hosting, app stores, etc.).

## Key Modules

- **Intake Module** — Handles project creation and template instantiation
- **Export Module** — Manages code generation for deployment targets
- **Validation Module** — Validates project configurations and constraints
- **Rendering Engine** — Core rendering and routing logic
- **Settings Module** — Manages project and user configuration
- **Preview Module** — Handles real-time preview functionality

## Key Library Modules

- **Network Module** — GraphQL client layer with rate limiting, retry logic, and abort handling
  - Location: `apps/web/app/lib/Network/`
  - Currently split across: `index.tsx`, `environment.tsx`, `RateLimiter.tsx`, `withRetry.ts`
  - Should be consolidated into a single deep module
- **Layout Module** — Shell component with navigation variants
  - Location: `apps/web/app/components/Layout.tsx`
  - Uses context pairs: `LayoutContext` and `LayoutNavigationContext`
  - Related files: `LayoutBody.tsx`, `LayoutPane.tsx`
- **Client Module** — Client initialization and Relay environment
  - Location: `packages/client/src/client.tsx`
  - Needs test coverage

## Common Patterns

- Projects are created from templates or imported configurations
- Validation happens before export to ensure consistency
- Rendering is separated from data concerns
- Export supports multiple target platforms (web, PWA stores)

## Architectural Friction Points Identified

1. **Network Layer Shallow Module**
   - Interface: `loadQuery`, `fetchQuery`, `commitMutation`, `environment`
   - Implementation spread across 4 files
   - Hidden coupling: `environment` depends on `RateLimiter` and `withRetry`

2. **Layout Context Chain**
   - Implicit dependencies through context names
   - Three context providers creating complexity
   - Consumer components must understand context hierarchy

3. **Client Package Untested**
   - Zero test coverage
   - Core network utilities depend on it
   - Single point of failure

## Glossary

**Module** — Anything with an interface and an implementation. Deliberately scale-agnostic — applies equally to a function, class, package, or slice.

**Interface** — Everything a caller must know to use the module correctly. Includes the type signature, but also invariants, ordering constraints, error modes, required configuration, and performance characteristics.

**Implementation** — What's inside a module — its body of code. Distinct from Adapter: a thing can be a small adapter with a large implementation.

**Depth** — Leverage at the interface — the amount of behaviour a caller can exercise per unit of interface. A module is deep when a large amount of behaviour sits behind a small interface.

**Shallow** — Interface is nearly as complex as the implementation.

**Seam** — A place where you can alter behaviour without editing in that place. The location at which a module's interface lives.

**Adapter** — A concrete thing that satisfies an interface at a seam.

**Leverage** — What callers get from depth. More capability per unit of interface.

**Locality** — What maintainers get from depth. Change, bugs, and knowledge concentrate at one place.
