import { NavLink } from "@remix-run/react"
import type { ComponentPropsWithoutRef } from "react"
import { createContext, useContext, useId } from "react"
import { createTV } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"

const tv = createTV({ twMerge: false })

export const navigationBar = tv({
	slots: {
		label: `group relative flex flex-col items-center gap-1 text-label-md text-on-surface-variant aria-[current='page']:text-on-surface flex-1`
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
		<div className="rounded-lg absolute -z-10 h-8 w-0 bg-secondary-container transition-all group-aria-[current='page']:w-16"></div>
	)
}

export function NavigationBarItemIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className="relative group-aria-[current='page']:i-fill  i my-1 h-6 w-6 group-aria-[current='page']:text-on-secondary-container"
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
	return <div {...props} className="w-4 left-1/2 flex items-center justify-center text-label-sm absolute h-4 rounded-full bg-error text-on-error"></div>
}

const NavigationContext = createContext<string | undefined>(undefined)
