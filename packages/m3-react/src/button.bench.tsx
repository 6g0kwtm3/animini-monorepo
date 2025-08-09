import { describe } from "vitest"
import { bench } from "vitest"
import { buttonDefinition } from "./button"
import { cva } from "unstyled"

describe("cva", () => {
	bench("button", () => {
		cva(buttonDefinition)
	})
})
