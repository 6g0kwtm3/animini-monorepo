import { Role, type RoleProps } from "@ariakit/react"
import type { ReactNode } from "react"
import { mergeStyles, type PreCompiledStyles } from "./unstyled-print"
import { useStyles } from "./unstyled-use-styles"

export interface BoxProps extends Omit<RoleProps, "className" | "style"> {
	style?: PreCompiledStyles
}

export function Box({ style, ...props }: BoxProps): ReactNode {
	const [className, jsx] = useStyles(mergeStyles(style))
	return (
		<>
			<Role {...props} className={className}></Role>
			{jsx}
		</>
	)
}
