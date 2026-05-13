import { bench } from "vitest"
import { button, createButton } from "./m3-react-button"

bench("cva", () => {
	void createButton()
})

bench("cva", () => {
	button({})
})
