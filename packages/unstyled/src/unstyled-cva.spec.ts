import { afterEach, describe, expect, it, vi } from "vitest"

import { numberToString } from "utilities"
import { cva } from "./unstyled-cva"
import { precompileStyles } from "./unstyled-print"
import { mapValue, type Value } from "./unstyled-value"

const states = { none: 0, hover: 0.08, focus: 0.1, pressed: 0.1, dragged: 0.16 }

const design = {
	state: (value: Value<keyof typeof states>) => {
		const stateColor = `color-mix(in oklab, currentColor, transparent var(--state))`

		return {
			backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
			"--state": mapValue(value, (value) => {
				const opacity = states[value]

				return `${numberToString(100 - opacity * 100)}%`
			}),
		}
	},
	tokens: {
		colors: {
			"surface-container-low": "rgb(var(--surface-container-low))",
			"surface-container-high": "rgb(var(--surface-container-high))",
		},
	},
}

const media = {
	active: "&:active, &[data-active]",
	hover: "&:hover",
	motionSafe: "@media (prefers-reduced-motion: no-preference)",
	"focus-visible": "&:focus-visible, &[data-focus-visible]",
	disabled: '&:disabled, &[aria-disabled="true"]',
}

vi.mock(import("./unstyled-print"), { spy: true })

describe("cva", () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	it("base", () => {
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
		expect(precompileStyles).toHaveBeenCalledWith({
			"--state": {
				"&:active, &[data-active]": "90%",
				'&:disabled, &[aria-disabled="true"]': "100%",
				"&:focus-visible, &[data-focus-visible]": {
					"&:hover": "90%",
					base: "90%",
				},
				"&:hover": "92%",
			},
			backgroundImage:
				"linear-gradient(color-mix(in oklab, currentColor, transparent var(--state)), color-mix(in oklab, currentColor, transparent var(--state)))",
		})
	})

	it("variants with media", () => {
		cva({
			base: {},
			variants: {
				color: {
					red: { backgroundColor: "red" },
					blue: { backgroundColor: { base: "blue", [media.hover]: "black" } },
				},
			},
		})
		expect(precompileStyles).toHaveBeenCalledWith({
			"--color-blue": "var(--color,)",
			"--color-red": "var(--color,)",
			backgroundColor: {
				base: `var(--color-red, red) var(--color-blue, blue)`,
				[media.hover]: `var(--color-red, red) var(--color-blue, black)`,
			},
		})
	})

	it("variants with media no base", () => {
		cva({
			base: {},
			variants: {
				color: {
					red: { backgroundColor: "red" },
					blue: { backgroundColor: { [media.hover]: { "&:focus": "black" } } },
				},
			},
		})
		expect(precompileStyles).toHaveBeenCalledWith({
			"--color-blue": "var(--color,)",
			"--color-red": "var(--color,)",
			backgroundColor: {
				base: `var(--color-red, red)`,
				[media.hover]: {
					["&:focus"]: `var(--color-red, red) var(--color-blue, black)`,
				},
			},
		})
	})

	it("base", () => {
		cva({
			base: { backgroundColor: design.tokens.colors["surface-container-low"] },
			variants: {
				color: {
					foo: {},
					bar: {
						backgroundColor: design.tokens.colors["surface-container-high"],
					},
				},
			},
		})
		expect(precompileStyles).toHaveBeenCalledWith({
			"--color-bar": "var(--color,)",
			"--color-foo": "var(--color,)",
			backgroundColor:
				"var(--color-foo, rgb(var(--surface-container-low))) var(--color-bar, rgb(var(--surface-container-high)))",
		})
	})

	it("compoundVariant base", () => {
		cva({
			base: { borderRadius: "4rem" },
			variants: {
				size: { xs: {}, sm: {} },
				shape: { round: { borderRadius: "2rem" }, square: {} },
			},
			compoundVariants: [
				{
					size: ["xs"],
					shape: ["round"],
					css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
				},
			],
		})
		expect(precompileStyles).toHaveBeenCalledWith({
			"--shape-round": "var(--shape,)",
			"--shape-square": "var(--shape,)",
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
			borderRadius: {
				base: "var(--size-xs, var(--shape-round, 1rem) var(--shape-square, 4rem)) var(--size-sm, var(--shape-round, 2rem) var(--shape-square, 4rem))",
				"&:active, &[data-active]":
					"var(--size-xs, var(--shape-round, .5rem) var(--shape-square, 4rem)) var(--size-sm, var(--shape-round, 2rem) var(--shape-square, 4rem))",
			},
		})
	})

	it("compoundVariant last", () => {
		cva({
			base: {},
			variants: { size: { xs: {}, sm: {} }, shape: { round: {}, square: {} } },
			compoundVariants: [
				{
					size: ["xs"],
					shape: ["round"],
					css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
				},
				{
					size: ["xs"],
					shape: ["round"],
					css: { borderRadius: { base: "2rem", [media.active]: "3rem" } },
				},
			],
		})
		expect(precompileStyles).toHaveBeenCalledWith({
			"--shape-round": "var(--shape,)",
			"--shape-square": "var(--shape,)",
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
			borderRadius: {
				base: "var(--size-xs, var(--shape-round, 2rem))",
				"&:active, &[data-active]": "var(--size-xs, var(--shape-round, 3rem))",
			},
		})
	})
	it("defaultVariants", () => {
		cva({
			base: {},
			variants: { size: { xs: {}, sm: {} } },
			defaultVariants: { size: "xs" },
		})
		expect(precompileStyles).toHaveBeenCalledWith({
			"--size": "var(--size-xs)",
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
		})
	})

	it("variants", () => {
		cva({ base: {}, variants: { size: { xs: {}, sm: {} } } })
		expect(precompileStyles).toHaveBeenCalledWith({
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
		})
	})

	describe("compoundVariants compound variant", () => {
		it("compoundVariant not referencing all variants", () => {
			cva({
				base: {},
				variants: {
					size: { xs: {}, sm: {} },
					shape: { round: {}, square: {} },
				},
				compoundVariants: [
					{
						shape: ["round"],
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
					},
				],
			})
			expect(precompileStyles).toHaveBeenCalledWith({
				"--shape-round": "var(--shape,)",
				"--shape-square": "var(--shape,)",
				"--size-sm": "var(--size,)",
				"--size-xs": "var(--size,)",
				borderRadius: {
					base: "var(--shape-round, 1rem)",
					"&:active, &[data-active]": "var(--shape-round, .5rem)",
				},
			})
		})

		it("referencing all variants", () => {
			cva({
				base: {},
				variants: {
					size: { xs: {}, sm: {} },
					shape: { round: {}, square: {} },
				},
				compoundVariants: [
					{
						size: ["xs"],
						shape: ["round"],
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
					},
				],
			})
			expect(precompileStyles).toHaveBeenCalledWith({
				"--shape-round": "var(--shape,)",
				"--shape-square": "var(--shape,)",
				"--size-sm": "var(--size,)",
				"--size-xs": "var(--size,)",
				borderRadius: {
					base: "var(--size-xs, var(--shape-round, 1rem))",
					"&:active, &[data-active]":
						"var(--size-xs, var(--shape-round, .5rem))",
				},
			})
		})

		it("not relevant", () => {
			cva({
				base: {},
				variants: { width: { xs: {}, sm: {} }, height: { xs: {}, sm: {} } },
				compoundVariants: [
					{ width: ["sm"], css: { color: "red" } },
					{
						height: ["sm"],
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
					},
				],
			})
			expect(precompileStyles).toHaveBeenCalledWith({
				"--height-sm": "var(--height,)",
				"--height-xs": "var(--height,)",
				"--width-sm": "var(--width,)",
				"--width-xs": "var(--width,)",
				borderRadius: {
					base: "var(--height-sm, 1rem)",
					"&:active, &[data-active]": "var(--height-sm, .5rem)",
				},
				color: "var(--width-sm, red)",
			})
		})
	})
})
