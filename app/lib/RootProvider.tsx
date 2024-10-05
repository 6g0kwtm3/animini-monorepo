import { createContext } from "react"

import Route from "../+types.root"

export const RootProvider = createContext<Route.LoaderData>(null!)

