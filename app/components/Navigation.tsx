import { Predicate } from "effect"
import { motion } from "framer-motion"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { createContext, useContext, useId } from "react"

export function NavigationItem(props: PropsWithChildren<{ active: boolean }>) {
	const layoutId = useContext(NavigationContext)
	return (
		<div
			className={`${
				props.active ? "text-on-secondary-container" : "text-on-surface-variant"
			} relative flex h-14 items-center gap-3 px-4 text-label-lg`}
		>
			{props.active && (
				<motion.div
					{...(Predicate.isString(layoutId) ? { layoutId } : {})}
					className="absolute inset-0 -z-10 rounded-xl bg-secondary-container"
				></motion.div>
			)}
			{props.children}
		</div>
	)
}

export function NavigationItemIcon() {
	return (
		<div className="h-6 w-6">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<line x1="8" x2="21" y1="6" y2="6" />
				<line x1="8" x2="21" y1="12" y2="12" />
				<line x1="8" x2="21" y1="18" y2="18" />
				<line x1="3" x2="3.01" y1="6" y2="6" />
				<line x1="3" x2="3.01" y1="12" y2="12" />
				<line x1="3" x2="3.01" y1="18" y2="18" />
			</svg>
		</div>
	)
}

export function Navigation(props: ComponentPropsWithoutRef<"div">) {
	return (
		<NavigationContext.Provider value={useId()}>
			<div className="w-[22.5rem] px-3" {...props}></div>
		</NavigationContext.Provider>
	)
}

const NavigationContext = createContext<string | undefined>(undefined)
