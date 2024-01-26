import { NavLink } from "@remix-run/react"
import type { ComponentPropsWithoutRef } from "react"
import { createContext, useContext, useId } from "react"
import { createTV } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"

const tv = createTV({ twMerge: false })

export const navigationBar = tv({
	slots: {
		label: `group relative flex flex-1 flex-col items-center gap-1 text-label-md text-on-surface-variant aria-[current='page']:text-on-surface`
	}
})
const { label } = navigationBar()

export function NavigationBarItem(
	props: ComponentPropsWithoutRef<typeof NavLink>
) {
	return (
		<NavLink {...props} className={label()}>
			<NavigationBarActiveIndicator></NavigationBarActiveIndicator>
			{props.children} <TouchTarget></TouchTarget>
		</NavLink>
	)
}

function NavigationBarActiveIndicator() {
	const layoutId = useContext(NavigationContext)

	return (
		<div className="absolute -z-10 h-8 w-0 rounded-lg bg-secondary-container transition-all group-aria-[current='page']:w-16"></div>
	)
}

export function NavigationBarItemIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className="i relative  my-1 h-6 w-6 group-aria-[current='page']:i-fill group-aria-[current='page']:text-on-secondary-container"
		></div>
	)
}

export function NavigationBar(props: ComponentPropsWithoutRef<"nav">) {
	return (
		<NavigationContext.Provider value={useId()}>
			<nav
				className="sticky bottom-0 left-0 right-0 z-10 flex h-20 bg-surface-container pb-4 pt-3 elevation-2"
				{...props}
			></nav>
		</NavigationContext.Provider>
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

const NavigationContext = createContext<string | undefined>(undefined)
