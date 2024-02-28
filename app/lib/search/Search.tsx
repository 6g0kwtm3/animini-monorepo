import * as Ariakit from "@ariakit/react"
import {
	Await,
	useFetcher,
	useLocation,
	useNavigate,
	useNavigation,
	useRouteLoaderData,
	useSearchParams
} from "@remix-run/react"

import type { ElementRef } from "react"
import { Suspense, useEffect, useRef } from "react"
import type { loader as searchLoader } from "~/routes/search"

import { Predicate, ReadonlyArray } from "effect"
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
	SearchViewInput
} from "~/components/SearchView"
import type { loader as navLoader } from "~/routes/_nav"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"
import { HashNavLink } from "./HashNavLink"
import { SearchItem } from "./SearchItem"
import { SearchTrending } from "./SearchTrending"

export function Search() {
	const [searchParams] = useSearchParams()

	const submit = useFetcher<typeof searchLoader>()

	let ref = useRef<ElementRef<"input">>(null)

	const navigation = useNavigation()

	let location = useLocation()

	if (navigation.state === "loading") {
		location = navigation.location
	}
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
					render={<NavigationItem render={<HashNavLink />} to="#search" />}
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

			<SearchView
				aria-label="Search anime or manga"
				open={show}
				onClose={(state) => {
					// console.log({ state })
					navigate({
						pathname: location.pathname,
						search: location.search
					})
				}}
				initialFocus={ref}
				variant={{
					initial: "fullscreen",
					sm: "docked"
				}}
				defaultValue={searchParams.get("q") ?? ""}
			>
				<submit.Form
					role="search"
					action="/search"
					className={"flex w-full flex-col"}
				>
					<>
						<SearchViewInput
							ref={ref}
							placeholder="Search anime or manga"
							onChange={(e) => submit.submit(e.currentTarget.form, {})}
							name="q"
						/>

						{ReadonlyArray.isNonEmptyArray(media) ? (
							<SearchViewBody>
								<SearchViewBodyGroup
									render={
										<List
											lines={"one"}
											className="force:py-0"
											render={<div />}
										/>
									}
								>
									<Ariakit.ComboboxGroupLabel
										render={<ListItem render={<div />} />}
										className="force:hover:state-none"
									>
										<div className="col-span-full text-body-md text-on-surface-variant">
											Results
										</div>
									</Ariakit.ComboboxGroupLabel>
									{media.map((media) => (
										<SearchItem media={media} key={media.id} />
									))}
								</SearchViewBodyGroup>
							</SearchViewBody>
						) : data ? (
							<Suspense fallback="">
								<Await resolve={data.trending} errorElement={<></>}>
									{(data) => <SearchTrending query={data} />}
								</Await>
							</Suspense>
						) : null}
					</>
				</submit.Form>
			</SearchView>
		</>
	)
}
