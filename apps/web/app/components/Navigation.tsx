import type { ComponentProps, ReactNode } from "react"
import { createContext, forwardRef, useContext, useId } from "react"

import { TouchTarget } from "~/components/Tooltip"

import { HashNavLink } from "~/lib/search/HashNavLink"
import { tv } from "~/lib/tailwind-variants"

interface NavigationItemProps extends ComponentProps<typeof HashNavLink> {
	icon: ReactNode
	activeIcon: ReactNode
	badge?: ReactNode
}

export const NavigationItem = forwardRef<
	HTMLAnchorElement,
	NavigationItemProps
>(function NavigationItem(
	{ activeIcon, icon, badge, children, ...props }: NavigationItemProps,
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

export function NavigationItemIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={tv({ base: "navigation-icon" })()} />
}
export function Navigation({ ...props }: ComponentProps<"nav">): ReactNode {
	return (
		<NavigationContext.Provider value={{ "--id": useId() }}>
			<nav
				{...props}
				className={tv({ base: "navigation navigation-bar navigation-end" })({
					className: props.className,
				})}
			/>
		</NavigationContext.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentProps<"div">
): ReactNode {
	return <div {...props} className={tv({ base: "navigation-large-badge" })()} />
}
