import type { ComponentProps, ReactNode } from "react"
import { createContext, use, useId } from "react"

import { Ariakit } from "~/lib/ariakit"
import { tv } from "~/lib/tailwind-variants"

export function MenuList(props: Ariakit.MenuProps): ReactNode {
	const { list } = use(Context)

	return (
		<Ariakit.Menu {...props} className={list({ className: props.className })} />
	)
}

const MenuContext = createContext<string | undefined>(undefined)

export function Menu(props: Ariakit.MenuProviderProps): ReactNode {
	const menuId = useId()

	return (
		<MenuContext.Provider value={menuId}>
			<Ariakit.MenuProvider {...props} />
		</MenuContext.Provider>
	)
}

export function MenuTrigger(props: Ariakit.MenuButtonProps): ReactNode {
	const { button } = use(Context)

	return (
		<Ariakit.MenuButton
			{...props}
			className={button({ className: props.className })}
		/>
	)
}

const createMenu = tv({
	slots: {
		button: "",
		listItem:
			"elevation-2 group bg-surface-container text-label-lg text-on-surface hover:state-hover focus:state-focus inset-[unset] flex h-12 items-center gap-3 px-3",
		list: "allow-discrete bg-surface-container text-label-lg text-on-surface duration-4sm ease-emphasized-accelerate top-[anchor(var(--anchor)_bottom)] right-[anchor(var(--anchor)_right)] z-50 flex max-h-(--popover-avalible-height) max-w-[17.5rem] min-w-[7rem] translate-y-12 flex-col overflow-visible overscroll-contain rounded-xs py-2 opacity-0 [position-try-options:flip-block,flip-inline] open:transform-none open:opacity-100 motion-safe:transition-all open:starting:-translate-y-4 open:starting:opacity-0",
	},
})

const Context = createContext(createMenu())

export function MenuListItem(props: Ariakit.MenuItemProps): ReactNode {
	const { listItem } = use(Context)

	return (
		<Ariakit.MenuItem
			{...props}
			className={listItem({
				className: props.className,
			})}
		/>
	)
}

export function MenuItemIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className="text-on-surface-variant h-6 w-6" />
}
export function MenuItemLeadingIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className="text-on-surface-variant i h-6 w-6" />
}
export function MenuItemTrailingIcon(props: ComponentProps<"div">): ReactNode {
	return (
		<div {...props} className="text-on-surface-variant i ms-auto h-6 w-6" />
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
