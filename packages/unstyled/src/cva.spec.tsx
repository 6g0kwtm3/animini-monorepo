import { describe, expect, it } from "vitest"
import { button } from "./button"
import { cva, print } from "./cva"

import * as design from "./design"
import { media } from "./design"

describe("cva", () => {
	it("button size", () => {
		expect(JSON.stringify(button).length).toMatchInlineSnapshot(`3377`)
	})

	it("base", () => {
		expect(
			cva({
				base: {
					...design.state({
						[media.hover]: "hover",
						[media["focus-visible"]]: { base: "focus", [media.hover]: "focus" },
						[media.active]: "pressed",
						[media.disabled]: "none",
					}),
				},
				variants: {},
				defaultVariants: {},
			})
		).toMatchInlineSnapshot(`
			{
			  "--state": {
			    "&:active, &[data-active]": "90%",
			    "&:disabled, &[aria-disabled="true"]": "100%",
			    "&:focus-visible, &[data-focus-visible]": {
			      "&:hover": "90%",
			      "base": "90%",
			    },
			    "&:hover": "92%",
			  },
			  "backgroundImage": "linear-gradient(color-mix(in oklab, currentColor, transparent var(--state)), color-mix(in oklab, currentColor, transparent var(--state)))",
			}
		`)
	})

	it("compoundVariant", () => {
		expect(
			cva({
				base: {},
				variants: {
					size: { xs: {}, sm: {}, md: {}, lg: {}, xl: {} },
					shape: { round: {}, square: {} },
				},
				compoundVariants: [
					{
						size: ["xs"],
						shape: ["round"],
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
					},
					{
						size: ["sm"],
						shape: ["round"],
						css: { borderRadius: { base: "1.25rem", [media.active]: ".5rem" } },
					},
					{
						size: ["md"],
						shape: ["round"],
						css: {
							borderRadius: { base: "1.75rem", [media.active]: ".75rem" },
						},
					},
					{
						size: ["lg"],
						shape: ["round"],
						css: { borderRadius: { base: "3rem", [media.active]: "1rem" } },
					},
					{
						size: ["xl"],
						shape: ["round"],
						css: { borderRadius: { base: "4.25rem", [media.active]: "1rem" } },
					},
					{
						size: ["xs", "sm"],
						shape: ["square"],
						css: { borderRadius: { base: ".75rem", [media.active]: ".5rem" } },
					},
					{
						size: ["md"],
						shape: ["square"],
						css: {
							borderRadius: {
								base: design.tokens.borderRadius.lg,
								[media.active]: ".75rem",
							},
						},
					},
					{
						size: ["lg", "xl"],
						shape: ["square"],
						css: {
							borderRadius: {
								base: design.tokens.borderRadius.xl,
								[media.active]: "1rem",
							},
						},
					},
				],
			})
		).toMatchInlineSnapshot(`
			{
			  "--shape-round": "var(--shape,)",
			  "--shape-square": "var(--shape,)",
			  "--size-lg": "var(--size,)",
			  "--size-md": "var(--size,)",
			  "--size-sm": "var(--size,)",
			  "--size-xl": "var(--size,)",
			  "--size-xs": "var(--size,)",
			  "borderRadius": {
			    "&:active, &[data-active]": "var(--shape-round, var(--size-xs, .5rem)) var(--shape-round, var(--size-sm, .5rem)) var(--shape-round, var(--size-md, .75rem)) var(--shape-round, var(--size-lg, 1rem)) var(--shape-round, var(--size-xl, 1rem)) var(--shape-square, var(--size-xs, .5rem) var(--size-sm, .5rem)) var(--shape-square, var(--size-md, .75rem)) var(--shape-square, var(--size-lg, 1rem) var(--size-xl, 1rem))",
			    "base": " var(--shape-round, var(--size-xs, 1rem)) var(--shape-round, var(--size-sm, 1.25rem)) var(--shape-round, var(--size-md, 1.75rem)) var(--shape-round, var(--size-lg, 3rem)) var(--shape-round, var(--size-xl, 4.25rem)) var(--shape-square, var(--size-xs, .75rem) var(--size-sm, .75rem)) var(--shape-square, var(--size-md, 1rem)) var(--shape-square, var(--size-lg, 1.75rem) var(--size-xl, 1.75rem))",
			  },
			}
		`)
	})

	it("css", () => {
		expect(print(button)).toMatchInlineSnapshot(`
			"{
			  display: inline-flex;
			  align-items: center;
			  justify-content: center;
			  white-space: nowrap;
			  text-box: trim-both cap alphabetic;
			  font-size: 0.875rem var(--size-md, 1rem) var(--size-lg, 1.5rem) var(--size-xl, 2rem);
			  font-weight: var(--size-md, 500) var(--size-lg, 400) var(--size-xl, 400);
			  letter-spacing: 0.0071428571428571435rem var(--size-md, 0.009375rem) var(--size-lg, 0rem) var(--size-xl, 0rem);
			  line-height: var(--size-md, 1.5) var(--size-lg, 1.3333333333333333) var(--size-xl, 1.25);
			  background-image: linear-gradient(color-mix(in oklab, currentColor, transparent var(--state)), color-mix(in oklab, currentColor, transparent var(--state)));
			  &:hover {
			    --state: 92%;
			  }
			  &:focus-visible, &[data-focus-visible] {
			    &:hover {
			      --state: 90%;
			    }
			    --state: 90%;
			  }
			  &:active, &[data-active] {
			    --state: 90%;
			  }
			  &:disabled, &[aria-disabled="true"] {
			    --state: 100%;
			  }
			  @media (prefers-reduced-motion: no-preference) {
			    transition-property: border-radius;
			  }
			  transition-timing-function: cubic-bezier(0.42, 1.67, 0.21, 0.9);
			  transition-duration: 350ms;
			  --color: var(--color-filled);
			  --size: var(--size-sm);
			  --shape: var(--shape-round);
			  --color-outlined: var(--color,);
			  &[aria-disabled="true"] {
			    ring-color: var(--color-outlined, rgb(var(--outline-variant) / 12%));
			  }
			  ring-color:  var(--color-outlined, rgb(var(--outline)));
			  ring-inset:  var(--color-outlined, inset);
			  ring:  var(--color-outlined, 1) var(--size-lg, 2) var(--size-xl, 3);
			  color:  var(--color-outlined, rgb(var(--on-surface-variant))) var(--color-elevated, rgb(var(--primary))) var(--color-filled, rgb(var(--on-primary))) var(--color-text, rgb(var(--primary))) var(--color-tonal, rgb(var(--on-secondary-container)));
			  --color-elevated: var(--color,);
			  background-color:  var(--color-elevated, rgb(var(--surface-container-low))) var(--color-filled, rgb(var(--primary))) var(--color-tonal, rgb(var(--secondary-container)));
			  --color-filled: var(--color,);
			  --color-text: var(--color,);
			  --color-tonal: var(--color,);
			  --size-xs: var(--size,);
			  height:  var(--size-xs, 2rem) var(--size-sm, 2.5rem) var(--size-md, 3.5rem) var(--size-lg, 6rem) var(--size-xl, 8.5rem);
			  gap:  var(--size-xs, .25rem) var(--size-sm, .5rem) var(--size-md, .5rem) var(--size-lg, .75rem) var(--size-xl, 1rem);
			  padding-inline:  var(--size-xs, .75rem) var(--size-sm, 1rem) var(--size-md, 1.5rem) var(--size-lg, 3rem) var(--size-xl, 4rem);
			  --size-sm: var(--size,);
			  --size-md: var(--size,);
			  --size-lg: var(--size,);
			  --size-xl: var(--size,);
			  --shape-round: var(--shape,);
			  --shape-square: var(--shape,);
			  &:active, &[data-active] {
			    border-radius: var(--shape-round, var(--size-xs, .5rem)) var(--shape-round, var(--size-sm, .5rem)) var(--shape-round, var(--size-md, .75rem)) var(--shape-round, var(--size-lg, 1rem)) var(--shape-round, var(--size-xl, 1rem)) var(--shape-square, var(--size-xs, .5rem) var(--size-sm, .5rem)) var(--shape-square, var(--size-md, .75rem)) var(--shape-square, var(--size-lg, 1rem) var(--size-xl, 1rem));
			  }
			  border-radius:  var(--shape-round, var(--size-xs, 1rem)) var(--shape-round, var(--size-sm, 1.25rem)) var(--shape-round, var(--size-md, 1.75rem)) var(--shape-round, var(--size-lg, 3rem)) var(--shape-round, var(--size-xl, 4.25rem)) var(--shape-square, var(--size-xs, .75rem) var(--size-sm, .75rem)) var(--shape-square, var(--size-md, 1rem)) var(--shape-square, var(--size-lg, 1.75rem) var(--size-xl, 1.75rem));
			}"
		`)
	})
})
