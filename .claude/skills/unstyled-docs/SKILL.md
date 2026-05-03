---
name: unstyled-docs
description: Document all public functions in @anitrove/unstyled with JSDoc comments. Use this skill whenever you need to add TypeScript/JSDoc documentation to functions exported from @anitrove/unstyled, its submodules (@anitrove/unstyled/cva, @anitrove/unstyled/box, @anitrove/unstyled/print), or when you want to generate comprehensive API documentation for the unstyled styling library.
compatibility: Typescript, React
---

# unstyled-docs

This skill generates comprehensive JSDoc documentation for all public functions exported from the `@anitrove/unstyled` package.

## What this skill does

When invoked, this skill will:

1. **Scan all source files** in `packages/unstyled/src/` to identify all public exports
2. **Analyze test files** to understand usage patterns and common use cases
3. **Review example files** in `apps/web/app/` to understand real-world usage
4. **Generate JSDoc comments** for each public function with:
   - Detailed descriptions
   - Parameter documentation
   - Return type documentation
   - Usage examples from tests
   - Related function cross-references

## When to use this skill

Use this skill when you need to:

- Add or improve JSDoc documentation for `@anitrove/unstyled` public APIs
- Document new functions added to the `unstyled` package
- Generate API documentation before releasing a new version
- Create inline documentation for TypeScript function declarations
- Document type definitions and interfaces

## Package structure

The `@anitrove/unstyled` package exports the following public functions:

### Core functions (from `@anitrove/unstyled`)

| Function           | File                | Description                                                                              |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------- |
| `cva`              | `unstyled-cva.ts`   | Defines component variant (cva) style objects with base, variants, and compound variants |
| `defineCva`        | `unstyled-cva.ts`   | Identity function for cva objects with type safety                                       |
| `applyProps`       | `unstyled-cva.ts`   | Applies component variant props to generate styles                                       |
| `precompileStyles` | `unstyled-print.ts` | Compiles raw styles into PreCompiledStyles                                               |
| `print`            | `unstyled-print.ts` | Converts PreCompiledStyles to CSS string                                                 |
| `mergeStyles`      | `unstyled-print.ts` | Merges multiple PreCompiledStyles objects                                                |
| `mapValue`         | `unstyled-value.ts` | Applies a transformation function to Value types                                         |
| `mergeValues`      | `unstyled-cva.ts`   | Merges two Value objects (internal)                                                      |

### Box component (from `@anitrove/unstyled/box`)

| Function/Component | File               | Description                                        |
| ------------------ | ------------------ | -------------------------------------------------- |
| `Box`              | `unstyled-box.tsx` | A styled box component using @ariakit/react's Role |

### Utility functions (from `@anitrove/unstyled/use-styles`)

| Function    | File                      | Description                                                     |
| ----------- | ------------------------- | --------------------------------------------------------------- |
| `useStyles` | `unstyled-use-styles.tsx` | React hook that generates style classes for unstyled components |

### Types (exported with the package)

- `PreCompiledStyles` - Compiled styles object
- `RawStyles` - Raw styles input type
- `Cva` - CVA definition interface
- `CvaProps` - CVA props type
- `Properties` - CSS properties type
- `Value` - Value type with media queries support
- `Theme` - Theme type alias (exported from theme package)

## Documentation approach

For each public function, the generated JSDoc will include:

### 1. @description

A clear, concise description of what the function does.

### 2. @param

Documentation for each parameter with:

- Parameter name
- Type
- Description of purpose
- Whether it's required or optional
- Usage examples from tests

### 3. @returns

Documentation for the return value:

- Return type
- Description
- Example output (for functions that return strings/objects)

### 4. @typeParam

Documentation for generic type parameters when applicable.

### 5. @example

Real examples extracted from:

- Test files in `packages/unstyled/src/**/*.spec.ts`
- Usage examples in `apps/web/app/**/*.tsx`
- Benchmark files if available

**IMPORTANT**: When including an `@example` block, do NOT use Markdown code block tags (e.g., \`\`\`ts). Instead, use plain text with comments for explanations.

Example format:

- @example
- // Merging two simple values
- const merged = mergeValues("red", "blue");
- // Returns: "red blue"

## JSDoc templates

### For function declarations

```typescript
/**
 * {@desc}
 *
 * {@example1}
 *
 * {@example2}
 *
 * {@example3}
 */
export function functionName(params): returnType {
	// implementation
}
```

### For type definitions

```typescript
/**
 * {@description}
 */
export interface TypeName {
	// fields
}
```

## How this skill works

1. **Identify all public exports** by scanning the source files
2. **Read test files** to understand usage patterns
3. **Read usage examples** from apps/web to see real-world usage
4. **Generate JSDoc** for each function using a template
5. **Output** can be written to individual source files or consolidated

## Output format

The skill can output JSDoc in two ways:

1. **Inline** - Write JSDoc comments directly in the source files
2. **External docs** - Generate a separate documentation file

## Example usage

After running this skill, the generated documentation will look like:

```typescript
/**
 * Defines a component variant (cva) style object with base styles,
 * variants, and optional compound variants.
 *
 * This function allows you to define flexible styling systems that support
 * different states, sizes, colors, and other component variants through
 * a composable pattern.
 *
 * @template Variants - The variants object mapping variant names to their styles
 *
 * @param cva - The cva definition object containing:
 * - `base`: Base styles applied to all variants
 * - `variants`: Object mapping variant names to their style options
 * - `defaultVariants`: Default values for variant properties (optional)
 * - `compoundVariants`: Additional styles applied when specific variant
 *   combinations are used (optional)
 *
 * @returns An object with `style` and `variants` properties:
 * - `style`: PreCompiledStyles object containing the compiled base styles
 * - `variants`: Function to apply variant props and merge with base
 *
 * @example Base styles with no variants
 * const styles = cva({
 *   base: {
 *     backgroundColor: "blue",
 *     borderRadius: "4rem",
 *   },
 *   variants: {},
 * });
 *
 * // style.style contains the base styles
 * // styles.variants() returns an empty variants object
 *
 * @example CVA with variants
 * const styles = cva({
 *   base: {
 *     display: "inline-block",
 *     padding: ".25rem",
 *   },
 *   variants: {
 *     size: {
 *       xs: { fontSize: "1rem" },
 *       sm: { fontSize: "1.25rem" },
 *     },
 *   },
 * });
 *
 * // Apply a variant
 * const appliedStyles = styles.variants({ size: "sm" });
 *
 * @example CVA with compound variants
 * const styles = cva({
 *   base: {
 *     padding: ".5rem",
 *   },
 *   variants: {
 *     size: { xs: {}, sm: {} },
 *     shape: { round: {}, square: {} },
 *   },
 *   compoundVariants: [
 *     {
 *       size: ["xs"],
 *       shape: ["round"],
 *       css: { borderRadius: ".25rem" },
 *     },
 *   ],
 * });
 */
export function cva<Variants extends ...>(cva: Cva<Variants>): ...
```
