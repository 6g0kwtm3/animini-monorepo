import * as Ariakit from "@ariakit/react"
import { createContext, forwardRef, use, type ReactNode } from "react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"
import MaterialSymbolsArrowBack from "~icons/material-symbols/arrow-back"
import MaterialSymbolsClose from "~icons/material-symbols/close"
import { Icon } from "./Button"

const createSearchView = tv(
	{
		slots: {
			root: "bg-surface-container-high fixed mt-0 flex overflow-hidden",
			input:
				"text-body-lg text-on-surface placeholder:text-body-lg placeholder:text-on-surface-variant w-full bg-transparent p-4 [&::-webkit-search-cancel-button]:ms-4 [&::-webkit-search-cancel-button]:me-0",
			backdrop:
				"bg-scrim/40 opacity-0 transition-[opacity] data-enter:opacity-100",
			body: "text-body-md text-on-surface overflow-auto overscroll-contain",
		},
		variants: {
			variant: {
				fullscreen: {
					input: "h-[4.5rem]",
					root: `inset-0`,
				},
				docked: {
					input: "h-14",
					root: "inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66svh] w-fit max-w-[45rem] min-w-[22.5rem] rounded-xl py-0",
				},
			},
		},
		defaultVariants: { variant: "docked" },
	},
	{ responsiveVariants: ["sm"] }
)

export const SearchViewContext = createContext(createSearchView())

export const SearchViewBody = forwardRef<
	HTMLDivElement,
	Ariakit.ComboboxListProps
>(function SearchViewBody(props, ref) {
	const { body } = use(SearchViewContext)

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
export function SearchViewInput(props: Ariakit.ComboboxProps): ReactNode {
	const { input } = use(SearchViewContext)

	return (
		<>
			<div className="flex items-center px-4">
				<Ariakit.DialogDismiss
					render={
						<Icon label={"Close"}>
							<MaterialSymbolsArrowBack />
						</Icon>
					}
				/>
				<Ariakit.Combobox
					autoSelect={"always"}
					{...props}
					className={input({ className: props.className })}
				/>
				<Ariakit.ComboboxCancel
					render={
						<Icon label={"Clear"}>
							<MaterialSymbolsClose />
						</Icon>
					}
				/>
			</div>
			<div className="border-outline-variant border-b sm:last:hidden" />
		</>
	)
}

export function SearchViewItem(props: Ariakit.ComboboxItemProps): ReactNode {
	return (
		<Ariakit.ComboboxItem
			hideOnClick
			focusOnHover
			blurOnHoverEnd={false}
			{...props}
		/>
	)
}
