import { NavLink } from "@remix-run/react"
import { motion } from "framer-motion"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createContext, useContext, useId } from "react"

import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"

const tv = createTV({ twMerge: false })

const navigation = tv(
	{
		slots: {
			root: "flex",
			label: `group relative flex`,
			activeIndicator: "absolute -z-10 bg-secondary-container",
			icon: "i",
			largeBadge:
				"flex h-4 min-w-4 items-center justify-center rounded-sm bg-error px-1 text-label-sm text-on-error"
		},
		variants: {
			variant: {
				bar: {
					root: "sticky bottom-0 left-0 right-0 z-10 h-20 gap-2 bg-surface-container pb-4 pt-3 elevation-2",
					label: `flex-1 flex-col items-center gap-1 text-label-md text-on-surface-variant aria-[current='page']:text-on-surface`,
					activeIndicator: "h-8 w-16 rounded-lg",
					icon: "relative flex h-8 w-16 items-center justify-center rounded-lg group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-aria-[current='page']:ifill group-focused:state-focus group-pressed:state-pressed",
					largeBadge: "absolute left-1/2"
				},
				rail: {
					root: "sticky bottom-0 left-0 top-0 w-20 h-auto shrink-0 flex-col bg-surface py-0 elevation-0 gap-3",
					label: "flex-col items-center gap-1 flex-[0] text-label-md text-on-surface-variant aria-[current='page']:text-on-surface",
					activeIndicator: "h-8 w-14 rounded-lg",
					icon: "relative flex h-8 w-14 items-center justify-center rounded-lg group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-aria-[current='page']:ifill group-focused:state-focus group-pressed:state-pressed",
					largeBadge: "absolute left-1/2"
				},
				drawer: {
					root: "sticky bottom-0 left-0 top-0 w-[22.5rem] shrink-0 flex-col bg-transparent px-3 py-0 elevation-0 gap-0 h-auto",
					label: `min-h-14 flex-row flex-[0] items-center gap-3 rounded-xl px-4 text-label-lg text-on-surface-variant hover:state-hover aria-[current='page']:text-on-secondary-container focused:state-focus pressed:state-pressed `,
					activeIndicator: "inset-0 h-full rounded-xl force:w-full",
					icon: "h-6 w-6 !ifill-none group-hover:state-none group-focused:state-none group-pressed:state-none ",
					largeBadge: "static ms-auto"
				}
			}
		},
		defaultVariants: {
			variant: "bar"
		}
	},
	{
		responsiveVariants: ["sm", "lg"]
	}
)

const Context = createContext(navigation())

export function NavigationItem({
	children,
	...props
}: ComponentPropsWithoutRef<typeof NavLink> & {
	children?: ReactNode
	className?: string
}) {
	const { label } = useContext(Context)

	return (
		<NavLink {...props} className={label({ className: props.className })}>
			{({ isActive }) => (
				<>
					{isActive && <NavigationActiveIndicator></NavigationActiveIndicator>}
					{children}
					<TouchTarget></TouchTarget>
				</>
			)}
		</NavLink>
	)
}

const NavigationContext = createContext<string | undefined>(undefined)

function NavigationActiveIndicator() {
	const { activeIndicator } = useContext(Context)
	const layoutId = useContext(NavigationContext)

	return (
		<motion.div layoutId={layoutId} className={activeIndicator()}></motion.div>
	)
}

export function NavigationItemIcon(props: ComponentPropsWithoutRef<"div">) {
	const { icon } = useContext(Context)

	return <div {...props} className={icon()}></div>
}

export function Navigation({
	variant,
	...props
}: ComponentPropsWithoutRef<"nav"> & VariantProps<typeof navigation>) {
	const styles = navigation({ variant })

	return (
		<NavigationContext.Provider value={useId()}>
			<Context.Provider value={styles}>
				<nav
					{...props}
					className={styles.root({ className: props.className })}
				></nav>
			</Context.Provider>
		</NavigationContext.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentPropsWithoutRef<"div">
) {
	const { largeBadge } = useContext(Context)

	return <div {...props} className={largeBadge()}></div>
}
