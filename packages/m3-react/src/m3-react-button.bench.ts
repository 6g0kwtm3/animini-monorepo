import { test } from "vitest"

import { button, createButton } from "./m3-react-button"

test("button", async ({ bench }) => {
	await bench("cva", () => {
		void createButton()
	}).run()

	await bench("apply vars", () => {
		void button({})
	}).run()
})
