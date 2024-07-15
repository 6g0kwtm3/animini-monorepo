import * as Ariakit from "@ariakit/react"
import { createContext, forwardRef, use, type ReactNode } from "react"
import { tv } from "~/lib/tailwind-variants"
import MaterialSymbolsArrowBack from "~icons/material-symbols/arrow-back"
import MaterialSymbolsClose from "~icons/material-symbols/close"
import { Icon } from "./Button"
import type { VariantProps } from "tailwind-variants"
import { btnIcon } from "~/lib/button"

const createSearchView = tv(
	{
		slots: {
			root: "fixed mt-0 flex overflow-hidden bg-surface-container-high",
			input:
				"w-full bg-transparent p-4 text-body-lg text-on-surface placeholder:text-body-lg placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:me-0 [&::-webkit-search-cancel-button]:ms-4",
			backdrop:
				"bg-scrim/40 opacity-0 transition-[opacity] data-[enter]:opacity-100",
			body: "overflow-auto overscroll-contain text-body-md text-on-surface",
		},
		variants: {
			variant: {
				fullscreen: {
					input: "h-[4.5rem]",
					root: `inset-0`,
				},
				docked: {
					input: "h-14",
					root: "inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66svh] w-fit min-w-[22.5rem] max-w-[45rem] rounded-xl py-0",
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
		onSearch?: Ariakit.ComboboxProviderProps["setValue"]
	} & VariantProps<typeof createSearchView>
>(function SearchView({ variant, defaultValue, onSearch, ...props }, ref) {
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
				<Ariakit.DialogDismiss className={btnIcon()}>
					<span className="sr-only">Close</span>
					<MaterialSymbolsArrowBack />
				</Ariakit.DialogDismiss>
				<Ariakit.Combobox
					autoSelect={"always"}
					{...props}
					className={input({ className: props.className })}
				/>
				<Ariakit.ComboboxCancel
					render={
						<Icon>
							<span className="sr-only">Clear</span>
							<MaterialSymbolsClose />
						</Icon>
					}
				/>
			</div>
			<div className="border-b border-outline-variant sm:last:hidden" />
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
