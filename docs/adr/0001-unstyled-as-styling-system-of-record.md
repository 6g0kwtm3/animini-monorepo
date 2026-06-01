# `@anitrove/unstyled` is the styling system of record

Two styling adapters coexisted in the repo: `@anitrove/unstyled` (runtime `OutStyles` with `create` / `mergeStyles` / `Var` / `Box`) and `tailwind-variants` via `apps/web/app/lib/<x>.ts` wrappers. The two are not peers — `unstyled` returns runtime `{ dynamicVars, preCompiledStyles }` and supports container-query selectors via `is(var, value)`, while tv pre-computes class strings. Components drifted between the two with no shared contract.

We pick `unstyled` as the system of record across the whole monorepo. `tailwind-variants` and Tailwind itself are removed. The slot primitive is `create({ root: {...}, icon: {...} })` — slots are keys in the `create` record, consumed via sibling `<Box style={styles.root}>` elements. Layout utilities (flex, gap, padding, display, grid) are written inline as raw CSS properties via `precompileStyles({...})` — no helper layer between unstyled and the component.

## Consequences

- The `apps/web/app/lib/<x>.ts` tv-wrapper files are deleted as each consuming component migrates.
- `apps/web/app/lib/navigation.ts` (the Tailwind plugin defining `.navigation-bar` / `.navigation-rail` / `.navigation-drawer`) is reimplemented in unstyled before Tailwind can be removed from the build.
- Inline `className="flex items-center ..."` in routes and storybook stories migrates to `<Box style={precompileStyles({...})}>`.
- `design` stays tokens-only — no `design.utilities.flex()` / `gap()` / `display()` surface grows from this work. Token-aware helpers (`typescale`, `state`, `paddingX`) remain.
- m3-react needs no migration — it already consumes unstyled.

## Rejected alternatives

- **Coexist by layer** (tv for composites, unstyled for primitives): no shared contract, drift continues, two mental models per reader.
- **Grow `design.utilities`** to cover layout: extends the token package beyond its role; couples layout to the token tree's shape.
- **New `@anitrove/layout` package**: speculative seam — one consumer (apps/web), no second adapter justifying it.
- **Tailwind for layout, unstyled for tokens**: keeps both systems alive per component; defeats the point of unification.
