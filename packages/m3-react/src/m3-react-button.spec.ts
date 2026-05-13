import { print } from "@anitrove/unstyled"
import { expect, it } from "vitest"
import { button } from "./m3-react-button"

it("css size", () => {
	expect(print(button({})).length).toMatchInlineSnapshot(`4798`)
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
		  @container style(--color: outlined) {
		    ring-color: rgb(var(--outline));
		    &[aria-disabled="true"] {
		      ring-color: rgb(var(--outline-variant) / 12%);
		    }
		  }
		  @container style(--color: outlined) {
		    ring-inset: inset;
		  }
		  @container style(--color: outlined) {
		    ring: 1;
		  }
		  @container style(--size: lg) {
		    ring: 2;
		  }
		  @container style(--size: xl) {
		    ring: 3;
		  }
		  @container style(--color: outlined) {
		    color: rgb(var(--on-surface-variant));
		  }
		  @container style(--color: elevated) {
		    color: rgb(var(--primary));
		  }
		  @container style(--color: filled) {
		    color: rgb(var(--on-primary));
		  }
		  @container style(--color: text) {
		    color: rgb(var(--primary));
		  }
		  @container style(--color: tonal) {
		    color: rgb(var(--on-secondary-container));
		  }
		  @container style(--color: elevated) {
		    background-color: rgb(var(--surface-container-low));
		  }
		  @container style(--color: filled) {
		    background-color: rgb(var(--primary));
		  }
		  @container style(--color: tonal) {
		    background-color: rgb(var(--secondary-container));
		  }
		  @container style(--size: xs) {
		    height: 2rem;
		  }
		  @container style(--size: sm) {
		    height: 2.5rem;
		  }
		  @container style(--size: md) {
		    height: 3.5rem;
		  }
		  @container style(--size: lg) {
		    height: 6rem;
		  }
		  @container style(--size: xl) {
		    height: 8.5rem;
		  }
		  @container style(--size: xs) {
		    gap: .25rem;
		  }
		  @container style(--size: sm) {
		    gap: .5rem;
		  }
		  @container style(--size: md) {
		    gap: .5rem;
		  }
		  @container style(--size: lg) {
		    gap: .75rem;
		  }
		  @container style(--size: xl) {
		    gap: 1rem;
		  }
		  @container style(--size: xs) {
		    padding-inline: .75rem;
		  }
		  @container style(--size: sm) {
		    padding-inline: 1rem;
		  }
		  @container style(--size: md) {
		    padding-inline: 1.5rem;
		  }
		  @container style(--size: lg) {
		    padding-inline: 3rem;
		  }
		  @container style(--size: xl) {
		    padding-inline: 4rem;
		  }
		  font-size: 0.875rem;
		  @container style(--size: md) {
		    font-size: 1rem;
		  }
		  @container style(--size: lg) {
		    font-size: 1.5rem;
		  }
		  @container style(--size: xl) {
		    font-size: 2rem;
		  }
		  font-weight: 500;
		  @container style(--size: md) {
		    font-weight: 500;
		  }
		  @container style(--size: lg) {
		    font-weight: 400;
		  }
		  @container style(--size: xl) {
		    font-weight: 400;
		  }
		  letter-spacing: 0.0071428571428571435rem;
		  @container style(--size: md) {
		    letter-spacing: 0.009375rem;
		  }
		  @container style(--size: lg) {
		    letter-spacing: 0rem;
		  }
		  @container style(--size: xl) {
		    letter-spacing: 0rem;
		  }
		  line-height: 1.4285714285714286;
		  @container style(--size: md) {
		    line-height: 1.5;
		  }
		  @container style(--size: lg) {
		    line-height: 1.3333333333333333;
		  }
		  @container style(--size: xl) {
		    line-height: 1.25;
		  }
		  @container style(--shape: round) {
		    @container style(--size: xs) {
		      border-radius: 1rem;
		      &:active, &[data-active] {
		        border-radius: .5rem;
		      }
		    }
		    @container style(--size: sm) {
		      border-radius: 1.25rem;
		      &:active, &[data-active] {
		        border-radius: .5rem;
		      }
		    }
		    @container style(--size: md) {
		      border-radius: 1.75rem;
		      &:active, &[data-active] {
		        border-radius: .75rem;
		      }
		    }
		    @container style(--size: lg) {
		      border-radius: 3rem;
		      &:active, &[data-active] {
		        border-radius: 1rem;
		      }
		    }
		    @container style(--size: xl) {
		      border-radius: 4.25rem;
		      &:active, &[data-active] {
		        border-radius: 1rem;
		      }
		    }
		  }
		  @container style(--shape: square) {
		    @container style(--size: xs) or style(--size: sm) {
		      border-radius: .75rem;
		      &:active, &[data-active] {
		        border-radius: .5rem;
		      }
		    }
		    @container style(--size: md) {
		      border-radius: 1rem;
		      &:active, &[data-active] {
		        border-radius: .75rem;
		      }
		    }
		    @container style(--size: lg) or style(--size: xl) {
		      border-radius: 1.75rem;
		      &:active, &[data-active] {
		        border-radius: 1rem;
		      }
		    }
		  }
		}"
	`)
})

it("vars", () => {
	expect(button({}).dynamicVars).toMatchInlineSnapshot(`
		{
		  "--color": "filled",
		  "--shape": "round",
		  "--size": "sm",
		}
	`)
})
