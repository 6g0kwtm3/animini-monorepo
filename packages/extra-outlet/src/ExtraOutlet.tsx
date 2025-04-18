import { use, type ReactNode } from "react"
import { ExtraOutletContext, useExtraOutlet } from "./useExtraOutlet"

export function ExtraOutlet(props: {
	id: string
	context?: unknown
}): ReactNode {
	return useExtraOutlet(props.id, props.context)
}

export function ExtraOutlets(props: Record<string, ReactNode>): ReactNode {
	const id = use(ExtraOutletContext)

	const outlet = props[id]

	if (outlet !== undefined) return outlet

	return <ExtraOutlet id={id} />
}
