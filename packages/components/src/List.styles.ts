import * as design from "@animedes/design"
import { create, createVar, variants } from "@animedes/unstyled"

export const First = createVar("--first", [true, false])
export const Last = createVar("--last", [true, false])
export const Lines = createVar("--lines", ["one", "two", "three"])

export const styles = create({
	listItem: {
		...design.state({
			[design.media.hover]: "hover",
			[design.media["focus-visible"]]: "focus",
			[design.media.active]: "focus",
		}),
		display: "grid",
		gridTemplateColumns: "auto minmax(0, 1fr) auto",
		columnGap: "1rem",
		...design.utilities.paddingX("1rem"),
		transitionProperty: { [design.media.motionSafe]: "border-radius" },
		...design.tokens.transitions.spatial.fast,
		backgroundColor: design.tokens.colors.surface,
		contentVisibility: "auto",

		borderRadius: {
			base: variants(Last, {
				true: variants(First, {
					true: design.tokens.borderRadius.lg,
					false: `${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg}`,
				}),
				false: variants(First, {
					true: `${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs}`,
					false: design.tokens.borderRadius.xs,
				}),
			}),
			[design.media.hover]: design.tokens.borderRadius.md,
			[design.media["focus-visible"]]: design.tokens.borderRadius.lg,
			[design.media.focusWithin]: design.tokens.borderRadius.lg,
			[design.media.active]: design.tokens.borderRadius.lg,
		},

		minHeight: variants(Lines, {
			["one"]: "3.5rem",
			["two"]: "4.5rem",
			["three"]: "5.5rem",
		}),
		alignItems: variants(Lines, {
			["one"]: "center",
			["two"]: "center",
			["three"]: "flex-start",
		}),
	},
})
