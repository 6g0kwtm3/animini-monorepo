import {
	Link,
	json,
	useLocation,
	useOutlet,
	useParams,
	type ClientLoaderFunction
} from "@remix-run/react"
import type { LoaderFunction, MetaFunction } from "@vercel/remix"

import { AnimatePresence, motion } from "framer-motion"

import { useTooltipStore } from "@ariakit/react"
import { Effect, Option, pipe } from "effect"
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
import { Remix } from "~/lib/Remix/index.server"
import { button, fab } from "~/lib/button"
import { graphql, makeFragmentData } from "~/lib/graphql"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"
import type { loader as rootLoader } from "~/root"

import { Button } from "~/components/Button"

import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"

import type { ReactNode } from "react"
import { clientOnly$ } from "vite-env-only"
import { Ariakit } from "~/lib/ariakit"
import { client, createGetInitialData } from "~/lib/cache.client"
import type { MediaCover_media } from "~/lib/entry/MediaListCover"
import { MediaCover } from "~/lib/entry/MediaListCover"
import { getCacheControl } from "~/lib/getCacheControl"
import { m } from "~/lib/paraglide"
import { route_login, route_media_edit } from "~/lib/route"
import MaterialSymbolsEditOutline from "~icons/material-symbols/edit-outline"

export const loader = (async (args) => {
	return pipe(
		pipe(
			Effect.Do,
			Effect.bind("args", () => ClientArgs),
			Effect.bind("client", () => EffectUrql),
			Effect.flatMap(({ client, args: { params } }) =>
				client.query(
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
						id: Number(params["mediaId"])
					}
				)
			)
		),

		Effect.flatMap((data) =>
			Option.all({
				Media: Option.fromNullable(data?.Media)
			})
		),

		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": getCacheControl(cacheControl)
				}
			})
		),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Remix.runLoader
	)
}) satisfies LoaderFunction

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

let getInitialData = clientOnly$(createGetInitialData())
export const clientLoader: ClientLoaderFunction = async (args) => {
	return await client.fetchQuery({
		queryKey: ["_nav._media.$mediaId", args.params.mediaId],
		queryFn: () => args.serverLoader(),
		staleTime: cacheControl.maxAge * 1000,
		initialData: await getInitialData?.(args)
	})
}
clientLoader.hydrate = true

export const meta = (({ data }) => {
	return [{ title: `Media - ${data?.Media.title?.userPreferred}` }]
}) satisfies MetaFunction<typeof loader>
export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof loader>()

	const outlet = useOutlet()
	const { pathname } = useLocation()

	return (
		<LayoutBody
			style={{
				"--theme": data.Media.coverImage?.color ?? ""
			}}
			className={`${data.Media.coverImage?.color ? ` theme-light palette-[--theme] dark:theme-dark` : ""}`}
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

// type X = HTMLAttributes<any>

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
