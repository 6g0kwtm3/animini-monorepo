import { bench, describe } from "vitest"
import { cva } from "./unstyled-cva"

void describe("cva", () => {
	bench("empty", () => {
		void cva({ base: {}, variants: {} })
	})
})
