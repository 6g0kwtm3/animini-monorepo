import { cva } from "@anitrove/unstyled"
import { bench, describe } from "vitest"
import { buttonDefinition } from "./m3-react-button"

describe("cva", () => {
	bench("button", () => {
		cva(buttonDefinition)
	})
})
