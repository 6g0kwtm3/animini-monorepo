import type { LoaderFunction } from "@remix-run/cloudflare"
import {
	Link,
	useLocation,
	useOutlet,
	useOutletContext
} from "@remix-run/react"

import type { Variants } from "framer-motion"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { useTooltipStore } from "@ariakit/react"
import { Effect, pipe } from "effect"
import { cloneElement } from "react"
import { Card } from "~/components/Card"
import { LayoutPane as PaneFlexible } from "~/components/Layout"
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

import {
	ButtonElevated,
	ButtonFilled,
	ButtonOutlined,
	ButtonText,
	ButtonTonal
} from "~/components/Button"

import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"

import { m } from "~/lib/paraglide"

const variants = {
	enter: (direction: number) => {
		return {
			y: direction > 0 ? 1000 : -1000,
			opacity: 0
		}
	},
	center: {
		zIndex: 1,
		y: 0,
		opacity: 1
	},
	exit: (direction: number) => {
		return {
			zIndex: 0,
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
						query EntryPage($id: Int!) {
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
			<div
				style={{
					"--theme": data?.Media?.coverImage?.color ?? ""
				}}
				className={`contents${data?.Media?.coverImage?.color ? ` theme-[--theme]` : ""}`}
			>
				<PaneFlexible className="relative">
					<motion.div
						variants={variants}
						{...(!useReducedMotion() && {
							initial: "enter",
							animate: "center",
							exit: "exit"
						})}
						transition={{
							y: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 }
						}}
						custom={useOutletContext()}
						className="flex gap-2"
					>
						<Card
							variant="filled"
							className="grid flex-1 gap-4 rounded-[2.5rem]"
						>
							<img
								src={data?.Media?.coverImage?.extraLarge ?? ""}
								style={{
									"--bg": `url(${data?.Media?.coverImage?.medium})`
								}}
								loading="lazy"
								className="rounded-xl bg-[image:--bg]"
								alt=""
							/>

							<div className="flex flex-wrap gap-2">
								<ButtonFilled>Favourite</ButtonFilled>
								<ButtonOutlined>Favourite</ButtonOutlined>
								<ButtonText>Favourite</ButtonText>
								<ButtonElevated>Favourite</ButtonElevated>
								<ButtonTonal type="button" invoketarget="edit">
									Edit
								</ButtonTonal>
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
									{data?.Media?.title?.userPreferred}
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
										__html: data?.Media?.description || ""
									}}
								></div>
							</Card>
						</Card>
					</motion.div>

					<Edit />

					{outlet && (
						<AnimatePresence mode="wait">
							{cloneElement(outlet, {
								key: pathname
							})}
						</AnimatePresence>
					)}
				</PaneFlexible>
			</div>
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
	const { pathname } = useLocation()

	const store = useTooltipStore()

	const root = useRawRouteLoaderData<typeof rootLoader>("root")

	return (
		<motion.div layoutId="edit" className="fixed bottom-4 end-4 z-20">
			<div className="relative">
				<TooltipPlain store={store}>
					<TooltipPlainTrigger
						render={
							<Link
								to={
									root?.Viewer
										? `edit/`
										: `/login/?${new URLSearchParams({
												redirect: `${pathname}`
											})}`
								}
								preventScrollReset={true}
								className={fab({})}
								onClick={() => store.setOpen(false)}
							/>
						}
					>
						edit
					</TooltipPlainTrigger>
					<TooltipPlainContainer>{m.edit()}</TooltipPlainContainer>
				</TooltipPlain>
			</div>
		</motion.div>
	)
}
