import {
	type ClientLoaderFunctionArgs,
	type ShouldRevalidateFunction,
	useLocation,
	useOutlet,
	useParams,
	useRouteLoaderData,
} from "react-router"

import { AnimatePresence, motion } from "framer-motion"

import { useTooltipStore } from "@ariakit/react"
import { cloneElement } from "react"
import ReactRelay from "react-relay"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane as PaneFlexible } from "~/components/Layout"
import {
	Menu,
	MenuDivider,
	MenuItemLeadingIcon,
	MenuItemTrailingIcon,
	MenuItemTrailingText,
	MenuList,
	MenuListItem,
	MenuTrigger,
} from "~/components/Menu"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"
import { button, fab } from "~/lib/button"
import type { clientLoader as rootLoader } from "~/root"
import MaterialSymbolsCheck from "~icons/material-symbols/check"
import MaterialSymbolsCloud from "~icons/material-symbols/cloud"
import MaterialSymbolsContentCopy from "~icons/material-symbols/content-copy"
import MaterialSymbolsEdit from "~icons/material-symbols/edit"
import MaterialSymbolsKeyboardCommandKey from "~icons/material-symbols/keyboard-command-key"
import MaterialSymbolsVisibility from "~icons/material-symbols/visibility"

import { Button } from "~/components/Button"

import type { ReactNode } from "react"

import * as Ariakit from "@ariakit/react"
import { A } from "a"
import type { routeNavMediaQuery } from "~/gql/routeNavMediaQuery.graphql"
import { client_get_client } from "~/lib/client"
import { MediaCover } from "~/lib/entry/MediaCover"
import { m } from "~/lib/paraglide"
import * as Predicate from "~/lib/Predicate"
import { route_login, route_media_edit } from "~/lib/route"
import { getThemeFromHex } from "~/lib/theme"
import MaterialSymbolsChevronRight from "~icons/material-symbols/chevron-right"
import MaterialSymbolsEditOutline from "~icons/material-symbols/edit-outline"
import type { Route } from "./+types/route"
const { graphql } = ReactRelay

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
	const client = client_get_client()

	const data = await client.query<routeNavMediaQuery>(
		graphql`
			query routeNavMediaQuery($id: Int!) @raw_response_type {
				Media(id: $id) {
					id
					coverImage {
						color
					}
					...MediaCover_media @arguments(extraLarge: true)
					title @required(action: LOG) {
						userPreferred @required(action: LOG)
					}
					description
				}
			}
		`,
		{ id: Number(args.params.mediaId) }
	)

	if (!data?.Media) {
		throw Response.json("Media not found", { status: 404 })
	}

	return {
		Media: data.Media,
		theme: Predicate.isString(data.Media.coverImage?.color)
			? getThemeFromHex(data.Media.coverImage.color)
			: {},
	}
}

export const meta = (({ data }) => {
	return [{ title: `Media - ${data?.Media.title.userPreferred}` }]
}) satisfies Route.MetaFunction

export default function Page({ loaderData }: Route.ComponentProps): ReactNode {
	const data = loaderData

	const outlet = useOutlet()
	const { pathname } = useLocation()

	return (
		<LayoutBody
			style={data.theme}
			className={
				"contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
			}
		>
			<PaneFlexible>
				<div>
					<Card
						variant="filled"
						className="grid flex-1 gap-4 rounded-[2.75rem]"
					>
						<MediaCover
							media={data.Media}
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

				<Edit />

				{outlet && (
					<AnimatePresence mode="wait">
						{cloneElement(outlet, { key: pathname })}
					</AnimatePresence>
				)}
			</PaneFlexible>
		</LayoutBody>
	)
}

function Edit() {
	const { mediaId } = useParams()

	const store = useTooltipStore()

	const root = useRouteLoaderData<typeof rootLoader>("root")

	return (
		<motion.div layoutId="edit" className="fixed bottom-24 end-4 sm:bottom-4">
			<div className="relative">
				<TooltipPlain store={store}>
					<TooltipPlainTrigger
						render={
							<A
								href={
									root?.Viewer
										? route_media_edit({ id: Number(mediaId) })
										: route_login({
												redirect: route_media_edit({ id: Number(mediaId) }),
											})
								}
								preventScrollReset={true}
								className={fab({})}
								onClick={() => {
									store.setOpen(false)
								}}
							>
								<MaterialSymbolsEditOutline />
							</A>
						}
					/>
					<TooltipPlainContainer>{m.edit()}</TooltipPlainContainer>
				</TooltipPlain>
			</div>
		</motion.div>
	)
}
