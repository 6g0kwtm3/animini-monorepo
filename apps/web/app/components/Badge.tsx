import { mergeStyles } from "@anitrove/unstyled"
import { Box, type BoxProps } from "@anitrove/unstyled/box"
import { styles } from "./Badge.styles" with { type: "macro" }

interface BadgeProps extends BoxProps {}

export function Badge(props: BadgeProps) {
	return <Box {...props} style={mergeStyles(styles, props.style)}></Box>
}
