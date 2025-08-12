import { bench, describe } from "vitest"
import { cva } from "./unstyled-cva"

describe("cva", () => {
	bench("empty", () => {
		cva({ base: {}, variants: {} })
	})
})
