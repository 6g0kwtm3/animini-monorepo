import { useId, type ReactNode } from "react"
import { print, type PreCompiledStyles } from "./unstyled-print"

export function useStyles(rawStyle: PreCompiledStyles): [string, ReactNode] {
	const id = useId()

	const className = globalThis.CSS.escape(id)

	const styles = `.${className} ${print(rawStyle)}`
	return [className, <style href={id}>{styles}</style>]
}
