import { afterEach, describe, expect, it, vi } from "vitest"

import { numberToString } from "utilities"
import { cva } from "./unstyled-cva"
import { printRawStyles } from "./unstyled-print"
import { mapValue, type Value } from "./unstyled-value"

const states = { dragged: 0.16, focus: 0.1, hover: 0.08, none: 0, pressed: 0.1 }

const design = {
	state: (value: Value<keyof typeof states>) => {
		const stateColor = `color-mix(in oklab, currentColor, transparent var(--state))`

		return {
			"--state": mapValue(value, (value) => {
				const opacity = states[value]

				return `${numberToString(100 - opacity * 100)}%`
			}),
			backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
		}
	},
	tokens: {
		colors: {
			"surface-container-high": "rgb(var(--surface-container-high))",
			"surface-container-low": "rgb(var(--surface-container-low))",
		},
	},
}

const media = {
	active: "&:active, &[data-active]",
	disabled: '&:disabled, &[aria-disabled="true"]',
	"focus-visible": "&:focus-visible, &[data-focus-visible]",
	hover: "&:hover",
	motionSafe: "@media (prefers-reduced-motion: no-preference)",
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
					[media.active]: "pressed",
					[media.disabled]: "none",
					[media.hover]: "hover",
					[media["focus-visible"]]: { base: "focus", [media.hover]: "focus" },
				}),
			},
			defaultVariants: {},
			variants: {},
		})
		expect(printRawStyles).toHaveBeenCalledWith({
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
					blue: { backgroundColor: { base: "blue", [media.hover]: "black" } },
					red: { backgroundColor: "red" },
				},
			},
		})
		expect(printRawStyles).toHaveBeenCalledWith({
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
					blue: { backgroundColor: { [media.hover]: { "&:focus": "black" } } },
					red: { backgroundColor: "red" },
				},
			},
		})
		expect(printRawStyles).toHaveBeenCalledWith({
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
					bar: {
						backgroundColor: design.tokens.colors["surface-container-high"],
					},
					foo: {},
				},
			},
		})
		expect(printRawStyles).toHaveBeenCalledWith({
			"--color-bar": "var(--color,)",
			"--color-foo": "var(--color,)",
			backgroundColor:
				"var(--color-foo, rgb(var(--surface-container-low))) var(--color-bar, rgb(var(--surface-container-high)))",
		})
	})

	it("compoundVariant base", () => {
		cva({
			base: { borderRadius: "4rem" },
			compoundVariants: [
				{
					css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
					shape: ["round"],
					size: ["xs"],
				},
			],
			variants: {
				shape: { round: { borderRadius: "2rem" }, square: {} },
				size: { sm: {}, xs: {} },
			},
		})
		expect(printRawStyles).toHaveBeenCalledWith({
			"--shape-round": "var(--shape,)",
			"--shape-square": "var(--shape,)",
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
			borderRadius: {
				"&:active, &[data-active]":
					"var(--size-xs, var(--shape-round, .5rem) var(--shape-square, 4rem)) var(--size-sm, var(--shape-round, 2rem) var(--shape-square, 4rem))",
				base: "var(--size-xs, var(--shape-round, 1rem) var(--shape-square, 4rem)) var(--size-sm, var(--shape-round, 2rem) var(--shape-square, 4rem))",
			},
		})
	})

	it("compoundVariant last", () => {
		cva({
			base: {},
			compoundVariants: [
				{
					css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
					shape: ["round"],
					size: ["xs"],
				},
				{
					css: { borderRadius: { base: "2rem", [media.active]: "3rem" } },
					shape: ["round"],
					size: ["xs"],
				},
			],
			variants: { shape: { round: {}, square: {} }, size: { sm: {}, xs: {} } },
		})
		expect(printRawStyles).toHaveBeenCalledWith({
			"--shape-round": "var(--shape,)",
			"--shape-square": "var(--shape,)",
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
			borderRadius: {
				"&:active, &[data-active]": "var(--size-xs, var(--shape-round, 3rem))",
				base: "var(--size-xs, var(--shape-round, 2rem))",
			},
		})
	})
	it("defaultVariants", () => {
		cva({
			base: {},
			defaultVariants: { size: "xs" },
			variants: { size: { sm: {}, xs: {} } },
		})
		expect(printRawStyles).toHaveBeenCalledWith({
			"--size": "var(--size-xs)",
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
		})
	})

	it("variants", () => {
		cva({ base: {}, variants: { size: { sm: {}, xs: {} } } })
		expect(printRawStyles).toHaveBeenCalledWith({
			"--size-sm": "var(--size,)",
			"--size-xs": "var(--size,)",
		})
	})

	describe("compoundVariants compound variant", () => {
		it("compoundVariant not referencing all variants", () => {
			cva({
				base: {},
				compoundVariants: [
					{
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
						shape: ["round"],
					},
				],
				variants: {
					shape: { round: {}, square: {} },
					size: { sm: {}, xs: {} },
				},
			})
			expect(printRawStyles).toHaveBeenCalledWith({
				"--shape-round": "var(--shape,)",
				"--shape-square": "var(--shape,)",
				"--size-sm": "var(--size,)",
				"--size-xs": "var(--size,)",
				borderRadius: {
					"&:active, &[data-active]": "var(--shape-round, .5rem)",
					base: "var(--shape-round, 1rem)",
				},
			})
		})

		it("referencing all variants", () => {
			cva({
				base: {},
				compoundVariants: [
					{
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
						shape: ["round"],
						size: ["xs"],
					},
				],
				variants: {
					shape: { round: {}, square: {} },
					size: { sm: {}, xs: {} },
				},
			})
			expect(printRawStyles).toHaveBeenCalledWith({
				"--shape-round": "var(--shape,)",
				"--shape-square": "var(--shape,)",
				"--size-sm": "var(--size,)",
				"--size-xs": "var(--size,)",
				borderRadius: {
					"&:active, &[data-active]":
						"var(--size-xs, var(--shape-round, .5rem))",
					base: "var(--size-xs, var(--shape-round, 1rem))",
				},
			})
		})

		it("not relevant", () => {
			cva({
				base: {},
				compoundVariants: [
					{ css: { color: "red" }, width: ["sm"] },
					{
						css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
						height: ["sm"],
					},
				],
				variants: { height: { sm: {}, xs: {} }, width: { sm: {}, xs: {} } },
			})
			expect(printRawStyles).toHaveBeenCalledWith({
				"--height-sm": "var(--height,)",
				"--height-xs": "var(--height,)",
				"--width-sm": "var(--width,)",
				"--width-xs": "var(--width,)",
				borderRadius: {
					"&:active, &[data-active]": "var(--height-sm, .5rem)",
					base: "var(--height-sm, 1rem)",
				},
				color: "var(--width-sm, red)",
			})
		})
	})
})
