# unstyled-docs Skill

This skill generates comprehensive JSDoc documentation for all public functions in the `@anitrove/unstyled` package.

## What it does

When invoked, this skill:

1. Scans all source files in `packages/unstyled/src/` to identify public exports
2. Analyzes test files in `packages/unstyled/src/**/*.spec.ts` to understand usage patterns
3. Reviews example files in `apps/web/app/` to understand real-world usage
4. Generates JSDoc comments for each public function including:
   - Detailed descriptions
   - Parameter documentation
   - Return type documentation
   - Usage examples from tests
   - Related function cross-references

## Package Functions Documented

### Core Functions (from `@anitrove/unstyled`)

- `cva` - Defines component variant style objects with base, variants, and compound variants
- `defineCva` - Identity function for cva objects with type safety
- `applyProps` - Applies component variant props to generate styles
- `precompileStyles` - Compiles raw styles into PreCompiledStyles
- `print` - Converts PreCompiledStyles to CSS string
- `mergeStyles` - Merges multiple PreCompiledStyles objects
- `mapValue` - Applies transformation function to Value types
- `mergeValues` - Merges two Value objects (internal)

### Box Component (from `@anitrove/unstyled/box`)

- `Box` - A styled box component using @ariakit/react's Role

### Utility Functions (from `@anitrove/unstyled/use-styles`)

- `useStyles` - React hook that generates style classes for unstyled components

## Usage

Simply ask the skill:

```
Generate JSDoc for the cva function
```

or

```
Document all public functions in @anitrove/unstyled
```

The skill will generate appropriate JSDoc comments for the requested functions.

## Example Outputs

After using the skill, you'll get JSDoc like this:

````typescript
/**
 * Defines a component variant (cva) style object with base styles,
 * variants, and optional compound variants.
 *
 * This function allows you to define flexible styling systems that support
 * different states, sizes, colors, and other component variants through
 * a composable pattern. The cva pattern enables creating styles that can
 * be applied conditionally based on props while maintaining type safety.
 *
 * @template Variants - The variants object mapping variant names to their styles
 *
 * @param cva - The cva definition object containing:
 * - `base`: Base styles applied to all variants (RawStyles)
 * - `variants`: Object mapping variant names to their style options
 * - `defaultVariants`: Default values for variant properties (optional)
 * - `compoundVariants`: Additional styles for specific variant combinations (optional)
 *
 * @returns An object with `style` and `variants` properties
 *
 * @example Base styles with no variants
 * ```ts
 * const styles = cva({
 *   base: { backgroundColor: "blue" },
 *   variants: {},
 * });
 * ```
 *
 * @example CVA with variants
 * ```ts
 * const styles = cva({
 *   base: { display: "inline-block" },
 *   variants: {
 *     size: { xs: { fontSize: "1rem" }, sm: { fontSize: "1.25rem" } },
 *   },
 * });
 * ```
 */
````

## Related Files

- `packages/unstyled/src/unstyled-cva.ts`
- `packages/unstyled/src/unstyled-print.ts`
- `packages/unstyled/src/unstyled-value.ts`
- `packages/unstyled/src/unstyled-use-styles.tsx`
- `packages/unstyled/src/unstyled-box.tsx`

## Test Files

- `packages/unstyled/src/unstyled-cva.spec.ts`

## Usage Examples in apps/web

- `apps/web/app/components/Badge.tsx`
- `apps/web/app/components/Layout.tsx`
- `apps/web/app/components/List.tsx`
- `apps/web/app/lib/theme/index.tsx`
- `apps/web/app/routes/*/*.tsx`
