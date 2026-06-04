import { create, is, Var } from "@anitrove/unstyled"
import { createContext, use, type ReactNode } from "react"

import * as design from "@anitrove/design"
import {
	cva,
	defineCva,
	mergeStyles,
	type CvaProps,
	type OutStyles,
} from "@anitrove/unstyled"
import { Box } from "@anitrove/unstyled/box"
import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"
import { createVar } from "@anitrove/unstyled/macro"
export const Lines = createVar<"one" | "two" | "three">()

export const styles = create({
	listItem: {
		...design.state({
			[design.media.hover]: "hover",
			[design.media["focus-visible"]]: "focus",
			[design.media.active]: "focus",
		}),
		gridColumn: "1 / -1",
		display: "grid",
		gridTemplateColumns: "subgrid",
		...design.utilities.paddingX("1rem"),
		borderRadius: {
			base: design.tokens.borderRadius.xs,
			"&:first-child": `${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs}`,
			"&:last-child": `${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg}`,
			[design.media.hover]: design.tokens.borderRadius.md,
			[design.media["focus-visible"]]: design.tokens.borderRadius.lg,
			[design.media.focusWithin]: design.tokens.borderRadius.lg,
			[design.media.active]: design.tokens.borderRadius.lg,
		},
		transitionProperty: { [design.media.motionSafe]: "border-radius" },
		...design.tokens.transitions.spatial.fast,
		backgroundColor: design.tokens.colors.surface,
		minHeight: {
			[is(Lines, "one")]: "3.5rem",
			[is(Lines, "two")]: "4.5rem",
			[is(Lines, "three")]: "5.5rem",
		},
		alignItems: { base: "center", [is(Lines, "three")]: "flex-start" },
	},
	listItemContent: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		gridColumn: {
			"&:first-child": "span 2 / span 2",
			"&:last-child": "span 2 / span 2",
			"&:only-child": "span 3 / span 3",
		},
		justifyContent: { base: "center", [is(Lines, "three")]: "flex-start" },
		...design.utilities.paddingY({
			base: ".5rem",
			[is(Lines, "three")]: ".75rem",
		}),
	},
	listItemSubtitle: {
		color: design.tokens.colors["on-surface-variant"],
		display: { [is(Lines, "one")]: "none" },
		...design.tokens.typescale["body-md"],
		...design.utilities.lineClamp({ [is(Lines, "three")]: 2 }),
	},
})
