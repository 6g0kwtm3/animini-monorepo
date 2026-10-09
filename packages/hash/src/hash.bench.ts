import { bench } from "vitest"

import { hash32 } from "./hash"

bench("hash", () => {
	void hash32("test")
})
