import { print } from "@anitrove/unstyled"
import { describe, expect, it } from "vitest"
import { button } from "./m3-react-button"

describe("button", () => {
	it("css size", () => {
		expect(print(button).length).toMatchInlineSnapshot(`3581`)
	})

	it("print", () => {
		expect(print(button)).toMatchInlineSnapshot(`
			"{
			  display: inline-flex;
			  align-items: center;
			  justify-content: center;
			  white-space: nowrap;
			  text-box: trim-both cap alphabetic;
			  font-size: var(--size-xs, 0.875rem) var(--size-sm, 0.875rem) var(--size-md, 1rem) var(--size-lg, 1.5rem) var(--size-xl, 2rem);
			  font-weight: var(--size-xs, 500) var(--size-sm, 500) var(--size-md, 500) var(--size-lg, 400) var(--size-xl, 400);
			  letter-spacing: var(--size-xs, 0.0071428571428571435rem) var(--size-sm, 0.0071428571428571435rem) var(--size-md, 0.009375rem) var(--size-lg, 0rem) var(--size-xl, 0rem);
			  line-height: var(--size-xs, 1.4285714285714286) var(--size-sm, 1.4285714285714286) var(--size-md, 1.5) var(--size-lg, 1.3333333333333333) var(--size-xl, 1.25);
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
			  --color: var(--color-filled);
			  --size: var(--size-sm);
			  --shape: var(--shape-round);
			  --color-outlined: var(--color,);
			  --color-elevated: var(--color,);
			  --color-filled: var(--color,);
			  --color-text: var(--color,);
			  --color-tonal: var(--color,);
			  ring-color: var(--color-outlined, rgb(var(--outline)));
			  &[aria-disabled="true"] {
			    ring-color: var(--color-outlined, rgb(var(--outline-variant) / 12%));
			  }
			  ring-inset: var(--color-outlined, inset);
			  ring: var(--size-lg, 2) var(--size-xl, 3);
			  color: var(--color-outlined, rgb(var(--on-surface-variant))) var(--color-elevated, rgb(var(--primary))) var(--color-filled, rgb(var(--on-primary))) var(--color-text, rgb(var(--primary))) var(--color-tonal, rgb(var(--on-secondary-container)));
			  background-color: var(--color-elevated, rgb(var(--surface-container-low))) var(--color-filled, rgb(var(--primary))) var(--color-tonal, rgb(var(--secondary-container)));
			  --size-xs: var(--size,);
			  --size-sm: var(--size,);
			  --size-md: var(--size,);
			  --size-lg: var(--size,);
			  --size-xl: var(--size,);
			  height: var(--size-xs, 2rem) var(--size-sm, 2.5rem) var(--size-md, 3.5rem) var(--size-lg, 6rem) var(--size-xl, 8.5rem);
			  gap: var(--size-xs, .25rem) var(--size-sm, .5rem) var(--size-md, .5rem) var(--size-lg, .75rem) var(--size-xl, 1rem);
			  padding-inline: var(--size-xs, .75rem) var(--size-sm, 1rem) var(--size-md, 1.5rem) var(--size-lg, 3rem) var(--size-xl, 4rem);
			  --shape-round: var(--shape,);
			  --shape-square: var(--shape,);
			  border-radius: var(--size-xs, var(--shape-round, 1rem) var(--shape-square, .75rem)) var(--size-sm, var(--shape-round, 1.25rem) var(--shape-square, .75rem)) var(--size-md, var(--shape-round, 1.75rem) var(--shape-square, 1rem)) var(--size-lg, var(--shape-round, 3rem) var(--shape-square, 1.75rem)) var(--size-xl, var(--shape-round, 4.25rem) var(--shape-square, 1.75rem));
			  &:active, &[data-active] {
			    border-radius: var(--size-xs, var(--shape-round, .5rem) var(--shape-square, .5rem)) var(--size-sm, var(--shape-round, .5rem) var(--shape-square, .5rem)) var(--size-md, var(--shape-round, .75rem) var(--shape-square, .75rem)) var(--size-lg, var(--shape-round, 1rem) var(--shape-square, 1rem)) var(--size-xl, var(--shape-round, 1rem) var(--shape-square, 1rem));
			  }
			}"
		`)
	})
})
