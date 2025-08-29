import * as Ariakit from "@ariakit/react"

import { tv } from "~/lib/tailwind-variants"
import MaterialSymbolsArrowBack from "~icons/material-symbols/arrow-back"
import { Icon } from "./Button"

interface SearchViewProps extends Ariakit.DialogProps {
	onOpenChange?: Ariakit.DialogStoreProps["setOpen"]
	onSearch?: Ariakit.ComboboxProviderProps["setValue"]
	open?: Ariakit.DialogStoreProps["open"]
}

export function SearchView({ ...props }: SearchViewProps) {
	return (
		<Ariakit.Dialog
			backdrop={<div className={"search-view-backdrop"} />}
			{...props}
			className={tv({ base: "search-view search-view-fullscreen" })({
				className: props.className,
			})}
		>
			<Ariakit.ComboboxProvider
				focusLoop={true}
				includesBaseElement={true}
				open={props.open}
			>
				{props.children}
			</Ariakit.ComboboxProvider>
		</Ariakit.Dialog>
	)
}

export function SearchViewBody(props: Ariakit.ComboboxListProps) {
	return (
		<Ariakit.ComboboxList
			{...props}
			className={tv({ base: "search-view-body" })({
				className: props.className,
			})}
		/>
	)
}

export const SearchViewBodyGroup = Ariakit.ComboboxGroup
const SearchViewBodyGroupLabel = Ariakit.ComboboxGroupLabel

export function SearchViewInput(props: Ariakit.ComboboxProps) {
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

export function SearchViewItem(props: Ariakit.ComboboxItemProps) {
	return (
		<Ariakit.ComboboxItem
			blurOnHoverEnd={false}
			focusOnHover
			hideOnClick
			{...props}
		/>
	)
}
