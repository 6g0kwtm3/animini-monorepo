import { Slot } from "@radix-ui/react-slot"
import type { ComponentPropsWithoutRef, ElementRef } from "react"
import { useEffect, useRef } from "react"

import { classes } from "./classes"

export function MenuList(props: ComponentPropsWithoutRef<"ul">) {
	return (
		<ul
			{...props}
			className={classes(
				"absolute min-w-[7rem] max-w-[17.5rem] rounded-xs bg-surface-container py-2 text-label-lg text-on-surface elevation-2",
				props.className,
			)}
		>
			{props.children}
		</ul>
	)
}

export function MenuTrigger(props: ComponentPropsWithoutRef<"summary">) {
	return <summary {...props} aria-haspopup="listbox"></summary>
}

export function Menu(props: ComponentPropsWithoutRef<"details">) {
	const ref = useRef<ElementRef<"details">>(null)

	useEffect(() => {
		const listener = (event: MouseEvent): void => {
			if (
				!(event.target instanceof Node) ||
				ref.current!.contains(event.target)
			) {
				return
			}
			ref.current!.open = false
		}

		document.body.addEventListener("click", listener)

		return () => document.body.removeEventListener("click", listener)
	}, [])

	return (
		<details
			{...props}
			ref={ref}
			role="list"
			className={classes("relative marker:hidden", props.className)}
		></details>
	)
}

MenuList.displayName = "Menu"

export function MenuItem({
	asChild,
	...props
}: ComponentPropsWithoutRef<"div"> & {
	asChild?: boolean
}) {
	const Component = asChild ? Slot : "li"

	return (
		<Component
			className={classes(
				"group inset-[unset] flex h-12 items-center gap-3 bg-surface-container px-3 text-label-lg text-on-surface elevation-2 state-on-surface hover:state-hover focus:state-focus",
				props.className,
			)}
		>
			{props.children}
		</Component>
	)
}

export function MenuItemIcon(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className="h-6 w-6 text-on-surface-variant"></div>
}

export function MenuItemLeadingIcon(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className="h-6 w-6 text-on-surface-variant"></div>
}

export function MenuItemTrailingIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div {...props} className="ms-auto h-6 w-6 text-on-surface-variant"></div>
	)
}

export function MenuItemTrailingText(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className="ms-auto text-on-surface-variant"></div>
}

export function MenuDivider(props: ComponentPropsWithoutRef<"li">) {
	return (
		<li {...props} className="contents">
			<div className="my-2 w-full border-b border-outline-variant"></div>
		</li>
	)
}
