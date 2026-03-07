import { cva } from "@anitrove/unstyled"
import { bench, describe } from "vitest"
import { buttonDefinition } from "./m3-react-button"

void describe("button", () => {
	bench("cva", () => {
		void cva(buttonDefinition)
	})
})
