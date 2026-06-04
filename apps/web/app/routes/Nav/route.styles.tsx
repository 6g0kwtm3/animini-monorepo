import * as design from "@anitrove/design"
import { create, set } from "@anitrove/unstyled"
import { Navigation } from "~/components/Layout.styles"

export const styles = create({
	layout: { ...set(Navigation, { base: "bar", [design.media.sm]: "rail" }) },
})
