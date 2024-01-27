import { NavLink } from "@remix-run/react"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { createTV } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"

const tv = createTV({ twMerge: false })

export const navigationBar = tv({
	slots: {
		label: `group relative flex flex-1 flex-col items-center gap-1 text-label-md text-on-surface-variant aria-[current='page']:text-on-surface`
	}
})
const { label } = navigationBar()

export function NavigationBarItem({
	children,
	...props
}: PropsWithChildren<ComponentPropsWithoutRef<typeof NavLink>>) {
	return (
		<NavLink {...props} className={label()}>
			<NavigationBarActiveIndicator></NavigationBarActiveIndicator>
			{children}
			<TouchTarget></TouchTarget>
		</NavLink>
	)
}

function NavigationBarActiveIndicator() {
	return (
		<div className="rounded-lg absolute -z-10 h-8 w-0 bg-secondary-container transition-all group-aria-[current='page']:w-16"></div>
	)
}

export function NavigationBarItemIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className="group-aria-[current='page']:i-fill i  relative my-1 h-6 w-6 group-aria-[current='page']:text-on-secondary-container"
		></div>
	)
}

export function NavigationBar(props: ComponentPropsWithoutRef<"nav">) {
	return (
		<nav
			className="sticky bottom-0 left-0 right-0 z-10 flex h-20 gap-2 bg-surface-container pb-4 pt-3 elevation-2"
			{...props}
		></nav>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentPropsWithoutRef<"div">
) {
	return (
		<div
			{...props}
			className="absolute left-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-label-sm text-on-error"
		></div>
	)
}