import { createContext, type ReactNode } from "react"
import { useOutlet } from "react-router"

export const ExtraOutletContext = createContext<string>("children")

export function useExtraOutlet(id: string, context?: unknown): ReactNode {
	const outlet = useOutlet(context)
	return <ExtraOutletContext value={id}>{outlet}</ExtraOutletContext>
}
