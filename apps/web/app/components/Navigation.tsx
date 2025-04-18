import type { NavLink } from "react-router"

import type {
	ComponentProps,
	ComponentPropsWithoutRef,
	CSSProperties,
	ReactNode,
} from "react"
import { createContext, forwardRef, useContext, useId } from "react"

import { TouchTarget } from "~/components/Tooltip"

import { HashNavLink } from "~/lib/search/HashNavLink"
import { tv } from "~/lib/tailwind-variants"

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
	return (
		<HashNavLink
			ref={ref}
			{...props}
			className={tv({ base: "navigation-label group" })({
				className: props.className,
			})}
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
	const style = useContext(NavigationContext)

	return (
		<div
			style={style}
			className={tv({ base: "navigation-active-indicator" })()}
		/>
	)
}

export function NavigationItemIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className={tv({ base: "navigation-icon" })()} />
}
export function Navigation({
	...props
}: ComponentPropsWithoutRef<"nav">): ReactNode {
	return (
		<NavigationContext.Provider
			value={{
				"--id": useId(),
			}}
		>
			<nav
				{...props}
				className={tv({
					base: "navigation navigation-bar navigation-end",
				})({ className: props.className })}
			/>
		</NavigationContext.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return (
		<div
			{...props}
			className={tv({
				base: "navigation-large-badge",
			})()}
		/>
	)
}
