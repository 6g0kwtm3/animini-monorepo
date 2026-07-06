import { bench } from "vite-plus/test"
import { button, createButton } from "./m3-react-button"

bench("cva", () => {
	void createButton()
})

bench("apply vars", () => {
	void button({})
})
