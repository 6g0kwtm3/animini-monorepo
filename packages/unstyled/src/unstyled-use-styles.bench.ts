import { bench } from "vitest"
import { hash32 } from "./unstyled-use-styles"

bench("hash", () => {
	void hash32("test")
})
