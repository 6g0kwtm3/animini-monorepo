import { useOutlet } from "@remix-run/react"
import { type ReactNode } from "react"
import { ExtraOutletContext } from "./ExtraOutlet"

export function useExtraOutlet(id: string, context?: unknown): ReactNode {
	const outlet = useOutlet(context)
	return <ExtraOutletContext value={id}>{outlet}</ExtraOutletContext>
}
