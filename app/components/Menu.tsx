import type { ComponentPropsWithoutRef, ElementRef, ReactElement } from "react"
import { useEffect, useRef } from "react"

import { createElement } from "~/lib/createElement"
import { classes } from "./classes"

export function MenuList(props: ComponentPropsWithoutRef<"ul">) :JSX.Element{
	return (
		<ul
			{...props}
			className={classes(
				"absolute min-w-[7rem] max-w-[17.5rem] rounded-xs bg-surface-container py-2 text-label-lg text-on-surface",
				props.className
			)}
		>
			{props.children}
		</ul>
	)
}

export function MenuTrigger(props: ComponentPropsWithoutRef<"summary">) :JSX.Element{
	return <summary {...props} aria-haspopup="listbox" />
}

export function Menu(props: ComponentPropsWithoutRef<"details">) :JSX.Element{
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
		/>
	)
}

MenuList.displayName = "Menu"

export function MenuItem({
	...props
}: ComponentPropsWithoutRef<"div"> & {
	render?: ReactElement
}) {
	return createElement("li", {
		...props,
		className: classes(
			"group inset-[unset] flex h-12 items-center gap-3 bg-surface-container px-3 text-label-lg text-on-surface elevation-2 hover:state-hover focus:state-focus",
			props.className
		)
	})
}

export function MenuItemIcon(props: ComponentPropsWithoutRef<"div">) :JSX.Element{
	return <div {...props} className="h-6 w-6 text-on-surface-variant" />
}

export function MenuItemLeadingIcon(props: ComponentPropsWithoutRef<"div">) :JSX.Element{
	return <div {...props} className="h-6 w-6 text-on-surface-variant" />
}

export function MenuItemTrailingIcon(props: ComponentPropsWithoutRef<"div">) :JSX.Element{
	return <div {...props} className="ms-auto h-6 w-6 text-on-surface-variant" />
}

export function MenuItemTrailingText(props: ComponentPropsWithoutRef<"div">) :JSX.Element{
	return <div {...props} className="ms-auto text-on-surface-variant" />
}

export function MenuDivider(props: ComponentPropsWithoutRef<"li">) :JSX.Element{
	return (
		<li {...props} className="contents">
			<div className="my-2 w-full border-b border-outline-variant" />
		</li>
	)
}
