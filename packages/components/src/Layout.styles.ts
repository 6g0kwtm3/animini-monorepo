import * as design from "@animedes/design"
import { create, createVar, variants } from "@animedes/unstyled"

export const Navigation = createVar("--navigation", [
	"bar",
	"drawer",
	"none",
	"rail",
])

export const Variant = createVar("--variant", ["fixed", "flexible"])

export const styles = create({
	layout: { isolation: "isolate" },
	body: {
		...design.utilities.marginEnd({
			base: "1rem",
			[design.media.sm]: "1.5rem",
		}),
		display: "flex",
		gap: "1.5rem",
		...design.utilities.marginStart({
			base: variants(Navigation, {
				none: "1rem",
				bar: "1rem",
				["rail"]: "5rem",
				["drawer"]: "22.5rem",
			}),
			[design.media.sm]: variants(Navigation, {
				none: "1.5rem",
				bar: "1.5rem",
				["rail"]: "5rem",
				["drawer"]: "22.5rem",
			}),
		}),
		...design.utilities.paddingBottom(
			variants(Navigation, { ["bar"]: "5rem" })
		),
	},
	pane: {
		display: "block",
		position: "relative",
		overflowY: "auto",
		overflowX: "hidden",
		borderRadius: design.tokens.borderRadius.md,

		width: variants(Variant, { ["fixed"]: "22.5rem", ["flexible"]: "100%" }),
		flexShrink: variants(Variant, { ["fixed"]: 0 }),
		flexGrow: variants(Variant, { ["flexible"]: 1 }),
	},
})
