import { tokens } from "@animedes/design"
import { precompileStyles } from "@animedes/unstyled"

export const styles = precompileStyles({
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
})
