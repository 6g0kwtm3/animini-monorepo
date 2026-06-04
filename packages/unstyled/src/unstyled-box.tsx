import { Role, type RoleProps } from "@ariakit/react"
import type { ReactNode } from "react"
import { type OutStyles } from "./unstyled-print.ts"
import { useStyles } from "./unstyled-use-styles.tsx"

export interface BoxProps extends Omit<RoleProps, "className" | "style"> {
	style?: OutStyles
}

export function Box({ style, ...props }: BoxProps): ReactNode {
	const box = useStyles(style?.preCompiledStyles ?? {})
	const wrapper = useStyles(style?.preCompiledVars ?? {})

	const children = (
		<>
			<Role {...props} className={box?.className}></Role>
			{box?.jsx}
		</>
	)

	return wrapper || Object.keys(style?.dynamicVars ?? {}).length !== 0 ? (
		<>
			<div
				style={{ ...style?.dynamicVars, display: "contents" }}
				className={wrapper?.className}
			>
				{children}
			</div>
			{wrapper?.jsx}
		</>
	) : (
		children
	)
}
