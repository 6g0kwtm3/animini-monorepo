import { utilities } from "@animedes/design"
import { create } from "@animedes/unstyled"

export const styles = create({
	breadcrumb: { ...utilities.lineClamp(1) },
	item: {
		...utilities.marginX({ "&:before": "0.25rem" }),
		display: "inline-block",
		content: { "&:first-child": { "&::before": "''" }, "&::before": "'/'" },
		textDecoration: { "&:hover": "underline" },
	},
})
