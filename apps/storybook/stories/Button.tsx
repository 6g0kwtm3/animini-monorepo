import * as Ariakit from "@ariakit/react"
import { styled } from "../styled-system/jsx"
import { button } from "../styled-system/recipes"
/** Primary UI component for user interaction */
export const Button = styled(Ariakit.Button, button, {
	defaultProps: {
		type: "button",
		// render: (
		// 	<motion.button
		// transition={{
		// 	type: "spring",
		// stiffness: 800,
		// damping: 0.6,
		// 	duration: 0.35,
		// }}
		// whileTap={{ borderRadius: ".5rem" }}
		// 	/>
		// ),
	},
})
