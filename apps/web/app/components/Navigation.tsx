import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext, useId } from "react"

import { TouchTarget } from "~/components/Tooltip"

import { HashNavLink } from "~/lib/search/HashNavLink"
import { tv } from "~/lib/tailwind-variants"

interface NavigationItemProps extends ComponentProps<typeof HashNavLink> {
	icon: ReactNode
	activeIcon: ReactNode
	badge?: ReactNode
}

export function NavigationItem({
	activeIcon,
	icon,
	badge,
	children,
	...props
}: NavigationItemProps) {
	return (
		<Ariakit.ToolbarItem
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
		</Ariakit.ToolbarItem>
	)
}

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

import * as Ariakit from "@ariakit/react"

function NavigationItemIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={tv({ base: "navigation-icon" })()} />
}

export function Navigation({ ...props }: ComponentProps<"nav">): ReactNode {
	return (
		<NavigationContext.Provider value={{ "--id": useId() }}>
			<Ariakit.Toolbar
				orientation="both"
				render={
					<nav
						{...props}
						className={tv({ base: "navigation navigation-bar navigation-end" })(
							{ className: props.className }
						)}
					/>
				}
			/>
		</NavigationContext.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentProps<"div">
): ReactNode {
	return <div {...props} className={tv({ base: "navigation-large-badge" })()} />
}
