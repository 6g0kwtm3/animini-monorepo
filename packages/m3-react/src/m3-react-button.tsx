import * as design from "@anitrove/design"
import { media } from "@anitrove/design"
import {
	create,
	is,
	mergeStyles,
	provide,
	Var,
	type OutStyles,
} from "@anitrove/unstyled"

const color = new Var<"elevated" | "filled" | "outlined" | "text" | "tonal">(
	"--color"
)
const shape = new Var<"round" | "square">("--shape")
const size = new Var<"lg" | "md" | "sm" | "xl" | "xs">("--size")

export function createButton() {
	return create({
		button: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			whiteSpace: "nowrap",
			textBox: "trim-both cap alphabetic",
			...design.tokens.typescale["label-lg"],
			...design.state({
				[media.hover]: "hover",
				[media["focus-visible"]]: { base: "focus", [media.hover]: "focus" },
				[media.active]: "pressed",
				[media.disabled]: "none",
			}),
			transitionProperty: { [media.motionSafe]: "border-radius" },
			...design.tokens.transitions.spatial.fast,

			ringColor: {
				base: undefined,
				[is(color, "outlined")]: {
					base: design.tokens.colors.outline,
					'&[aria-disabled="true"]': design.tokens.colors["outline-variant/12"],
				},
			},
			ringInset: { base: undefined, [is(color, "outlined")]: "inset" },
			ring: {
				base: undefined,
				[is(color, "outlined")]: 1,
				[is(size, "lg")]: 2,
				[is(size, "xl")]: 3,
			},
			color: {
				base: undefined,
				[is(color, "outlined")]: design.tokens.colors["on-surface-variant"],
				[is(color, "elevated")]: design.tokens.colors.primary,
				[is(color, "filled")]: design.tokens.colors["on-primary"],
				[is(color, "text")]: design.tokens.colors.primary,
				[is(color, "tonal")]: design.tokens.colors["on-secondary-container"],
			},
			backgroundColor: {
				base: undefined,
				[is(color, "elevated")]: design.tokens.colors["surface-container-low"],
				[is(color, "filled")]: design.tokens.colors.primary,
				[is(color, "tonal")]: design.tokens.colors["secondary-container"],
			},
			height: {
				base: undefined,
				[is(size, "xs")]: "2rem",
				[is(size, "sm")]: "2.5rem",
				[is(size, "md")]: "3.5rem",
				[is(size, "lg")]: "6rem",
				[is(size, "xl")]: "8.5rem",
			},
			gap: {
				base: undefined,
				[is(size, "xs")]: ".25rem",
				[is(size, "sm")]: ".5rem",
				[is(size, "md")]: ".5rem",
				[is(size, "lg")]: ".75rem",
				[is(size, "xl")]: "1rem",
			},
			...design.utilities.paddingX({
				base: undefined,
				[is(size, "xs")]: ".75rem",
				[is(size, "sm")]: "1rem",
				[is(size, "md")]: "1.5rem",
				[is(size, "lg")]: "3rem",
				[is(size, "xl")]: "4rem",
			}),
			...design.utilities.typescale({
				[is(size, "md")]: "title-md",
				[is(size, "lg")]: "headline-sm",
				[is(size, "xl")]: "headline-lg",
			}),

			borderRadius: {
				[is(shape, "round")]: {
					[is(size, "xs")]: { base: "1rem", [media.active]: ".5rem" },
					[is(size, "sm")]: { base: "1.25rem", [media.active]: ".5rem" },
					[is(size, "md")]: { base: "1.75rem", [media.active]: ".75rem" },
					[is(size, "lg")]: { base: "3rem", [media.active]: "1rem" },
					[is(size, "xl")]: { base: "4.25rem", [media.active]: "1rem" },
				},
				[is(shape, "square")]: {
					[is(size, "xs", "sm")]: { base: ".75rem", [media.active]: ".5rem" },
					[is(size, "md")]: {
						base: design.tokens.borderRadius.lg,
						[media.active]: ".75rem",
					},
					[is(size, "lg", "xl")]: {
						base: design.tokens.borderRadius.xl,
						[media.active]: "1rem",
					},
				},
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
