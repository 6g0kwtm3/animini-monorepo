import { createContext } from "react"

import type {Route} from "../+types/root"

export const RootProvider = createContext<Route.ComponentProps['loaderData']>(null!)
