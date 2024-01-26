import * as Ariakit from "@ariakit/react"
import {
	Link,
	useFetcher,
	useLocation,
	useSearchParams
} from "@remix-run/react"
import { nonNull } from "../urql"

import type { ComponentPropsWithoutRef, ElementRef } from "react"
import { forwardRef, useEffect, useRef, useState } from "react"
import { ButtonIcon, ButtonText } from "~/components/Button"
import type { loader as searchLoader } from "~/routes/search"
import { dialog } from "../dialog"

import { tv } from "tailwind-variants"
import List from "~/components/List"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger
} from "~/components/Tooltip"
import { list } from "../list"

const { backdrop, body } = dialog({})

const searchView = tv(
	{
		slots: {
			container:
				"fixed mt-0 flex overflow-hidden bg-surface-container-high elevation-3",
			input:
				"w-full bg-transparent p-4 text-body-lg text-on-surface outline-none placeholder:text-body-lg placeholder:text-on-surface-variant [&::-webkit-search-cancel-button]:me-0 [&::-webkit-search-cancel-button]:ms-4"
		},
		variants: {
			variant: {
				fullscreen: {
					input: "h-[4.5rem]",
					container: `inset-0`
				},
				docked: {
					input: "h-14",
					container:
						"inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66dvh] w-fit min-w-[22.5rem] max-w-[45rem] rounded-xl py-0"
				}
			}
		},
		defaultVariants: { variant: "docked" }
	},
	{ responsiveVariants: ["sm"] }
)

const { input: search, container: root } = searchView({
	variant: { initial: "fullscreen", sm: "docked" }
})

const SearchInput = forwardRef<
	HTMLInputElement,
	ComponentPropsWithoutRef<typeof Ariakit.FormInput>
>(function SearchInput(props, ref) {
	return (
		<Ariakit.FormInput
			placeholder="Search"
			ref={ref}
			results={5}
			{...props}
			type="search"
			className={search({ className: props.className })}
		/>
	)
})

export function Search() {
	const [searchParams] = useSearchParams()

	const store = Ariakit.useFormStore({
		defaultValues: { q: searchParams.get("q") ?? "" }
	})

	const submit = useFetcher<typeof searchLoader>()

	// store.onSubmit((state) => {
	// 	submit.submit(state.values, {})
	// })

	let [show, setShow] = useState(false)
	let ref = useRef<ElementRef<"input">>(null)

	let location = useLocation()

	useEffect(() => {
		setShow(false)
	}, [location])

	// bind command + k
	useEffect(() => {
		let listener = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				setShow(true)
			}
		}
		window.addEventListener("keydown", listener)
		return () => window.removeEventListener("keydown", listener)
	}, [])

	const found = submit.data?.Page?.media?.filter(nonNull)
	return (
		<>
			<TooltipPlain>
				<TooltipPlainTrigger
					onClick={() => {
						setShow(true)
					}}
					render={<ButtonText></ButtonText>}
				>
					<ButtonText.Icon>search</ButtonText.Icon>
					Search
				</TooltipPlainTrigger>
				<TooltipPlainContainer>
					<kbd>Ctrl</kbd>+<kbd className="font-bold">K</kbd>
				</TooltipPlainContainer>
			</TooltipPlain>

			<Ariakit.Dialog
				open={show}
				onClose={() => setShow(false)}
				className={root({
					className: ``
				})}
				initialFocus={ref}
				backdrop={<div className={backdrop()} />}
			>
				<div className={"flex w-full flex-col"}>
					<Ariakit.Form
						store={store}
						render={<submit.Form action="/search"></submit.Form>}
						className="flex items-center"
					>
						<Ariakit.DialogDismiss
							render={<ButtonIcon className="-me-2 ms-2 h-10" />}
						>
							arrow_back
						</Ariakit.DialogDismiss>

						<SearchInput
							ref={ref}
							placeholder="Search anime or manga"
							onChange={(e) => submit.submit(e.currentTarget.form, {})}
							type="search"
							name={store.names.q}
						/>
					</Ariakit.Form>
					<div className="border-b border-outline-variant sm:last:hidden"></div>
					{(found?.length ?? 0) > 0 && (
						<>
							<div className={body({})}>
								<List className="-mx-6">
									{submit.data?.Page?.media?.filter(nonNull).map((media) => (
										<li
											key={media.id}
											className="col-span-full grid grid-cols-subgrid"
										>
											<Link
												prefetch="intent"
												to={`/media/${media.id}/`}
												className={item({ className: "items-center" })}
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
												<div className="col-span-2 col-start-2">
													<div
														className="line-clamp-1 text-body-lg text-on-surface"
														dangerouslySetInnerHTML={{
															__html:
																media.title?.userPreferred ??
																media.title?.romaji
														}}
													>
														{}
													</div>
													<div className="text-body-md text-on-surface-variant">
														{media.type?.toLowerCase()}
													</div>
												</div>
											</Link>
										</li>
									))}
								</List>
							</div>
						</>
					)}
				</div>
			</Ariakit.Dialog>
		</>
	)
}

const { item } = list()
