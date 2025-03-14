import type { AnitomyResult } from "anitomy"
import { createContext } from "react"

export const Library = createContext<
	Record<string, [AnitomyResult, ...AnitomyResult[]]>
>({})
