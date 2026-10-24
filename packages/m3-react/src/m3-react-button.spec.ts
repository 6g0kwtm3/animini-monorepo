import { print } from "@anitrove/unstyled"
import { expect, it } from "vitest"

import { button } from "./m3-react-button"

it("css size", () => {
	expect(print(button({})).length).toMatchInlineSnapshot(`3297`)
})

it("print", () => {
	expect(print(button({}))).toMatchInlineSnapshot(`
		"{
		  display: inline-flex;
		  align-items: center;
		  justify-content: center;
		  white-space: nowrap;
		  text-box: trim-both cap alphabetic;
		  background-image: linear-gradient(color-mix(in oklab, currentColor, transparent var(--state)), color-mix(in oklab, currentColor, transparent var(--state)));
		  &:hover {
		    --state: 92%;
		  }
		  &:focus-visible, &[data-focus-visible] {
		    --state: 90%;
		    &:hover {
		      --state: 90%;
		    }
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
		  ring-color: var(--color-outlined, rgb(var(--outline)));
		  &[aria-disabled="true"] {
		    ring-color: var(--color-outlined, rgb(var(--outline-variant) / 12%));
		  }
		  ring-inset: var(--color-outlined, inset);
		  ring: var(--size-xl, 3) var(--size-lg, 2) var(--size-md, var(--color-outlined, 1)) var(--size-sm, var(--color-outlined, 1)) var(--size-xs, var(--color-outlined, 1));
		  color: var(--color-outlined, rgb(var(--on-surface-variant))) var(--color-elevated, rgb(var(--primary))) var(--color-filled, rgb(var(--on-primary))) var(--color-text, rgb(var(--primary))) var(--color-tonal, rgb(var(--on-secondary-container)));
		  background-color: var(--color-elevated, rgb(var(--surface-container-low))) var(--color-filled, rgb(var(--primary))) var(--color-tonal, rgb(var(--secondary-container)));
		  height: var(--size-xs, 2rem) var(--size-sm, 2.5rem) var(--size-md, 3.5rem) var(--size-lg, 6rem) var(--size-xl, 8.5rem);
		  gap: var(--size-xs, .25rem) var(--size-sm, .5rem) var(--size-md, .5rem) var(--size-lg, .75rem) var(--size-xl, 1rem);
		  padding-inline: var(--size-xs, .75rem) var(--size-sm, 1rem) var(--size-md, 1.5rem) var(--size-lg, 3rem) var(--size-xl, 4rem);
		  font-size: var(--size-xs, 0.875rem) var(--size-sm, 0.875rem) var(--size-md, 1rem) var(--size-lg, 1.5rem) var(--size-xl, 2rem);
		  font-weight: var(--size-xs, 500) var(--size-sm, 500) var(--size-md, 500) var(--size-lg, 400) var(--size-xl, 400);
		  letter-spacing: var(--size-xs, 0.0071428571428571435rem) var(--size-sm, 0.0071428571428571435rem) var(--size-md, 0.009375rem) var(--size-lg, 0rem) var(--size-xl, 0rem);
		  line-height: var(--size-xs, 1.4285714285714286) var(--size-sm, 1.4285714285714286) var(--size-md, 1.5) var(--size-lg, 1.3333333333333333) var(--size-xl, 1.25);
		  border-radius: var(--shape-round, var(--size-xs, 1rem) var(--size-sm, 1.25rem) var(--size-md, 1.75rem) var(--size-lg, 3rem) var(--size-xl, 4.25rem)) var(--shape-square, var(--size-xs, .75rem) var(--size-sm, .75rem) var(--size-md, 1rem) var(--size-lg, 1.75rem) var(--size-xl, 1.75rem));
		  &:active, &[data-active] {
		    border-radius: var(--size-xs, .5rem) var(--size-sm, .5rem) var(--size-md, .75rem) var(--size-lg, 1rem) var(--size-xl, 1rem);
		  }
		  --color-elevated: var(--color,);
		  --color-filled: var(--color,);
		  --color-outlined: var(--color,);
		  --color-text: var(--color,);
		  --color-tonal: var(--color,);
		  --shape-round: var(--shape,);
		  --shape-square: var(--shape,);
		  --size-lg: var(--size,);
		  --size-md: var(--size,);
		  --size-sm: var(--size,);
		  --size-xl: var(--size,);
		  --size-xs: var(--size,);
		}"
	`)
})

it("vars", () => {
	expect(button({}).dynamicVars).toMatchInlineSnapshot(`
		{
		  "--color": "var(--color-filled)",
		  "--shape": "var(--shape-round)",
		  "--size": "var(--size-sm)",
		}
	`)
})
