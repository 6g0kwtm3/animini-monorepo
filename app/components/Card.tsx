const Slot = "div"

import type { ComponentPropsWithoutRef, FC } from "react"
import { classes } from "./classes"

type Card = FC<
	ComponentPropsWithoutRef<"div"> & {
		disabled?: boolean
		dragged?: boolean
		pressed?: boolean
		action?: boolean
		asChild?: boolean
	}
>

export const CardElevated: Card = ({ asChild, ...props }) => {
	const Component = asChild ? Slot : "div"
	return (
		<Component
			{...props}
			tabIndex={props.disabled ? -1 : props.tabIndex}
			className={classes(
				props.disabled
					? "text-on-surface/[.38]"
					: props.pressed
						? "text-on-surface elevation-1 state-pressed"
						: props.dragged
							? "text-on-surface elevation-3 state-dragged"
							: "text-on-surface elevation-1",

				props.action &&
					!props.disabled &&
					!props.pressed &&
					!props.dragged &&
					"hover:elevation-2 hover:state-hover",
				"relative overflow-hidden rounded-md bg-surface-container-low p-4 state-on-surface focus:elevation-1 focus:state-focus",
				props.className
			)}
		></Component>
	)
}

export const CardFilled: Card = ({ asChild, ...props }) => {
	const Component = asChild ? Slot : "div"
	return (
		<Component
			{...props}
			tabIndex={props.disabled ? -1 : props.tabIndex}
			className={classes(
				props.disabled
					? "text-on-surface-variant/[.38]"
					: props.pressed
						? "text-on-surface-variant state-pressed"
						: props.dragged
							? "text-on-surface-variant elevation-3 state-dragged"
							: "text-on-surface-variant",

				props.action &&
					!props.disabled &&
					!props.pressed &&
					!props.dragged &&
					"hover:elevation-1 hover:state-hover",
				"relative overflow-hidden rounded-md bg-surface-container-highest p-4 state-on-surface-variant focus:elevation-1 focus:state-focus",
				props.className
			)}
		></Component>
	)
}

export const CardOutlined: Card = ({ asChild, ...props }) => {
	const Component = asChild ? Slot : "div"

	return (
		<Component
			{...props}
			tabIndex={props.disabled ? -1 : props.tabIndex}
			className={classes(
				props.disabled
					? "border-outline/[.12] text-on-surface/[.38]"
					: props.pressed
						? "border-outline-variant text-on-surface state-pressed"
						: props.dragged
							? "border-outline-variant text-on-surface elevation-3 state-dragged"
							: "border-outline-variant text-on-surface focus:border-on-surface",

				props.action &&
					!props.disabled &&
					!props.pressed &&
					!props.dragged &&
					"hover:elevation-1 hover:state-hover",
				"relative overflow-hidden rounded-md border p-4 state-on-surface focus:elevation-1 focus:state-focus",
				props.className
			)}
		></Component>
	)
}
