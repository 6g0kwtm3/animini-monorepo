import * as Ariakit from "@ariakit/react"
import {
	Await,
	Form,
	useFetcher,
	useLocation,
	useNavigate,
	useNavigation
} from "@remix-run/react"

import type { ElementRef, ReactNode } from "react"
import { Suspense, useEffect, useRef } from "react"
import type { clientLoader as searchLoader } from "~/routes/_nav.search"

import { ReadonlyArray } from "effect"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger
} from "~/components/Tooltip"

import { List, ListItem } from "~/components/List"
import { NavigationItem, NavigationItemIcon } from "~/components/Navigation"
import {
	SearchView,
	SearchViewBody,
	SearchViewBodyGroup,
	SearchViewInput,
	SearchViewItem
} from "~/components/SearchView"
import type { clientLoader as navLoader } from "~/routes/_nav"
import { copySearchParams } from "~/routes/copySearchParams"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"
import { useRawRouteLoaderData } from "../data"
import { makeFragmentData } from "../graphql"
import type { SearchItem_media } from "./SearchItem"
import { SearchItem } from "./SearchItem"
import type { SearchTrending_query } from "./SearchTrending"
import { SearchTrending } from "./SearchTrending"
import { M3 } from "../components"

function useOptimisticSearchParams() {
	const { search } = useOptimisticLocation()

	return new URLSearchParams(search)
}

function useOptimisticLocation() {
	let location = useLocation()
	const navigation = useNavigation()

	if (navigation.location?.pathname === location.pathname) {
		location = navigation.location
	}
	return location
}

export function Search(): ReactNode {
	const searchParams = useOptimisticSearchParams()

	const submit = useFetcher<typeof searchLoader>()

	let ref = useRef<ElementRef<"input">>(null)

	const show = searchParams.get("sheet") === "search"
	searchParams.delete("sheet")

	const sheetParams = copySearchParams(searchParams)
	sheetParams.set("sheet", "search")
	const navigate = useNavigate()

	// bind command + k
	useEffect(() => {
		let listener = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				navigate({ search: `?${sheetParams}` })
			}
		}
		window.addEventListener("keydown", listener)
		return () => window.removeEventListener("keydown", listener)
	}, [navigate, sheetParams])

	const media = submit.data?.page?.media?.filter((el) => el != null) ?? []

	const data = useRawRouteLoaderData<typeof navLoader>("routes/_nav")

	return (
		<SearchView
			aria-label="Search anime or manga"
			portal={false}
			open={show}
			onClose={(state) => {
				navigate({ search: `?${searchParams}` })
			}}
			initialFocus={ref}
			variant={{
				initial: "fullscreen",
				sm: "docked"
			}}
			defaultValue={searchParams.get("q") ?? ""}
		>
			<Form role="search" action="/search" className={"flex w-full flex-col"}>
				<>
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

								<List lines={"one"} render={<div />} className="-mt-2">
									{media.map((media) => (
										<SearchViewItem
											key={media.id}
											render={
												<SearchItem
													media={makeFragmentData<SearchItem_media>(media)}
												/>
											}
										/>
									))}
								</List>
							</SearchViewBodyGroup>
						</SearchViewBody>
					) : data ? (
						<Suspense fallback="">
							<Await resolve={data.trending} errorElement={<></>}>
								{(data) => (
									<SearchTrending
										query={makeFragmentData<SearchTrending_query>(data)}
									/>
								)}
							</Await>
						</Suspense>
					) : null}
				</>
			</Form>
		</SearchView>
	)
}

export function SearchButton(): ReactNode {
	return (
		<TooltipPlain>
			<TooltipPlainTrigger
				render={
					<NavigationItem
						to={{
							search: `?q=`
						}}
					/>
				}
			>
				<NavigationItemIcon>
					<MaterialSymbolsTravelExplore />
					<MaterialSymbolsTravelExplore />
				</NavigationItemIcon>

				<div className="max-w-full break-words">Explore</div>
			</TooltipPlainTrigger>
			<TooltipPlainContainer>
				<kbd>Ctrl</kbd>+<kbd className="font-bold">K</kbd>
			</TooltipPlainContainer>
		</TooltipPlain>
	)
}
