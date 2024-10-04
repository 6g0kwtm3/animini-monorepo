import { createContext, use } from "react"

import Route from "../+types.root"

export const RootProvider = createContext<Route.LoaderData>(null!)

export function useRoot() {
	return use(RootProvider)!
}
