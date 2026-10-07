import { classes } from "./classes"
import { tv } from "./tailwind-variants"

import type { ComponentProps, ReactNode } from "react"

const dialogIcon = tv({ base: "-mb-2 flex justify-center px-6" })

export function DialogIcon(props: ComponentProps<"div">): ReactNode {
	return (
		<div className={dialogIcon({ className: props.className })}>
			<div className="text-secondary i-6 h-6 w-6">{props.children}</div>
		</div>
	)
}
export function DialogFullscreenIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={classes("i-6 h-6 w-6", props.className)} />
}
