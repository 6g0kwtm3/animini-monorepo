import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { classes } from "./classes"

export function DialogIcon(props: ComponentPropsWithoutRef<"div">): ReactNode {
	return (
		<div className={`-mb-2 flex justify-center px-6 ${props.className}`}>
			<div className="text-secondary i-6 h-6 w-6">{props.children}</div>
		</div>
	)
}
export function DialogFullscreenIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className={classes("i-6 h-6 w-6", props.className)} />
}
