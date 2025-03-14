import type { NavLink } from "react-router"

import type {
	ComponentProps,
	ComponentPropsWithoutRef,
	CSSProperties,
	ReactNode,
} from "react"
import { createContext, forwardRef, useContext, useId } from "react"

import type { VariantProps } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"
import { createNavigation } from "~/lib/navigation"
import { HashNavLink } from "~/lib/search/HashNavLink"

const Context = createContext(createNavigation())

export const NavigationItem = forwardRef<
	HTMLAnchorElement,
	ComponentProps<typeof NavLink> & {
		children?: ReactNode
		style?: CSSProperties
		className?: string
		icon: ReactNode
		activeIcon: ReactNode
		badge?: ReactNode
	}
>(function NavigationItem(
	{ activeIcon, icon, badge, children, ...props },
	ref
) {
	const { label } = useContext(Context)

	return (
		<HashNavLink
			ref={ref}
			{...props}
			className={label({ className: props.className })}
		>
			<NavigationActiveIndicator />
			<NavigationItemIcon>
				{icon}
				{activeIcon}
			</NavigationItemIcon>
			<div className="max-w-full break-words">{children}</div>
			{badge}
			<TouchTarget />
		</HashNavLink>
	)
})

const NavigationContext = createContext<{ "--id": string } | undefined>(
	undefined
)

function NavigationActiveIndicator() {
	const { activeIndicator } = useContext(Context)
	const style = useContext(NavigationContext)

	return <div className={activeIndicator()} style={style} />
}

export function NavigationItemIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	const { icon } = useContext(Context)

	return <div {...props} className={icon()} />
}
export function Navigation({
	variant,
	...props
}: ComponentPropsWithoutRef<"nav"> &
	VariantProps<typeof createNavigation>): ReactNode {
	const styles = createNavigation({ variant })

	return (
		<NavigationContext.Provider
			value={{
				"--id": useId(),
			}}
		>
			<Context.Provider value={styles}>
				<nav
					{...props}
					className={styles.root({ className: props.className })}
				/>
			</Context.Provider>
		</NavigationContext.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	const { largeBadge } = useContext(Context)

	return <div {...props} className={largeBadge()} />
}
