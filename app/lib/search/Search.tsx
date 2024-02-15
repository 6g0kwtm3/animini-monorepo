import * as Ariakit from "@ariakit/react"
import {
	Await,
	Link,
	useFetcher,
	useLocation,
	useNavigate,
	useRouteLoaderData,
	useSearchParams
} from "@remix-run/react"

import type { ComponentPropsWithoutRef, ElementRef, FocusEvent } from "react"
import { Suspense, forwardRef, useEffect, useRef } from "react"
import { ButtonIcon, ButtonTextIcon } from "~/components/Button"
import type { loader as searchLoader } from "~/routes/search"
import { createDialog } from "../dialog"

import { Predicate, ReadonlyArray } from "effect"
import { createTV } from "tailwind-variants"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger
} from "~/components/Tooltip"
import type { FragmentType } from "~/lib/graphql"
import { graphql, useFragment } from "~/lib/graphql"
import { createList } from "../list"

import { serverOnly$ } from "vite-env-only"
import type { loader as navLoader } from "~/routes/_nav"
import { button } from "../button"
import { route_media } from "../route"

const tv = createTV({ twMerge: false })

const { backdrop, body } = createDialog({})

const createSearchView = tv(
	{
		slots: {
			root: "fixed mt-0 flex overflow-hidden bg-surface-container-high elevation-3",
			input:
				"w-full bg-transparent p-4 text-body-lg text-on-surface outline-none placeholder:text-body-lg placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:me-0 [&::-webkit-search-cancel-button]:ms-4"
		},
		variants: {
			variant: {
				fullscreen: {
					input: "h-[4.5rem]",
					root: `inset-0`
				},
				docked: {
					input: "h-14",
					root: "inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66dvh] w-fit min-w-[22.5rem] max-w-[45rem] rounded-xl py-0"
				}
			}
		},
		defaultVariants: { variant: "docked" }
	},
	{ responsiveVariants: ["sm"] }
)

const { input: search, root } = createSearchView({
	variant: { initial: "fullscreen", sm: "docked" }
})

export interface SelectProps extends Ariakit.ComboboxProps {
	value?: string
	setValue?: (value: string) => void
	defaultValue?: string
	onBlur?: React.FocusEventHandler<HTMLElement>
}

const Select = forwardRef<HTMLInputElement, SelectProps>(function Select(
	this: Function,
	{ children, value, setValue, defaultValue, ...props },
	ref
) {
	const store = Ariakit.useComboboxContext()

	if (!store)
		throw new Error(`${this.name} must be wrapped in ComboboxProvider`)

	// const storeValue = store.useState("value")

	// useEffect(() => {
	// 	if (storeValue !== value) {
	// 		setValue?.(storeValue)
	// 		store.setValue(value)
	// 	}
	// }, [setValue, store, storeValue, value])

	const onBlur = (event: FocusEvent<HTMLElement>) => {
		const { popoverElement } = store.getState()
		if (popoverElement?.contains(event.relatedTarget)) return
		props.onBlur?.(event)
	}

	return (
		<Ariakit.Combobox
			autoSelect
			ref={ref}
			{...props}
			store={store}
			onBlur={onBlur}
			className={search({ className: props.className })}
		/>
	)
})

const SearchInput = forwardRef<
	HTMLInputElement,
	ComponentPropsWithoutRef<typeof Select> & {
		name: string
	}
>(function SearchInput(this: Function, { name, ...props }, ref) {
	const form = Ariakit.useFormContext()
	if (!form) throw new Error(`${this.name} must be used within a Form`)

	const value = form.useValue(name)

	const select = (
		<Select
			placeholder="Search"
			ref={ref}
			value={value}
			setValue={(value) => form.setValue(name, value)}
			{...props}
		/>
	)

	return (
		<>
			<Ariakit.FormControl name={name} render={select} />
		</>
	)
})

export function Search() {
	const [searchParams] = useSearchParams()

	const store = Ariakit.useFormStore({
		defaultValues: { q: searchParams.get("q") ?? "" }
	})

	const submit = useFetcher<typeof searchLoader>()

	let ref = useRef<ElementRef<"input">>(null)

	let location = useLocation()
	let navigate = useNavigate()

	const show = location.hash === "#search"

	// bind command + k
	useEffect(() => {
		let listener = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				navigate({ hash: "#search" })
			}
		}
		window.addEventListener("keydown", listener)
		return () => window.removeEventListener("keydown", listener)
	}, [navigate])

	const media = submit.data?.page?.media?.filter(Predicate.isNotNull) ?? []

	const data = useRouteLoaderData<typeof navLoader>("routes/_nav")

	return (
		<>
			<TooltipPlain>
				<TooltipPlainTrigger
					className={button()}
					render={<Link to="#search"></Link>}
				>
					<ButtonTextIcon>search</ButtonTextIcon>
					Search
				</TooltipPlainTrigger>
				<TooltipPlainContainer>
					<kbd>Ctrl</kbd>+<kbd className="font-bold">K</kbd>
				</TooltipPlainContainer>
			</TooltipPlain>

			<Ariakit.Dialog
				open={show}
				onClose={() => {
					navigate({ pathname: location.pathname, search: location.search })
				}}
				className={root({
					className: ``
				})}
				initialFocus={ref}
				backdrop={<div className={backdrop()} />}
			>
				<Ariakit.Form
					store={store}
					render={<submit.Form action="/search"></submit.Form>}
					className={"flex w-full flex-col"}
				>
					<Ariakit.ComboboxProvider
						focusLoop={false}
						includesBaseElement={false}
						resetValueOnHide={true}
						open
					>
						<div className="flex items-center">
							<Ariakit.DialogDismiss
								render={<ButtonIcon className="-me-2 ms-2 h-10" />}
							>
								arrow_back
							</Ariakit.DialogDismiss>

							<SearchInput
								ref={ref}
								placeholder="Search anime or manga"
								onChange={(e) => submit.submit(e.currentTarget.form, {})}
								name={store.names.q}
							/>
							<Ariakit.ComboboxCancel
								render={<ButtonIcon className="-ms-2 me-2 h-10" />}
							/>
						</div>
						<div className="border-b border-outline-variant sm:last:hidden"></div>

						{ReadonlyArray.isNonEmptyArray(media) ? (
							<Ariakit.ComboboxList className={body({})}>
								<Ariakit.ComboboxGroup
									className={listRoot({ className: "-mx-6" })}
								>
									<Ariakit.ComboboxGroupLabel
										className={item({
											className: "-mt-2 force:hover:state-none"
										})}
									>
										<div className="col-span-full text-body-md text-on-surface-variant">
											Results
										</div>
									</Ariakit.ComboboxGroupLabel>
									{media.map((media) => (
										<SearchItem media={media} key={media.id}></SearchItem>
									))}
								</Ariakit.ComboboxGroup>
							</Ariakit.ComboboxList>
						) : data ? (
							<Suspense fallback="">
								<Await resolve={data.trending} errorElement="">
									{(trending) =>
										ReadonlyArray.isNonEmptyArray(trending?.media) && (
											<Ariakit.ComboboxList className={body({})}>
												<Ariakit.ComboboxGroup
													className={listRoot({ className: "-mx-6" })}
												>
													<Ariakit.ComboboxGroupLabel
														className={item({
															className: "-mt-2 force:hover:state-none"
														})}
													>
														<div className="col-span-full text-body-md text-on-surface-variant">
															Trending
														</div>
													</Ariakit.ComboboxGroupLabel>
													{trending.media
														.filter(Predicate.isNotNull)
														.map((media) => (
															<SearchItem
																media={media}
																key={media.id}
															></SearchItem>
														))}
												</Ariakit.ComboboxGroup>
											</Ariakit.ComboboxList>
										)
									}
								</Await>
							</Suspense>
						) : null}
					</Ariakit.ComboboxProvider>
				</Ariakit.Form>
			</Ariakit.Dialog>
		</>
	)
}
const {
	item,
	root: listRoot,
	trailingSupportingText,

	itemTitle
} = createList({ lines: "one" })

const SearchItem_media = serverOnly$(
	graphql(`
		fragment SearchItem_media on Media {
			id
			type
			coverImage {
				medium
				extraLarge
			}
			title {
				userPreferred
			}
		}
	`)
)

function SearchItem(props: { media: FragmentType<typeof SearchItem_media> }) {
	const media = useFragment<typeof SearchItem_media>(props.media)

	return (
		<Ariakit.ComboboxItem
			key={media.id}
			className={item({})}
			hideOnClick
			focusOnHover
			blurOnHoverEnd={false}
			render={
				<Link
					to={route_media({ id: media.id })}
					title={media.title?.userPreferred ?? undefined}
				/>
			}
		>
			{media.coverImage?.extraLarge ? (
				<div className="col-start-1 flex h-10 w-10">
					<img
						src={media.coverImage.extraLarge}
						alt=""
						className="h-10 w-10 rounded-full bg-[image:--bg] bg-cover object-cover"
						style={{
							"--bg": `url(${media.coverImage.medium})`
						}}
						loading="lazy"
					/>
				</div>
			) : (
				<div className="col-start-1 flex h-10 w-10 items-center justify-center rounded-full bg-error">
					<div className="i text-on-error">error</div>
				</div>
			)}

			<div className="col-start-2 grid grid-cols-subgrid">
				<div className={itemTitle()}>{media.title?.userPreferred}</div>
			</div>

			{media.type && (
				<div className={trailingSupportingText()}>
					{media.type.toLowerCase()}
				</div>
			)}
		</Ariakit.ComboboxItem>
	)
}
