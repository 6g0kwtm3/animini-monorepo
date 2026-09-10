import { createContext, type ReactNode, type Context } from "react"
import { useOutlet } from "react-router"
import type { Stable } from "@animedes/react-stable"

export const ExtraOutletContext: Context<string> =
	createContext("children")
ExtraOutletContext.displayName = "ExtraOutletContext"

export function useExtraOutlet(id: string, context?: unknown): ReactNode {
	const outlet = useOutlet(context)
	return <ExtraOutletContext value={id}>{outlet}</ExtraOutletContext>
}
