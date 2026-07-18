import { createContext, memo, type ComponentProps, type Context } from "react"
import { Link as RouterLink, type PrefetchBehavior } from "react-router"


export const PrefetchProvider: Context<PrefetchBehavior> =
	createContext<PrefetchBehavior>("none")
PrefetchProvider.displayName = "PrefetchProvider"
