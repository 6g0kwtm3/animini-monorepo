import * as Ariakit from "@ariakit/react"
import { Icon } from "m3-react"
import type { ReactElement } from "react"
import { forwardRef, useContext } from "react"
import type { VariantProps } from "tailwind-variants"
import MaterialSymbolsArrowBack from "~icons/material-symbols/arrow-back"

import { SearchViewContext, createSearchView } from "~/lib/searchView"

export const SearchViewBody = forwardRef<
	HTMLDivElement,
	Ariakit.ComboboxListProps
>(function SearchViewBody(props, ref) {
	const { body } = useContext(SearchViewContext)

	return (
		<Ariakit.ComboboxList
			ref={ref}
			{...props}
			className={body({ className: props.className })}
		/>
	)
})

export const SearchView = forwardRef<
	HTMLDivElement,
	Ariakit.DialogProps & {
		open?: Ariakit.DialogStoreProps["open"]
		onOpenChange?: Ariakit.DialogStoreProps["setOpen"]
		onSearch?: Ariakit.ComboboxProviderProps["setValue"]
	} & VariantProps<typeof createSearchView>
>(function SearchView({ variant, ...props }, ref) {
	const styles = createSearchView({ variant })

	return (
		<SearchViewContext.Provider value={styles}>
			<Ariakit.Dialog
				ref={ref}
				backdrop={<div className={styles.backdrop()} />}
				{...props}
				className={styles.root({ className: props.className })}
			>
				<Ariakit.ComboboxProvider
					focusLoop={true}
					open={props.open}
					includesBaseElement={true}
				>
					{props.children}
				</Ariakit.ComboboxProvider>
			</Ariakit.Dialog>
		</SearchViewContext.Provider>
	)
})

export const SearchViewBodyGroup = Ariakit.ComboboxGroup
export const SearchViewBodyGroupLabel = Ariakit.ComboboxGroupLabel

export const SearchViewInput = forwardRef<
	HTMLInputElement,
	Ariakit.ComboboxProps
>(function SearchViewInput(props, ref) {
	const { autoFocus = true } = props
	const { input } = useContext(SearchViewContext)
	return (
		<>
			<div className="flex items-center px-4">
				<Ariakit.DialogDismiss autoFocus={!autoFocus} render={<Icon />}>
					<MaterialSymbolsArrowBack />
				</Ariakit.DialogDismiss>
				<Ariakit.Combobox
					ref={ref}
					autoSelect={"always"}
					{...props}
					autoFocus={autoFocus}
					className={input({ className: props.className })}
				/>
				<Ariakit.ComboboxCancel render={<Icon />} />
			</div>
			<div className="border-outline-variant border-b sm:last:hidden" />
		</>
	)
})

export const SearchViewItem = forwardRef<
	HTMLDivElement,
	Ariakit.ComboboxItemProps & {
		render?: ReactElement<any>
	}
>(function SearchViewItem(props, ref) {
	return (
		<Ariakit.ComboboxItem
			ref={ref}
			hideOnClick
			focusOnHover
			blurOnHoverEnd={false}
			{...props}
		/>
	)
})
