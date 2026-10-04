import {
	type ClientLoaderFunctionArgs,
	isRouteErrorResponse,
	useLocation,
	useOutlet,
} from "react-router"

import { AnimatePresence } from "motion/react"

import { cloneElement } from "react"
import ReactRelay from "react-relay"
import { Card } from "@animedes/components/Card"
import {
	LayoutBody,
	LayoutPane,
	LayoutPane as PaneFlexible,
} from "@animedes/components/Layout"
import {
	Menu,
	MenuDivider,
	MenuItemLeadingIcon,
	MenuItemTrailingIcon,
	MenuItemTrailingText,
	MenuList,
	MenuListItem,
	MenuTrigger,
} from "@animedes/components/Menu"
import { button } from "@animedes/components/button.styles"
import { Button } from "@animedes/components/Button"
import MaterialSymbolsCheck from "~icons/material-symbols/check"
import MaterialSymbolsCloud from "~icons/material-symbols/cloud"
import MaterialSymbolsContentCopy from "~icons/material-symbols/content-copy"
import MaterialSymbolsEdit from "~icons/material-symbols/edit"
import MaterialSymbolsKeyboardCommandKey from "~icons/material-symbols/keyboard-command-key"
import MaterialSymbolsVisibility from "~icons/material-symbols/visibility"

import type { ReactNode } from "react"

import { mergeStyles, precompileStyles } from "@anitrove/unstyled"
import * as Ariakit from "@ariakit/react"
import type { routeNavMediaQuery } from "~/gql/routeNavMediaQuery.graphql"
import { client_get_client } from "~/lib/client"
import { MediaCover } from "~/lib/entry/MediaCover"
import * as Predicate from "@animedes/components/Predicate"
import { getThemeFromHex } from "~/lib/theme"
import MaterialSymbolsChevronRight from "~icons/material-symbols/chevron-right"
import type { Route } from "./+types/route"
import { Edit } from "./Edit"
const { graphql } = ReactRelay
import * as design from "@anitrove/design"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
	const data = args.context.get(loadQuery)<routeNavMediaQuery>(
		graphql`
			query routeNavMediaQuery($id: Int!)
			@raw_response_type
			@throwOnFieldError {
				Media(id: $id) {
					coverImage {
						theme @catch(to: NULL)
					}
					...MediaCover_media @arguments(extraLarge: true) @alias
					title @required(action: LOG) {
						userPreferred @required(action: LOG)
					}
					description
				}
				...Edit_query @alias
			}
		`,
		{ id: Number(args.params.mediaId) }
	)

	return { query: data }
}

export default function Page({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(loaderData.query)

	if (data.Media == null) {
		throw new Error("Media not found")
	}

	const outlet = useOutlet()
	const { pathname } = useLocation()

	return (
		<>
			<title>{`Media - ${data.Media.title.userPreferred}`}</title>
			<LayoutBody
				style={mergeStyles(
					data.Media.coverImage?.theme ?? undefined,
					precompileStyles({
						...design.utilities.contrast({
							base: "standard",
							[design.media.contrastMore]: "high",
						}),
						...design.utilities.theme({
							base: "light",
							[design.media.dark]: "dark",
						}),
					})
				)}
			>
				<PaneFlexible>
					<div>
						<Card
							variant="filled"
							className="grid flex-1 gap-4 rounded-[2.75rem]"
						>
							<MediaCover
								media={data.Media.MediaCover_media}
								className="rounded-xl [view-transition-name:media-cover]"
							/>

							<div className="flex flex-wrap gap-2">
								<Button variant="filled">Favourite</Button>
								<Button variant="outlined">Favourite</Button>
								<Button>Favourite</Button>
								<Button variant="elevated">Favourite</Button>
								<Button variant="tonal" type="button" invoketarget="edit">
									Edit
								</Button>
							</div>

							{/* <div className="grid gap-4 flex-1">
              <img
                src={data?.Media?.bannerImage ?? ""}
                loading="lazy"
                className="rounded-xl"
                alt=""
              />
              </div>
              <div className="border-outline-variant border-r min-h-full"></div> */}
							<div className="overflow-hidden rounded-xl">
								<Card variant="elevated">
									<div className="sm:p-12">
										<Ariakit.Heading className="text-display-lg text-balance">
											{data.Media.title.userPreferred}
										</Ariakit.Heading>
										<Menu>
											<MenuTrigger
												className={button({ className: "cursor-default" })}
											>
												Format
											</MenuTrigger>

											<MenuList className="top-auto">
												{/* <MenuListItem render={<a href="" />}>
												<MenuItemLeadingIcon>
													<MaterialSymbolsVisibility />
												</MenuItemLeadingIcon>
												Item 1
											</MenuListItem> */}

												<MenuListItem>
													<MenuItemLeadingIcon>
														<MaterialSymbolsContentCopy />
													</MenuItemLeadingIcon>
													Item 2
													<MenuItemTrailingText>
														<span className="i">
															<MaterialSymbolsKeyboardCommandKey />
														</span>
														+Shift+X
													</MenuItemTrailingText>
												</MenuListItem>
												<MenuListItem>
													<MenuItemLeadingIcon>
														<MaterialSymbolsEdit />
													</MenuItemLeadingIcon>
													Item 3
													<MenuItemTrailingIcon>
														<MaterialSymbolsCheck />
													</MenuItemTrailingIcon>
												</MenuListItem>
												<MenuDivider />

												<Menu>
													<MenuListItem render={<MenuTrigger />}>
														<MenuItemLeadingIcon>
															<MaterialSymbolsCloud />
														</MenuItemLeadingIcon>
														Item 4
														<MenuItemTrailingIcon className="group-open:rotate-180">
															<MaterialSymbolsChevronRight />
														</MenuItemTrailingIcon>
													</MenuListItem>
													<MenuList className="-top-2 left-full">
														<MenuListItem>
															<MenuItemLeadingIcon>
																<MaterialSymbolsVisibility />
															</MenuItemLeadingIcon>
															Item 1
														</MenuListItem>
													</MenuList>
												</Menu>
											</MenuList>
										</Menu>
										<div
											className="text-title-lg"
											dangerouslySetInnerHTML={{
												__html: data.Media.description ?? "",
											}}
										/>
									</div>
								</Card>
							</div>
						</Card>
					</div>

					<Edit query={data.Edit_query} />

					{outlet ? (
						<AnimatePresence mode="wait">
							{cloneElement(outlet, { key: pathname })}
						</AnimatePresence>
					) : null}
				</PaneFlexible>
			</LayoutBody>
		</>
	)
}

import * as Sentry from "@sentry/react"

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<LayoutBody>
				<LayoutPane>
					<div>
						<Ariakit.Heading>Oops</Ariakit.Heading>
						<p>Status: {error.status}</p>
						<p>{error.data}</p>
					</div>
				</LayoutPane>
			</LayoutBody>
		)
	}
	void Sentry.captureException(error)
	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (Error.isError(error)) {
		errorMessage = error.message || errorMessage
	}

	return (
		<LayoutBody>
			<LayoutPane>
				<Card
					variant="elevated"
					className="bg-error-container text-on-error-container m-4"
				>
					<Ariakit.Heading className="text-headline-md text-balance">
						Uh oh ...
					</Ariakit.Heading>
					<p className="text-headline-sm">Something went wrong.</p>
					<pre className="text-body-md overflow-auto">{errorMessage}</pre>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
