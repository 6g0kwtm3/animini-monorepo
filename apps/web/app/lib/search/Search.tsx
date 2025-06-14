import * as Ariakit from "@ariakit/react"
import type { ComponentProps, ReactNode } from "react"
import { Suspense, useEffect } from "react"
import {
	Form,
	useFetcher,
	useLocation,
	useNavigate,
	useNavigation,
} from "react-router"
import type { clientLoader as searchLoader } from "~/routes/Search/route"

import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"

import { List, Subheader } from "~/components/List"
import {
	SearchView,
	SearchViewBody,
	SearchViewBodyGroup,
	SearchViewInput,
	SearchViewItem,
} from "~/components/SearchView"
import { copySearchParams } from "~/lib/copySearchParams"

import { ErrorBoundary } from "@sentry/react"
import { usePreloadedQuery, type NodeAndQueryFragment } from "../Network"
import { SearchItem } from "./SearchItem"
import { SearchTrending } from "./SearchTrending"

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

import type { routeNavQuery } from "~/gql/routeNavQuery.graphql"

export function Search({
	queryRef,
}: {
	queryRef: NodeAndQueryFragment<routeNavQuery>
}): ReactNode {
	const searchParams = useOptimisticSearchParams()

	const submit = useFetcher<typeof searchLoader>()

	const show = searchParams.get("sheet") === "search"
	searchParams.delete("sheet")

	const sheetParams = copySearchParams(searchParams)
	sheetParams.set("sheet", "search")
	const navigate = useNavigate()

	// bind command + k
	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "k") {
				event.preventDefault()
				void navigate({ search: `?${sheetParams}` })
			}
		}
		window.addEventListener("keydown", listener)
		return () => {
			window.removeEventListener("keydown", listener)
		}
	}, [navigate, sheetParams])

	const media = submit.data?.page?.media?.filter((el) => el != null) ?? []

	return (
		<SearchView
			aria-label="Search anime or manga"
			open={show}
			onClose={() => {
				void navigate({ search: `?${searchParams}` })
			}}
			className="search-view-fullscreen sm:search-view-docked"
			defaultValue={searchParams.get("q") ?? ""}
		>
			<Form role="search" action="/search" className={"flex w-full flex-col"}>
				<>
					<SearchViewInput
						placeholder="Search anime or manga"
						onChange={(e) => void submit.submit(e.currentTarget.form, {})}
						name="q"
					/>

					{media.length > 0 ? (
						<SearchViewBody>
							<SearchViewBodyGroup>
								<Ariakit.ComboboxGroupLabel
									render={<Subheader lines={"one"} />}
								>
									Results
								</Ariakit.ComboboxGroupLabel>

								<List render={<div />} className="list-one -mt-2">
									{media.map((media) => (
										<SearchViewItem
											key={media.id}
											data-key={media.id}
											render={<SearchItem media={media} />}
										/>
									))}
								</List>
							</SearchViewBodyGroup>
						</SearchViewBody>
					) : (
						<ErrorBoundary fallback={<>Error</>}>
							<Suspense fallback="">
								<SearchTrendingData queryRef={queryRef} />
							</Suspense>
						</ErrorBoundary>
					)}
				</>
			</Form>
		</SearchView>
	)
}

function SearchTrendingData({
	queryRef,
}: {
	queryRef: NodeAndQueryFragment<routeNavQuery>
}) {
	const data = usePreloadedQuery(queryRef)

	return <SearchTrending query={data} />
}

export function SearchButton(
	props: ComponentProps<typeof TooltipPlainTrigger>
): ReactNode {
	return (
		<TooltipPlain>
			<TooltipPlainTrigger {...props}></TooltipPlainTrigger>
			<TooltipPlainContainer>
				<kbd>Ctrl</kbd>+<kbd className="font-bold">K</kbd>
			</TooltipPlainContainer>
		</TooltipPlain>
	)
}
