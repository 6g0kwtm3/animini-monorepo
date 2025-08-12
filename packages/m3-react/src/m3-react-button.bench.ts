import { cva } from "@anitrove/unstyled"
import { bench, describe } from "vitest"
import { buttonDefinition } from "./m3-react-button"

describe("button", () => {
	bench("cva", () => {
		cva(buttonDefinition)
	})
})
