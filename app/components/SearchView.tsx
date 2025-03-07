import * as Ariakit from "@ariakit/react"
import type { ReactElement } from "react"
import { createContext, forwardRef, useContext } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import MaterialSymbolsArrowBack from "~icons/material-symbols/arrow-back"
import { Icon } from "./Button"

const tv = createTV({ twMerge: false })

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
					root: "inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66dvh] w-fit min-w-[22.5rem] max-w-[45rem] rounded-xl py-0",
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
	const { input } = useContext(SearchViewContext)
	return (
		<>
			<div className="flex items-center px-4">
				<Ariakit.DialogDismiss render={<Icon />}>
					<MaterialSymbolsArrowBack />
				</Ariakit.DialogDismiss>
				<Ariakit.Combobox
					ref={ref}
					autoSelect={"always"}
					autoFocus
					{...props}
					className={input({ className: props.className })}
				/>
				<Ariakit.ComboboxCancel render={<Icon />} />
			</div>
			<div className="border-b border-outline-variant sm:last:hidden" />
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
