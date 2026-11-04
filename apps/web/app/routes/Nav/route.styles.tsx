import * as layoutStyles from "@animedes/components/Layout.styles"
import * as design from "@anitrove/design"
import { create } from "@anitrove/unstyled"

export const styles = create({
	layout: {
		[layoutStyles.Navigation.name]: {
			base: `var(${layoutStyles.Navigation.variants.bar.name})`,
			[design.media.sm]: `var(${layoutStyles.Navigation.variants.rail.name})`,
		},
	},
})
