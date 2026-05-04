import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext, useId } from "react"

import * as Ariakit from "@ariakit/react"

export function MenuList(props: Ariakit.MenuProps): ReactNode {
	const { list } = useContext(Context)

	return (
		<Ariakit.Menu {...props} className={list({ className: props.className })} />
	)
}

const MenuContext = createContext<string | undefined>(undefined)
MenuContext.displayName = "MenuContext"

export function Menu(props: Ariakit.MenuProviderProps): ReactNode {
	const menuId = useId()

	return (
		<MenuContext.Provider value={menuId}>
			<Ariakit.MenuProvider {...props} />
		</MenuContext.Provider>
	)
}

export function MenuTrigger(props: Ariakit.MenuButtonProps): ReactNode {
	const { button } = useContext(Context)

	return (
		<Ariakit.MenuButton
			{...props}
			className={button({ className: props.className })}
		/>
	)
}

import { media, state, tokens, utilities } from "@anitrove/design"
import { ancestor, Marker, precompileStyles } from "@anitrove/unstyled"
import { tv } from "~/lib/tailwind-variants"

const listGroupMarker = new Marker()

const listItemStyles = precompileStyles({
	backgroundColor: tokens.colors["surface-container"],
	color: tokens.colors["on-surface"],
	inset: "unset",
	display: "flex",
	height: "3rem",
	alignItems: "center",
	gap: ".5rem",
	...utilities.paddingX(".75rem"),
	transitionProperty: { [media.motionSafe]: "border-radius" },
	borderRadius: {
		[media.hover]: tokens.borderRadius.xs,
		[ancestor("&:first-child", listGroupMarker)]: {
			["&:first-child"]: tokens.borderRadius.md,
		},
	},
	...tokens.transitions.spatial.fast,
	...tokens.typescale["label-lg"],
	...state({
		default: "none",
		[media.hover]: "hover",
		[media["focus-visible"]]: "focus",
	}),
})

const listGroupStyles = precompileStyles({})

const listStyles = precompileStyles({})

const createMenu = tv({
	slots: {
		button: "",
		listItem:
			"elevation-2 bg-surface-container text-label-lg text-on-surface hover:state-hover focused:state-focus focused:rounded-md ease-spatial-fast duration-spatial-fast inset-[unset] flex h-12 items-center gap-2 px-3 hover:rounded-xs motion-safe:transition-all",
		listGroup:
			"bg-surface-container ease-spatial-fast duration-spatial-fast flex flex-col gap-0.5 rounded-sm px-1 py-0.5 first:border-t-[var(--border)] last:border-b-[var(--border)] motion-safe:transition-all",
		list: "group text-label-lg text-on-surface ease-spatial-fast duration-spatial-fast popover-open:transform-none popover-open:opacity-100 popover-open:starting:-translate-y-4 popover-open:starting:opacity-0 top-[anchor(bottom)] z-50 flex max-h-(--popover-available-height) max-w-[17.5rem] min-w-[7rem] translate-y-0 flex-col gap-0.5 overflow-visible overscroll-contain rounded-xs opacity-0 transition-discrete hover:not-has-[.group:hover]:[--border:1rem] motion-safe:transition-all",
	},
})

const Context = createContext(createMenu())
Context.displayName = "Context"

export function MenuListGroupItem({
	children,
	...props
}: Ariakit.MenuItemProps): ReactNode {
	const { listItem } = useContext(Context)

	return (
		<Ariakit.MenuItem
			{...props}
			className={listItem({ className: props.className })}
		>
			{children}
		</Ariakit.MenuItem>
	)
}

export function MenuListGroup({
	children,
	...props
}: Ariakit.MenuGroupProps): ReactNode {
	const { listGroup } = useContext(Context)

	return (
		<Ariakit.MenuGroup
			{...props}
			className={listGroup({ className: props.className })}
		>
			{children}
		</Ariakit.MenuGroup>
	)
}

function MenuItemIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className="text-on-surface-variant h-6 w-6" />
}
export function MenuItemLeadingIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className="text-on-surface-variant i-5 h-5 w-6" />
}
export function MenuItemTrailingIcon(props: ComponentProps<"div">): ReactNode {
	return (
		<div {...props} className="text-on-surface-variant i-5 ms-auto h-5 w-5" />
	)
}
export function MenuItemTrailingText(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className="text-on-surface-variant ms-auto" />
}
export function MenuDivider(props: ComponentProps<"li">): ReactNode {
	return (
		<li {...props} className="contents">
			<div className="border-outline-variant my-2 w-full border-b" />
		</li>
	)
}
