import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { classes } from "./classes"

export interface WithChildren {
  children?: ReactNode | undefined
}

export function DialogIcon(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={`-mb-2 flex justify-center px-6 ${props.className}`}>
      <div className="h-6 w-6 text-secondary">{props.children}</div>
    </div>
  )
}

export function DialogFullscreenIcon(props: ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={classes("h-6 w-6", props.className)}></div>
}
