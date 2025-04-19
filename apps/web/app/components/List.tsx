import type { ReactNode } from "react"

import * as Ariakit from "@ariakit/react"
import { type VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

export function ListItem({ ...props }: Ariakit.RoleProps<"li">) {
	return (
		<Ariakit.Role.li
			{...props}
			className={tv({ base: "group list-item" })({
				className: props.className,
			})}
		></Ariakit.Role.li>
	)
}

export function ListItemContentTitle(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-title" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

export function ListItemContent(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-content" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

export function ListItemContentSubtitle(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-subtitle" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

export function ListItemImg(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-img" })({ className: props.className })}
		></Ariakit.Role.div>
	)
}

export function ListItemAvatar(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-avatar" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

export function ListItemIcon(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-icon" })({ className: props.className })}
		></Ariakit.Role.div>
	)
}

const subheader = tv({
	base: "text-body-md text-on-surface-variant truncate px-4",
	variants: { lines: { one: "py-2", two: "py-2", three: "py-3" } },
	defaultVariants: { lines: "two" },
})

interface SubheaderProps
	extends Ariakit.HeadingProps,
		VariantProps<typeof subheader> {}

export function Subheader({ lines, ...props }: SubheaderProps): ReactNode {
	return (
		<Ariakit.Heading
			{...props}
			className={subheader({ className: props.className, lines })}
		/>
	)
}

export function ListItemTrailingSupportingText(
	props: Ariakit.RoleProps<"span">
): ReactNode {
	return (
		<Ariakit.Role.span
			{...props}
			className={tv({ base: "list-item-trailing-supporting-text" })({
				className: props.className,
			})}
		/>
	)
}

export function List({ ...props }: Ariakit.RoleProps<"ul">): ReactNode {
	return (
		<Ariakit.Role.ul
			{...props}
			className={tv({ base: "list list-two" })({ className: props.className })}
		></Ariakit.Role.ul>
	)
}
