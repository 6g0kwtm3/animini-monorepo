import { bench } from "vite-plus/test"
import { cva } from "./unstyled-cva.ts"

bench("empty", () => {
	void cva({ base: {}, variants: {} })
})
