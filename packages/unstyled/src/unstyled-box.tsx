import { Role, type RoleProps } from "@ariakit/react"
import type { ReactNode } from "react"
import { mergeStyles, type PreCompiledStyles } from "./unstyled-print"
import { useStyles } from "./unstyled-use-styles"

export interface BoxProps extends Omit<RoleProps, "className" | "style"> {
	style?: PreCompiledStyles
}

export function Box({ style, ...props }: BoxProps): ReactNode {
	const [className, jsx, dynamicVars] = useStyles(mergeStyles(style))

	const children = (
		<>
			<Role {...props} className={className}></Role>
			{jsx}
		</>
	)

	return Object.keys(dynamicVars).length !== 0 ? (
		<div style={{ ...dynamicVars, display: "contents" }}>{children}</div>
	) : (
		children
	)
}
