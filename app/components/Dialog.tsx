import type { ComponentPropsWithoutRef } from "react"
import { classes } from "./classes"

export function DialogIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div className={`-mb-2 flex justify-center px-6 ${props.className}`}>
			<div className="h-6 w-6 text-secondary i i-6">{props.children}</div>
		</div>
	)
}

export function DialogFullscreenIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div {...props} className={classes("h-6 w-6 i i-6", props.className)}></div>
	)
}
