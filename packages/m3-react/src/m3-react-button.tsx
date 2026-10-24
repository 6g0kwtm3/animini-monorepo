import * as design from "@anitrove/design"
import { media } from "@anitrove/design"
import {
	create,
	createVar,
	mergeStyles,
	provide,
	variants,
	type OutStyles,
} from "@anitrove/unstyled"

const color = createVar("--color", [
	"elevated",
	"filled",
	"outlined",
	"text",
	"tonal",
])
const shape = createVar("--shape", ["round", "square"])
const size = createVar("--size", ["lg", "md", "sm", "xl", "xs"])

export function createButton() {
	return create({
		button: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			whiteSpace: "nowrap",
			textBox: "trim-both cap alphabetic",
			...design.state({
				[media.hover]: "hover",
				[media["focus-visible"]]: { base: "focus", [media.hover]: "focus" },
				[media.active]: "pressed",
				[media.disabled]: "none",
			}),
			transitionProperty: { [media.motionSafe]: "border-radius" },
			...design.tokens.transitions.spatial.fast,

			ringColor: {
				base: variants(color, { outlined: design.tokens.colors.outline }),
				'&[aria-disabled="true"]': variants(color, {
					outlined: design.tokens.colors["outline-variant/12"],
				}),
			},
			ringInset: variants(color, { ["outlined"]: "inset" }),
			ring: {
				[is(color, "outlined")]: 1,
				[is(size, "lg")]: 2,
				[is(size, "xl")]: 3,
			},
			color: variants(color, {
				["outlined"]: design.tokens.colors["on-surface-variant"],
				["elevated"]: design.tokens.colors.primary,
				["filled"]: design.tokens.colors["on-primary"],
				["text"]: design.tokens.colors.primary,
				["tonal"]: design.tokens.colors["on-secondary-container"],
			}),
			backgroundColor: variants(color, {
				["elevated"]: design.tokens.colors["surface-container-low"],
				["filled"]: design.tokens.colors.primary,
				["tonal"]: design.tokens.colors["secondary-container"],
			}),
			height: variants(size, {
				["xs"]: "2rem",
				["sm"]: "2.5rem",
				["md"]: "3.5rem",
				["lg"]: "6rem",
				["xl"]: "8.5rem",
			}),
			gap: variants(size, {
				["xs"]: ".25rem",
				["sm"]: ".5rem",
				["md"]: ".5rem",
				["lg"]: ".75rem",
				["xl"]: "1rem",
			}),
			...design.utilities.paddingX(
				variants(size, {
					["xs"]: ".75rem",
					["sm"]: "1rem",
					["md"]: "1.5rem",
					["lg"]: "3rem",
					["xl"]: "4rem",
				})
			),
			...design.utilities.typescale({
				base: "label-lg",
				[is(size, "md")]: "title-md",
				[is(size, "lg")]: "headline-sm",
				[is(size, "xl")]: "headline-lg",
			}),

			borderRadius: {
				base: variants(shape, {
					["round"]: variants(size, {
						["xs"]: "1rem",
						["sm"]: "1.25rem",
						["md"]: "1.75rem",
						["lg"]: "3rem",
						["xl"]: "4.25rem",
					}),
					["square"]: variants(size, {
						xs: ".75rem",
						sm: ".75rem",
						md: design.tokens.borderRadius.lg,
						lg: design.tokens.borderRadius.xl,
						xl: design.tokens.borderRadius.xl,
					}),
				}),
				[media.active]: variants(size, {
					xs: ".5rem",
					sm: ".5rem",
					["md"]: ".75rem",
					["lg"]: "1rem",
					["xl"]: "1rem",
				}),
			},
		},
	})
}

const styles = createButton()

export function button(
	props: {
		color?: "elevated" | "filled" | "outlined" | "text" | "tonal"
		shape?: "round" | "square"
		size?: "lg" | "md" | "sm" | "xl" | "xs"
	} = {}
): OutStyles {
	return mergeStyles(
		styles.button,
		provide(color, props.color ?? "filled"),
		provide(shape, props.shape ?? "round"),
		provide(size, props.size ?? "sm")
	)
}
