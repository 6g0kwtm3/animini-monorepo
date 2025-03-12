import type { ReactNode } from "react"

export function TouchTarget(): ReactNode {
	return (
		<span className="absolute left-1/2 top-1/2 h-[max(100%,3rem)] w-[max(100%,3rem)] -translate-x-1/2 -translate-y-1/2" />
	)
}
