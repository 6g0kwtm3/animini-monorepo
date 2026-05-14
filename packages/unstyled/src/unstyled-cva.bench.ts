import { bench, describe } from "vitest"
import { cva } from "./unstyled-cva.ts"

bench("empty", () => {
	void cva({ base: {}, variants: {} })
})
