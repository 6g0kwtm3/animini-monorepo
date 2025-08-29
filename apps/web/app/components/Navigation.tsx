import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext, useId } from "react"

import { TouchTarget } from "~/components/Tooltip"

import { HashNavLink } from "~/lib/search/HashNavLink"
import { tv } from "~/lib/tailwind-variants"

interface NavigationItemProps extends ComponentProps<typeof HashNavLink> {
	activeIcon: ReactNode
	badge?: ReactNode
	icon: ReactNode
}

export function NavigationItem({
	activeIcon,
	badge,
	children,
	icon,
	...props
}: NavigationItemProps) {
	return (
		<Ariakit.CompositeItem
			render={
				<HashNavLink
					{...props}
					className={tv({ base: "navigation-label group" })({
						className: props.className,
					})}
				/>
			}
		>
			<NavigationActiveIndicator />
			<NavigationItemIcon>
				{icon}
				{activeIcon}
			</NavigationItemIcon>
			<div className="max-w-full break-words">{children}</div>
			{badge}
			<TouchTarget />
		</Ariakit.CompositeItem>
	)
}

const NavigationContext = createContext<undefined | { "--id": string }>(
	undefined
)

export function Navigation({ ...props }: ComponentProps<"nav">): ReactNode {
	return (
		<NavigationContext.Provider value={{ "--id": useId() }}>
			<Ariakit.CompositeProvider>
				<Ariakit.Composite
					render={
						<nav
							{...props}
							className={tv({
								base: "navigation navigation-bar navigation-end",
							})({ className: props.className })}
						/>
					}
				/>
			</Ariakit.CompositeProvider>
		</NavigationContext.Provider>
	)
}

import * as Ariakit from "@ariakit/react"

export function NavigationItemLargeBadge(
	props: ComponentProps<"div">
): ReactNode {
	return <div {...props} className={tv({ base: "navigation-large-badge" })()} />
}

function NavigationActiveIndicator() {
	const style = useContext(NavigationContext)

	return (
		<div
			className={tv({ base: "navigation-active-indicator" })()}
			style={style}
		/>
	)
}

function NavigationItemIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={tv({ base: "navigation-icon" })()} />
}
