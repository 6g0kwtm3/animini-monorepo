import type { LoaderFunction } from "@remix-run/cloudflare"
import { Link, json, useLocation, useOutlet, useParams } from "@remix-run/react"

import type { Variants } from "framer-motion"
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
import { graphql } from "~/lib/graphql"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"
import type { loader as rootLoader } from "~/root"

import { Button } from "~/components/Button"

import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"

import { m } from "~/lib/paraglide"
import { route_login, route_media_edit } from "~/lib/route"

const variants = {
	enter: (direction: number) => {
		return {
			y: direction > 0 ? 1000 : -1000,
			opacity: 0
		}
	},
	center: {
		y: 0,
		opacity: 1
	},
	exit: (direction: number) => {
		return {
			y: direction < 0 ? 1000 : -1000,
			opacity: 0
		}
	}
} satisfies Variants

export const loader = (async (args) => {
	return pipe(
		pipe(
			Effect.Do,
			Effect.bind("args", () => ClientArgs),
			Effect.bind("client", () => EffectUrql),
			Effect.flatMap(({ client, args: { params } }) =>
				client.query(
					graphql(`
						query MediaQuery($id: Int!) {
							Media(id: $id) {
								id
								coverImage {
									extraLarge
									medium
									color
								}
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
					"Cache-Control": "max-age=5, stale-while-revalidate=55, private"
				}
			})
		),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Remix.runLoader
	)
}) satisfies LoaderFunction

export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	const outlet = useOutlet()
	const { pathname } = useLocation()

	return (
		<>
			<LayoutBody
				style={{
					"--theme": data.Media.coverImage?.color ?? ""
				}}
				className={`${data.Media.coverImage?.color ? ` theme-[--theme]` : ""}`}
			>
				<PaneFlexible className="relative">
					<>
						<Card
							variant="filled"
							render={
								<motion.div layoutId={`media-container-${data.Media.id}`} />
							}
							className="grid flex-1 gap-4 rounded-[2.5rem]"
						>
							<motion.img
								src={data.Media.coverImage?.extraLarge ?? ""}
								layoutId={`media-cover-${data.Media.id}`}
								style={{
									"--bg": `url(${data.Media.coverImage?.medium})`
								}}
								loading="lazy"
								className="rounded-xl bg-[image:--bg]"
								alt=""
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
							<Card variant="elevated" className="force:rounded-xl force:p-16">
								<h1 className="text-balance text-display-lg">
									{data.Media.title?.userPreferred}
								</h1>
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
											<MenuItem render={<a href=""></a>}>
												<MenuItemLeadingIcon>visibility</MenuItemLeadingIcon>
												Item 1
											</MenuItem>
										</li>
										<MenuItem>
											<MenuItemLeadingIcon>content_copy</MenuItemLeadingIcon>
											Item 2
											<MenuItemTrailingText>
												<span className="i">keyboard_command_key</span>+Shift+X
											</MenuItemTrailingText>
										</MenuItem>
										<MenuItem>
											-<MenuItemLeadingIcon>edit</MenuItemLeadingIcon>
											Item 3<MenuItemTrailingIcon>check</MenuItemTrailingIcon>
										</MenuItem>
										<MenuDivider></MenuDivider>
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
								></div>
							</Card>
						</Card>
					</>

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
		</>
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
		<motion.div layoutId="edit" className="fixed bottom-4 end-4">
			<div className="relative">
				<TooltipPlain store={store}>
					<TooltipPlainTrigger
						render={
							<Link
								to={
									root?.Viewer
										? route_media_edit({ id: mediaId })
										: route_login({
												redirect: route_media_edit({ id: mediaId })
											})
								}
								preventScrollReset={true}
								className={fab({})}
								onClick={() => store.setOpen(false)}
							>
								edit
							</Link>
						}
					></TooltipPlainTrigger>
					<TooltipPlainContainer>{m.edit()}</TooltipPlainContainer>
				</TooltipPlain>
			</div>
		</motion.div>
	)
}
