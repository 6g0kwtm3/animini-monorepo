import { touchTarget } from "m3-core"
import type { ComponentProps, ReactNode } from "react"

export function TouchTarget(props: ComponentProps<"span">): ReactNode {
	return (
		<span
			{...props}
			className={touchTarget({
				className: props.className,
			})}
		/>
	)
}
