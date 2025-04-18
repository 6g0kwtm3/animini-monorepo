import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createContext, forwardRef, useContext, useId } from "react"

import * as Ariakit from "@ariakit/react"

export function MenuList(props: Ariakit.MenuProps): ReactNode {
	const { list } = useContext(Context)

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

export const MenuTrigger = forwardRef<
	HTMLButtonElement,
	Ariakit.MenuButtonProps
>(function MenuTrigger(props, ref): ReactNode {
	const { button } = useContext(Context)

	return (
		<Ariakit.MenuButton
			{...props}
			className={button({ className: props.className })}
			ref={ref}
		/>
	)
})

import { tv } from "~/lib/tailwind-variants"

const createMenu = tv({
	slots: {
		button: "",
		listItem:
			"elevation-2 bg-surface-container text-label-lg text-on-surface hover:state-hover focus:state-focus group inset-[unset] flex h-12 items-center gap-3 px-3",
		list: "bg-surface-container text-label-lg text-on-surface duration-4sm ease-emphasized-accelerate popover-open:transform-none popover-open:opacity-100 popover-open:starting:-translate-y-4 popover-open:starting:opacity-0 max-h-(--popover-avalible-height) rounded-xs transition-discrete top-[anchor(bottom)] z-50 flex min-w-[7rem] max-w-[17.5rem] translate-y-12 flex-col overflow-visible overscroll-contain py-2 opacity-0 motion-safe:transition-all",
	},
})

const Context = createContext(createMenu())

export const MenuListItem = forwardRef<HTMLDivElement, Ariakit.MenuItemProps>(
	function MenuListItem(props, ref): ReactNode {
		const { listItem } = useContext(Context)

		return (
			<Ariakit.MenuItem
				ref={ref}
				{...props}
				className={listItem({ className: props.className })}
			/>
		)
	}
)

export function MenuItemIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="text-on-surface-variant h-6 w-6" />
}
export function MenuItemLeadingIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="text-on-surface-variant i h-6 w-6" />
}
export function MenuItemTrailingIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return (
		<div {...props} className="text-on-surface-variant i ms-auto h-6 w-6" />
	)
}
export function MenuItemTrailingText(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="text-on-surface-variant ms-auto" />
}
export function MenuDivider(props: ComponentPropsWithoutRef<"li">): ReactNode {
	return (
		<li {...props} className="contents">
			<div className="border-outline-variant my-2 w-full border-b" />
		</li>
	)
}
