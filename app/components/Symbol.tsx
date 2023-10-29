import { ComponentPropsWithoutRef, memo } from "react"
import { classes } from "~/lib/styled"

function Symbol(props: ComponentPropsWithoutRef<"span">) {
  return <span {...props} className={classes("i", props.className)}></span>
}

export default memo(Symbol)
