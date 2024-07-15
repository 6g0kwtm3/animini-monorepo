import * as Ariakit from "@ariakit/react"
import {
	Await,
	Form,
	useFetcher,
	useNavigate,
	useRouteLoaderData,
} from "@remix-run/react"

import type { ComponentProps, ComponentRef, ReactNode } from "react"
import { Suspense, useEffect, useRef } from "react"
import ReactRelay from "react-relay"
import type { clientLoader as searchLoader } from "~/routes/_nav.search/route"

import { Array as ReadonlyArray } from "effect"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"

import {
	SearchView,
	SearchViewBody,
	SearchViewBodyGroup,
	SearchViewInput,
	SearchViewItem,
} from "~/components/SearchView"
import { copySearchParams } from "~/lib/copySearchParams"
import type { clientLoader as navLoader } from "~/routes/_nav/route"
import { M3 } from "../components"

import { createList, ListContext } from "../list"
import { SearchItem } from "./SearchItem"
import { SearchTrending } from "./SearchTrending"
import { useOptimisticSearchParams } from "./useOptimisticSearchParams"

const { graphql } = ReactRelay

export function Search(): ReactNode {
	const searchParams = useOptimisticSearchParams()

	const submit = useFetcher<typeof searchLoader>()

	let ref = useRef<ComponentRef<"input">>(null)

	const show = searchParams.get("sheet") === "search"
	searchParams.delete("sheet")

	const sheetParams = copySearchParams(searchParams)
	sheetParams.set("sheet", "search")
	const navigate = useNavigate()

	// bind command + k
	useEffect(() => {
		let listener = (event: KeyboardEvent) => {
			if (
				(event.metaKey || event.ctrlKey) &&
				event.key.toLocaleLowerCase() === "k"
			) {
				event.preventDefault()
				navigate({ search: `?${sheetParams}` })
			}
		}
		window.addEventListener("keydown", listener)
		return () => window.removeEventListener("keydown", listener)
	}, [navigate, sheetParams])

	const media = submit.data?.page?.media?.filter((el) => el != null) ?? []

	const data = useRouteLoaderData<typeof navLoader>("routes/_nav")

	const list = createList({ lines: "one" })

	return (
		<SearchView
			aria-label="Search anime or manga"
			open={show}
			onClose={() => {
				navigate({ search: `?${searchParams}` })
			}}
			initialFocus={ref.current}
			variant={{
				initial: "fullscreen",
				sm: "docked",
			}}
			defaultValue={searchParams.get("q") ?? ""}
		>
			<Form role="search" action="/search" className={"flex w-full flex-col"}>
				<SearchViewInput
					ref={ref}
					placeholder="Search anime or manga"
					onChange={(e) => submit.submit(e.currentTarget.form, {})}
					name="q"
				/>

				{ReadonlyArray.isNonEmptyArray(media) ? (
					<SearchViewBody>
						<SearchViewBodyGroup>
							<Ariakit.ComboboxGroupLabel
								render={<M3.Subheader lines={"one"} />}
							>
								Results
							</Ariakit.ComboboxGroupLabel>

							<ListContext value={list}>
								<div
									className={list.root({
										className: "-mt-2",
									})}
								>
									{media.map((media) => (
										<SearchViewItem
											key={media.id}
											data-id={media.id}
											render={<SearchItem media={media} />}
										/>
									))}
								</div>
							</ListContext>
						</SearchViewBodyGroup>
					</SearchViewBody>
				) : data ? (
					<Suspense fallback="">
						<Await resolve={data.trending} errorElement={<></>}>
							{(data) => data && <SearchTrending query={data} />}
						</Await>
					</Suspense>
				) : null}
			</Form>
		</SearchView>
	)
}

export function SearchButton(
	props: ComponentProps<typeof TooltipPlainTrigger>
): ReactNode {
	return (
		<TooltipPlain>
			<TooltipPlainTrigger {...props} />
			<TooltipPlainContainer>
				<kbd>Ctrl</kbd>+<kbd className="font-bold">K</kbd>
			</TooltipPlainContainer>
		</TooltipPlain>
	)
}
