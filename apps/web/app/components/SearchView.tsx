import * as Ariakit from "@ariakit/react"
import { forwardRef } from "react"

import { tv } from "~/lib/tailwind-variants"
import MaterialSymbolsArrowBack from "~icons/material-symbols/arrow-back"
import { Icon } from "./Button"

export const SearchViewBody = forwardRef<HTMLDivElement>(
	function SearchViewBody(props: Ariakit.ComboboxListProps, ref) {
		return (
			<Ariakit.ComboboxList
				ref={ref}
				{...props}
				className={tv({ base: "search-view-body" })({
					className: props.className,
				})}
			/>
		)
	}
)

interface SearchViewProps extends Ariakit.DialogProps {
	open?: Ariakit.DialogStoreProps["open"]
	onOpenChange?: Ariakit.DialogStoreProps["setOpen"]
	onSearch?: Ariakit.ComboboxProviderProps["setValue"]
}

export const SearchView = forwardRef<HTMLDivElement>(function SearchView(
	{ ...props }: SearchViewProps,
	ref
) {
	return (
		<Ariakit.Dialog
			ref={ref}
			backdrop={<div className={"search-view-backdrop"} />}
			{...props}
			className={tv({ base: "search-view search-view-fullscreen" })({
				className: props.className,
			})}
		>
			<Ariakit.ComboboxProvider
				focusLoop={true}
				open={props.open}
				includesBaseElement={true}
			>
				{props.children}
			</Ariakit.ComboboxProvider>
		</Ariakit.Dialog>
	)
})

export const SearchViewBodyGroup = Ariakit.ComboboxGroup
export const SearchViewBodyGroupLabel = Ariakit.ComboboxGroupLabel

export const SearchViewInput = forwardRef<HTMLInputElement>(
	function SearchViewInput(props: Ariakit.ComboboxProps, ref) {
		const { autoFocus = true } = props

		return (
			<>
				<div className="flex items-center px-4">
					<Ariakit.DialogDismiss
						autoFocus={!autoFocus}
						render={<Icon title="Close search" tooltip />}
					>
						<MaterialSymbolsArrowBack />
					</Ariakit.DialogDismiss>
					<Ariakit.Combobox
						ref={ref}
						autoSelect={"always"}
						{...props}
						autoFocus={autoFocus}
						className={tv({ base: "search-view-input" })({
							className: props.className,
						})}
					/>
					<Ariakit.ComboboxCancel
						render={<Icon title="Clear search" tooltip />}
					/>
				</div>
				<div className="border-outline-variant border-b sm:last:hidden" />
			</>
		)
	}
)

export const SearchViewItem = forwardRef<HTMLDivElement>(
	function SearchViewItem(props: Ariakit.ComboboxItemProps, ref) {
		return (
			<Ariakit.ComboboxItem
				ref={ref}
				hideOnClick
				focusOnHover
				blurOnHoverEnd={false}
				{...props}
			/>
		)
	}
)
