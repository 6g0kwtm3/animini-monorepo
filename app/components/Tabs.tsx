import { Link } from "@remix-run/react"
import { Predicate } from "effect"
import { motion } from "framer-motion"

import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { createContext, useContext, useId } from "react"

const TabsContext = createContext<string | undefined>(undefined)

export function Tabs(props: PropsWithChildren<{}>) {
	return (
		<TabsContext.Provider value={useId()}>
			<div className="overflow-x-auto bg-surface">{props.children}</div>
		</TabsContext.Provider>
	)
}

export function TabsTab(
	props: PropsWithChildren<{
		active: boolean
		to: ComponentPropsWithoutRef<typeof Link>["to"]
	}>,
) {
	const layoutId = useContext(TabsContext)
	return (
		<Link
			to={props.to}
			className={`${
				props.active
					? "text-primary state-primary"
					: "text-on-surface-variant state-on-surface hover:text-on-surface focus:text-on-surface"
			} flex justify-center px-4 text-title-sm surface hover:state-hover focus:state-focus`}
		>
			<div
				className={`${
					props.active ? "" : ""
				} relative flex h-12 items-center whitespace-nowrap`}
			>
				{props.children}
				{props.active && (
					<motion.div
						{...(Predicate.isString(layoutId) ? { layoutId } : {})}
						className="absolute bottom-0 left-0 right-0 h-[0.1875rem] rounded-t-[0.1875rem] bg-primary"
					></motion.div>
				)}
			</div>
		</Link>
	)
}
