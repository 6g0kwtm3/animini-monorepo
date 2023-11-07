import type { ComponentPropsWithoutRef } from "react"
import { classes } from "~/lib/styled"

export function Symbol(props: ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={classes("i", props.className)}></span>
}
