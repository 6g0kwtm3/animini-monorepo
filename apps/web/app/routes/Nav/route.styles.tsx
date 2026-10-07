import * as layoutStyles from "@animedes/components/Layout.styles"
import * as design from "@anitrove/design"
import { create } from "@anitrove/unstyled"

export const styles = create({
	layout: {
		[layoutStyles.Navigation.name]: { base: "bar", [design.media.sm]: "rail" },
	},
})
