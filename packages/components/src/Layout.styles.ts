import * as design from "@animedes/design"
import { create, is, Var } from "@animedes/unstyled"

export const Navigation = new Var<"bar" | "drawer" | "none" | "rail">(
	"--navigation"
)

export const Variant = new Var<"fixed" | "flexible">("--variant")

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
			base: "1rem",
			[is(Navigation, "none", "bar")]: { [design.media.sm]: "1.5rem" },
			[is(Navigation, "rail")]: "5rem",
			[is(Navigation, "drawer")]: "22.5rem",
		}),
		...design.utilities.paddingBottom({ [is(Navigation, "bar")]: "5rem" }),
	},
	pane: {
		display: "block",
		position: "relative",
		overflowY: "auto",
		overflowX: "hidden",
		borderRadius: design.tokens.borderRadius.md,

		width: {
			[is(Variant, "fixed")]: "22.5rem",
			[is(Variant, "flexible")]: "100%",
		},
		flexShrink: { [is(Variant, "fixed")]: 0 },
		flexGrow: { [is(Variant, "flexible")]: 1 },
	},
})
