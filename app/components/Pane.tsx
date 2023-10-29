import type { ComponentPropsWithoutRef } from "react"

export function classes(...classes: (string | 0 | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

export function PaneFixed(props: ComponentPropsWithoutRef<"div">) {
  return (
    <section
      {...props}
      className={classes("w-[22.5rem]", props.className)}
    ></section>
  )
}

export function PaneFlexible(props: ComponentPropsWithoutRef<"div">) {
  return (
    <section
      {...props}
      className={classes("flex-1", props.className)}
    ></section>
  )
}
