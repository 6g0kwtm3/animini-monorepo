import { bench, describe } from "vitest"
import { cva } from "./unstyled-cva"

bench("empty", () => {
	void cva({ base: {}, variants: {} })
})
