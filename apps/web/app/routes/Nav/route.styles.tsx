import * as design from "@anitrove/design"
import { create } from "@anitrove/unstyled"
import { layoutStyles } from "@animedes/components"

export const styles = create({
	layout: {
		[layoutStyles.Navigation.name]: { base: "bar", [design.media.sm]: "rail" },
	},
})