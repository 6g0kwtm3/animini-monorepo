import type { ComponentProps, ReactNode } from "react"
import { classes } from "./classes"

export function DialogIcon(props: ComponentProps<"div">): ReactNode {
	return (
		<div className={`-mb-2 flex justify-center px-6 ${props.className}`}>
			<div className="h-6 w-6 text-secondary i-6">{props.children}</div>
		</div>
	)
}
export function DialogFullscreenIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={classes("h-6 w-6 i-6", props.className)} />
}
