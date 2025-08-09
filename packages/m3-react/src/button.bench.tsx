import { describe } from "node:test"
import { bench } from "vitest"
import { buttonDefinition } from "./button"
import { cva } from "unstyled"

describe("cva", () => {
	bench("button", () => {
		cva(buttonDefinition)
	})
})
