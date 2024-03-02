import type { Link } from "@remix-run/react"
import { NavLink } from "@remix-run/react"
import { Predicate } from "effect"
import { motion } from "framer-motion"

import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createContext, useContext, useId } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const TabsContext = createContext<string | undefined>(undefined)

const tv = createTV({
	twMerge: false
})

const tabs = tv({
	slots: {
		root: "border-surface-variant border-b"
	},
	variants: {
		variant: {
			primary: {},
			secondary: {}
		},
		grow: {
			true: { root: "grid grid-flow-col [grid-auto-columns:minmax(0,1fr)]" },
			false: { root: "flex overflow-x-auto" }
		}
	},
	defaultVariants: { primary: true, grow: false }
})

export function Tabs({
	grow,
	...props
}: ComponentPropsWithoutRef<"nav"> & VariantProps<typeof tabs>) {
	const styles = tabs({ grow })
	return (
		<TabsContext.Provider value={useId()}>
			<nav
				{...props}
				className={styles.root({
					className: props.className
				})}
			/>
		</TabsContext.Provider>
	)
}

export function TabsTab({
	children,
	...props
}: Partial<ComponentPropsWithoutRef<typeof Link>> & {
	render?: ReactElement
}) {
	const layoutId = useContext(TabsContext)
	return createElement(NavLink, {
		...props,
		className: `flex justify-center px-4 text-title-sm text-on-surface-variant hover:text-on-surface hover:state-hover aria-[current='page']:text-primary focused:text-on-surface focused:state-focus pressed:state-pressed`,
		children: (({ isActive }) => (
			<div className={`relative flex h-12 items-center whitespace-nowrap`}>
				{children}
				{isActive && (
					<motion.div
						{...(Predicate.isString(layoutId) ? { layoutId } : {})}
						className="absolute bottom-0 left-0 right-0 h-[0.1875rem] rounded-t-[0.1875rem] bg-primary"
					/>
				)}
			</div>
		)) satisfies ComponentPropsWithoutRef<typeof NavLink>["children"]
	})
}
