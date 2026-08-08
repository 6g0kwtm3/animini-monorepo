import { create, is, Var } from "@anitrove/unstyled"

import * as design from "@anitrove/design"

export const First = new Var<"false" | "true">("--first")
export const Last = new Var<"false" | "true">("--last")
export const Lines = new Var<"one" | "three" | "two">("--lines")

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
			base: design.tokens.borderRadius.xs,
			[is(Last, "true")]:
				`${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg}`,
			[is(First, "true")]: {
				base: `${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs}`,
				[is(Last, "true")]: design.tokens.borderRadius.lg,
			},
			[design.media.hover]: design.tokens.borderRadius.md,
			[design.media["focus-visible"]]: design.tokens.borderRadius.lg,
			[design.media.focusWithin]: design.tokens.borderRadius.lg,
			[design.media.active]: design.tokens.borderRadius.lg,
		},

		minHeight: {
			[is(Lines, "one")]: "3.5rem",
			[is(Lines, "two")]: "4.5rem",
			[is(Lines, "three")]: "5.5rem",
		},
		alignItems: {
			[is(Lines, "one")]: "center",
			[is(Lines, "two")]: "center",
			[is(Lines, "three")]: "flex-start",
		},
	},
})
