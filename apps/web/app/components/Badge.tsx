import { tokens } from "@anitrove/design"
import { cva, mergeStyles } from "@anitrove/unstyled"
import { Box, type BoxProps } from "@anitrove/unstyled/box"

const styles = cva({
	base: {
		backgroundColor: tokens.colors.error,
		...tokens.typescale["label-sm"],
		color: tokens.colors["on-error"],
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: tokens.borderRadius.sm,
		padding: ".25rem",
		position: "absolute",
		right: 0,
		top: 0,
		transform: "translate(25%, -25%)",
		minWidth: "1rem",
		height: "1rem",
	},
	variants: {},
})

interface BadgeProps extends BoxProps {}

export function Badge(props: BadgeProps) {
	return (
		<Box
			{...props}
			style={mergeStyles(styles.style, styles.variants({}), props.style)}
		></Box>
	)
}
