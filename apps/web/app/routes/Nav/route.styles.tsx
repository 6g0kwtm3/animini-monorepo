import * as design from "@anitrove/design"
import { create } from "@anitrove/unstyled"
import { Navigation } from "~/components/Layout.styles"

export const styles = create({
	layout: { [Navigation.name]: { base: "bar", [design.media.sm]: "rail" } },
})
