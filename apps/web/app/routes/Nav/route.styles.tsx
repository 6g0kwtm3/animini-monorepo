import * as design from "@anitrove/design"
import { create } from "@anitrove/unstyled"
import * as layoutStyles from "@animedes/components/Layout.styles"

export const styles = create({
	layout: {
		[layoutStyles.Navigation.name]: { base: "bar", [design.media.sm]: "rail" },
	},
})