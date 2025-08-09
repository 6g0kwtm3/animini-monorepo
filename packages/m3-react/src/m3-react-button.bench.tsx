import { describe } from "vitest"
import { bench } from "vitest"
import { buttonDefinition } from "./m3-react-button"
import { cva } from "unstyled"

describe("cva", () => {
	bench("button", () => {
		cva(buttonDefinition)
	})
})
