import { test } from "vitest"

import { cva } from "./unstyled-cva.ts"

test("cva", async ({ bench }) => {
	await bench("empty", () => {
		void cva({ base: {}, variants: {} })
	}).run()
})
