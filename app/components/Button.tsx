import type { ComponentPropsWithoutRef, SyntheticEvent } from "react"
import React from "react"

import * as Ariakit from "@ariakit/react"
import { button } from "~/lib/button"
import { classes } from "./classes"

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

	function invoke(event: SyntheticEvent<HTMLElement>) {
		if (typeof props.invoketarget === "string" && props.type !== "submit") {
			event.preventDefault()
			document.querySelector(`#${props.invoketarget}`)?.dispatchEvent(
				new InvokeEvent({
					relatedTarget: event.currentTarget,
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
			onKeyDown={(event) => {
				props.onKeyDown?.(event)
				if (event.isDefaultPrevented()) {
					return
				}

				if (event.key === " " || event.key === "Enter") {
					invoke(event)
				}
			}}
			onClick={(event) => {
				props.onClick?.(event)
				if (event.isDefaultPrevented()) {
					return
				}
				invoke(event)
			}}
		/>
	)
}

export function ButtonText(
	props: ComponentPropsWithoutRef<typeof Ariakit.Button>,
) {
	return (
		<BaseButton
			{...props}
			className={button({
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
			className={classes(
				"i h-[1.125rem] w-[1.125rem] i-[1.125rem]",
				props.className,
			)}
		></div>
	)
}

ButtonText.displayName = "Button.Text"
ButtonText.Icon.displayName = "Button.Text.Icon"

export const ButtonTonal: Button = (props) => {
	return (
		<BaseButton
			{...props}
			className={button({ variant: "tonal", class: props.className })}
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
			className={button({
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
			className={button({
				className: props.className,
				variant: "elevated",
			})}
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
			className={button({
				className: props.className,
				variant: "outlined",
			})}
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
