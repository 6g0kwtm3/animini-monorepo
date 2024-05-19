import type { MetaFunction } from "@remix-run/cloudflare"
import { json, unstable_defineLoader } from "@remix-run/cloudflare"
import {
	Link,
	useLocation,
	useOutlet,
	useParams,
	type MetaArgs_SingleFetch,
	type ShouldRevalidateFunction
} from "@remix-run/react"

import { AnimatePresence, motion } from "framer-motion"

import { useTooltipStore } from "@ariakit/react"
import { cloneElement } from "react"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane as PaneFlexible } from "~/components/Layout"
import {
	Menu,
	MenuDivider,
	MenuItem,
	MenuItemLeadingIcon,
	MenuItemTrailingIcon,
	MenuItemTrailingText,
	MenuList,
	MenuTrigger
} from "~/components/Menu"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger
} from "~/components/Tooltip"
import { button, fab } from "~/lib/button"
import { graphql, makeFragmentData } from "~/lib/graphql"
import type { clientLoader as rootLoader } from "~/root"

import { Button } from "~/components/Button"
import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"

import type { ReactNode } from "react"
import { clientOnly$ } from "vite-env-only"
import { Ariakit } from "~/lib/ariakit"
import { client, createGetInitialData, persister } from "~/lib/cache.client"
import { client_get_client, type AnyLoaderFunctionArgs } from "~/lib/client"
import type { MediaCover_media } from "~/lib/entry/MediaListCover"
import { MediaCover } from "~/lib/entry/MediaListCover"
import { getCacheControl } from "~/lib/getCacheControl"
import { m } from "~/lib/paraglide"
import { route_login, route_media_edit } from "~/lib/route"
import MaterialSymbolsEditOutline from "~icons/material-symbols/edit-outline"
// type X = HTMLAttributes<any>
import { unstable_defineClientLoader } from "@remix-run/react"
import { Predicate } from "effect"
import { getThemeFromHex } from "~/lib/theme"
import MaterialSymbolsChevronRight from "~icons/material-symbols/chevron-right"

export const loader = unstable_defineLoader(async (args) => {
	args.response.headers.append("Cache-Control", getCacheControl(cacheControl))
	return mediaLoader(args)
})

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

const isInitialRequest = clientOnly$(createGetInitialData())
export const clientLoader = unstable_defineClientLoader(async (args) => {
	return client.ensureQueryData({
		revalidateIfStale: true,
		persister,
		queryKey: ["_nav._media", args.params.mediaId],
		queryFn: async () => mediaLoader(args),
		initialData:
			isInitialRequest?.() && (await args.serverLoader<typeof loader>())
	})
})
clientLoader.hydrate = true

export const shouldRevalidate: ShouldRevalidateFunction = ({
	defaultShouldRevalidate,
	formMethod,
	nextParams,
	currentParams
}) => {
	if (
		formMethod?.toLocaleUpperCase() === "GET" &&
		currentParams.mediaId === nextParams.mediaId
	) {
		return false
	}

	return defaultShouldRevalidate
}

export const meta = ({
	data
}: MetaArgs_SingleFetch<typeof loader>): ReturnType<MetaFunction> => {
	return [{ title: `Media - ${data?.Media.title?.userPreferred}` }]
}

async function mediaLoader(args: AnyLoaderFunctionArgs) {
	const client = client_get_client(args)

	const data = await client.operation(
		graphql(`
			query MediaQuery($id: Int!, $coverExtraLarge: Boolean = true) {
				Media(id: $id) {
					id
					coverImage {
						color
					}
					...MediaCover_media
					bannerImage
					title {
						userPreferred
					}
					description
				}
			}
		`),
		{
			id: Number(args.params.mediaId)
		}
	)

	if (!data?.Media) {
		throw json("Media not found", {
			status: 404
		})
	}

	return {
		Media: data.Media,
		theme: Predicate.isString(data.Media.coverImage?.color)
			? getThemeFromHex(data.Media.coverImage.color)
			: {}
	}
}

export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof clientLoader>()

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
						className="grid flex-1 gap-4 force:rounded-[2.75rem]"
					>
						<MediaCover
							media={makeFragmentData<MediaCover_media>(data.Media)}
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
									<Ariakit.Heading className="text-balance text-display-lg">
										{data.Media.title?.userPreferred}
									</Ariakit.Heading>
									<Menu>
										<MenuTrigger
											className={button({
												className: "cursor-default"
											})}
										>
											Format
										</MenuTrigger>

										<MenuList className="top-auto">
											<li>
												<MenuItem render={<a href="" />}>
													<MenuItemLeadingIcon>visibility</MenuItemLeadingIcon>
													Item 1
												</MenuItem>
											</li>
											<MenuItem>
												<MenuItemLeadingIcon>content_copy</MenuItemLeadingIcon>
												Item 2
												<MenuItemTrailingText>
													<span className="i">keyboard_command_key</span>
													+Shift+X
												</MenuItemTrailingText>
											</MenuItem>
											<MenuItem>
												-<MenuItemLeadingIcon>edit</MenuItemLeadingIcon>
												Item 3<MenuItemTrailingIcon>check</MenuItemTrailingIcon>
											</MenuItem>
											<MenuDivider />
											<li>
												<Menu className="group">
													<MenuItem render={<MenuTrigger />}>
														<MenuItemLeadingIcon>cloud</MenuItemLeadingIcon>
														Item 4
														<MenuItemTrailingIcon className="group-open:rotate-180">
															chevron_right
														</MenuItemTrailingIcon>
													</MenuItem>
													<MenuList className="-top-2 left-full">
														<MenuItem>
															<MenuItemLeadingIcon>
																visibility
															</MenuItemLeadingIcon>
															Item 1
														</MenuItem>
													</MenuList>
												</Menu>
											</li>
										</MenuList>
									</Menu>
									<div
										className="text-title-lg"
										dangerouslySetInnerHTML={{
											__html: data.Media.description || ""
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
						{cloneElement(outlet, {
							key: pathname
						})}
					</AnimatePresence>
				)}
			</PaneFlexible>
		</LayoutBody>
	)
}
declare global {
	namespace React {
		interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
			popover?: "manual" | true | "auto" | undefined
		}
	}
}

function Edit() {
	const { mediaId } = useParams()

	const store = useTooltipStore()

	const root = useRawRouteLoaderData<typeof rootLoader>("root")

	return (
		<motion.div layoutId="edit" className="fixed bottom-24 end-4 sm:bottom-4">
			<div className="relative">
				<TooltipPlain store={store}>
					<TooltipPlainTrigger
						render={
							<Link
								to={
									root?.Viewer
										? route_media_edit({ id: Number(mediaId) })
										: route_login({
												redirect: route_media_edit({ id: Number(mediaId) })
											})
								}
								preventScrollReset={true}
								className={fab({})}
								onClick={() => store.setOpen(false)}
							>
								<MaterialSymbolsEditOutline />
							</Link>
						}
					/>
					<TooltipPlainContainer>{m.edit()}</TooltipPlainContainer>
				</TooltipPlain>
			</div>
		</motion.div>
	)
}
