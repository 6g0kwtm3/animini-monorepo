import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createContext, forwardRef, useContext, useId } from "react"

import { createTV } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"

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

const tv = createTV({ twMerge: false })

const createMenu = tv({
	slots: {
		button: "",
		listItem:
			"elevation-2 group inset-[unset] flex h-12 items-center gap-3 bg-surface-container px-3 text-label-lg text-on-surface hover:state-hover focus:state-focus",
		list: "allow-discrete top-[anchor(bottom)] z-50 flex max-h-[--popover-avalible-height] min-w-[7rem] max-w-[17.5rem] translate-y-12 flex-col overflow-visible overscroll-contain rounded-xs bg-surface-container py-2 text-label-lg text-on-surface opacity-0 duration-4sm ease-emphasized-accelerate popover-open:transform-none popover-open:opacity-100 popover-open:starting:-translate-y-4 popover-open:starting:opacity-0 motion-safe:transition-all",
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
				className={listItem({
					className: props.className,
				})}
			/>
		)
	}
)

export function MenuItemIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="h-6 w-6 text-on-surface-variant" />
}
export function MenuItemLeadingIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="h-6 w-6 text-on-surface-variant i" />
}
export function MenuItemTrailingIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return (
		<div {...props} className="ms-auto h-6 w-6 text-on-surface-variant i" />
	)
}
export function MenuItemTrailingText(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	return <div {...props} className="ms-auto text-on-surface-variant" />
}
export function MenuDivider(props: ComponentPropsWithoutRef<"li">): ReactNode {
	return (
		<li {...props} className="contents">
			<div className="my-2 w-full border-b border-outline-variant" />
		</li>
	)
}
