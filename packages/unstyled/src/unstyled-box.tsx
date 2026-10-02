import { Role, type RoleProps } from "@ariakit/react"
import type { ReactNode } from "react"
import { mergeStyles, type OutStyles } from "./unstyled-print.ts"
import { useStyles } from "./unstyled-use-styles.tsx"

export interface BoxProps extends Omit<RoleProps, "className" | "style"> {
	style?: OutStyles
}

export function Box({ style, ...props }: BoxProps): ReactNode {
	const [className, jsx, dynamicVars] = useStyles(mergeStyles(style))

	return (
		<>
			<Role {...props} className={className} style={dynamicVars}></Role>
			{jsx}
		</>
	)
}
