import type { ComponentPropsWithoutRef, SyntheticEvent } from "react"
import React, { memo } from "react"

import * as Ariakit from "@ariakit/react"
import { tv } from "tailwind-variants"
import { classes } from "./Pane"

export type Icon = React.FC<ComponentPropsWithoutRef<"div">>

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
  invoketarget?: string
  invokeaction?: string
}

interface Button extends React.FC<ButtonProps> {
  Icon: Icon
}

interface InvokeEventInit extends EventInit {
  action?: string
  relatedTarget: HTMLElement
}

export class InvokeEvent extends Event {
  readonly relatedTarget: HTMLElement
  readonly action: string

  constructor(init: InvokeEventInit) {
    super("invoke", init)
    this.relatedTarget = init.relatedTarget

    this.action = init.action ?? "auto"
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    invoke: InvokeEvent
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    beforetoggle: ToggleEvent
  }
}

export function BaseButton(
  props: ComponentPropsWithoutRef<typeof Ariakit.Button>,
) {
  // props.type ??= "submit"

  function invoke(e: SyntheticEvent<HTMLElement>) {
    if (typeof props.invoketarget === "string" && props.type !== "submit") {
      e.preventDefault()
      document.getElementById(props.invoketarget)?.dispatchEvent(
        new InvokeEvent({
          relatedTarget: e.currentTarget,
          ...(typeof props.invokeaction === "string"
            ? { action: props.invokeaction }
            : {}),
        }),
      )
    }
  }

  return (
    <Ariakit.Button
      {...props}
      onKeyDown={(e) => {
        props.onKeyDown?.(e)
        if (e.isDefaultPrevented()) {
          return
        }

        if (e.key === " " || e.key === "Enter") {
          invoke(e)
        }
      }}
      onClick={(e) => {
        props.onClick?.(e)
        if (e.isDefaultPrevented()) {
          return
        }
        invoke(e)
      }}
    />
  )
}

export const fab = tv({
  base: "surface elevation-3 hover:state-hover active:state-pressed data-[active]:state-pressed data-[focus-visible]:state-focus",
  variants: {
    size: {
      default: "h-14 w-14 rounded-[1rem] p-4",
      small: "h-10 w-10 rounded-md p-2",
      large: "h-24 w-24 rounded-xl p-4",
    },
    color: {
      surface: "bg-surface text-on-surface state-on-surface",
      primary:
        "bg-primary-container text-on-primary-container state-on-primary-container",
      secondary:
        "bg-secondary-container text-on-secondary-container state-on-secondary-container",
      tertiary:
        "bg-tertiary-container text-on-tertiary-container state-on-tertiary-container",
    },
  },
  defaultVariants: {
    size: "default",
    color: "primary",
  },
})

export const btn = tv({
  base: "inline-flex h-10 min-w-[3rem] select-none items-center justify-center whitespace-nowrap rounded-[1.25rem] text-label-lg surface hover:state-hover active:state-pressed aria-disabled:text-on-surface/[.38] aria-disabled:state-none data-[active]:state-pressed data-[focus-visible]:state-focus",
  variants: {
    variant: {
      outlined:
        "gap-4 border border-outline px-6 text-primary state-primary focus:border-primary aria-disabled:border-on-surface/[.12]",
      elevated:
        "gap-4 bg-surface px-6 text-primary shadow elevation-1 state-primary hover:elevation-2 aria-disabled:bg-on-surface/[.12] aria-disabled:shadow-none aria-disabled:hover:elevation-1",
      filled:
        "gap-4 bg-primary px-6 text-on-primary state-on-primary aria-disabled:bg-on-surface/[.12]",
      text: "gap-2 px-3 text-primary state-primary",
      tonal:
        "gap-4 bg-secondary-container px-6 text-on-secondary-container state-on-secondary-container hover:elevation-1 aria-disabled:bg-on-surface/[.12] aria-disabled:hover:elevation-0",
    },
  },
  defaultVariants: {
    variant: "text",
  },
})

export function ButtonText(
  props: ComponentPropsWithoutRef<typeof Ariakit.Button>,
) {
  return (
    <BaseButton
      {...props}
      className={btn({
        className: props.className,
      })}
    >
      {/* TODO: right padding +4px if icon */}
    </BaseButton>
  )
}

ButtonText.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("h-[1.125rem] w-[1.125rem]", props.className)}
    ></div>
  )
}

ButtonText.displayName = "Button.Text"
ButtonText.Icon.displayName = "Button.Text.Icon"

export const ButtonTonal: Button = (props) => {
  return (
    <BaseButton
      {...props}
      className={btn({ variant: "tonal", class: props.className })}
    />
  )
}

ButtonTonal.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("-mx-2 h-[1.125rem] w-[1.125rem]", props.className)}
    ></div>
  )
}

ButtonTonal.displayName = "Button.FilledTonal"
ButtonTonal.Icon.displayName = "Button.FilledTonal.Icon"

export const ButtonFilled: Button = (props) => {
  return (
    <BaseButton
      {...props}
      className={btn({
        variant: "filled",
        className: props.className,
      })}
    />
  )
}

ButtonFilled.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("-mx-2 h-[1.125rem] w-[1.125rem]", props.className)}
    ></div>
  )
}

ButtonFilled.displayName = "Button.Filled"
ButtonFilled.Icon.displayName = "Button.Filled.Icon"

export const ButtonElevated: Button = (props) => {
  return (
    <BaseButton
      {...props}
      className={btn({ className: props.className, variant: "elevated" })}
    ></BaseButton>
  )
}

ButtonElevated.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("-mx-2 h-[1.125rem] w-[1.125rem]", props.className)}
    ></div>
  )
}

ButtonElevated.displayName = "Button.Elevated"
ButtonElevated.Icon.displayName = "Button.Elevated.Icon"

export const ButtonOutlined: Button = (props) => {
  return (
    <BaseButton
      {...props}
      className={btn({ className: props.className, variant: "outlined" })}
    ></BaseButton>
  )
}

ButtonOutlined.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("-mx-2 h-[1.125rem] w-[1.125rem]", props.className)}
    ></div>
  )
}

ButtonOutlined.displayName = "Button.Outlined"
ButtonOutlined.Icon.displayName = "Button.Outlined.Icon"

export default memo(ButtonText)
