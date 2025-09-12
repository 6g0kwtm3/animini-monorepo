import { createContext, type ReactNode } from "react"
import { useOutlet } from "react-router"

export const ExtraOutletContext: React.Context<string> =
	createContext("children")
ExtraOutletContext.displayName = "ExtraOutletContext"

export function useExtraOutlet(id: string, context?: unknown): ReactNode {
	const outlet = useOutlet(context)
	return <ExtraOutletContext value={id}>{outlet}</ExtraOutletContext>
}
