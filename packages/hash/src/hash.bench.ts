import { bench, test } from "vitest"

import { hash32 } from "./hash"

test("hash", async ({ bench }) => {
	await bench("hash32", () => {
		void hash32("test")
	}).run()
})
