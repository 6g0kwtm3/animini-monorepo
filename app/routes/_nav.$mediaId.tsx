import type { LoaderFunction } from "@remix-run/node"
import {
	Link,
	useLoaderData,
	useLocation,
	useOutlet,
	useOutletContext,
} from "@remix-run/react"

import type { Variants } from "framer-motion"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { ClientArgs, EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql"

import type { Theme } from "@material/material-color-utilities"
import {
	argbFromHex,
	hexFromArgb,
	themeFromSourceColor,
} from "@material/material-color-utilities"
import { cloneElement, useId, useMemo } from "react"

import colors from "colors.json"

import { Effect, pipe } from "effect"

import type { ComponentPropsWithoutRef } from "react"

import { CardElevated, CardFilled } from "~/components/Card"

import { cssEscape } from "~/lib/cssEscape"

import {
	ButtonElevated,
	ButtonFilled,
	ButtonOutlined,
	ButtonText,
	ButtonTonal,
} from "~/components/Button"

import { button, fab } from "~/lib/button"

import { useTooltipStore } from "@ariakit/react"
import {
	Menu,
	MenuDivider,
	MenuItem,
	MenuItemLeadingIcon,
	MenuItemTrailingIcon,
	MenuItemTrailingText,
	MenuList,
	MenuTrigger,
} from "~/components/Menu"
import { PaneFlexible } from "~/components/Pane"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"
import { graphql } from "~/gql"

const EntryPageQuery = graphql(`
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
`)

const EntryPageViewerQuery = graphql(`
	query EntryPageViewer {
		Viewer {
			id
		}
	}
`)

const variants = {
	enter: (direction: number) => {
		return {
			y: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}
	},
	center: {
		zIndex: 1,
		y: 0,
		opacity: 1,
	},
	exit: (direction: number) => {
		return {
			zIndex: 0,
			y: direction < 0 ? 1000 : -1000,
			opacity: 0,
		}
	},
} satisfies Variants

function getThemeFromHex(hex: string) {
	const theme = themeFromSourceColor(argbFromHex(hex))

	return theme
}

function useThemeFromHex(hex: string | null | undefined) {
	return useMemo(
		() => (typeof hex === "string" ? getThemeFromHex(hex) : hex),
		[hex],
	)
}

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.bind(
		"EntryPageQuery",
		({ client, args: { params } }) => (
			console.log(params),
			client.query(EntryPageQuery, {
				id: Number(params["mediaId"]),
			})
		),
	),
	Effect.bind("EntryPageViewerQuery", ({ client }) =>
		client.query(EntryPageViewerQuery, {}),
	),
	Effect.map(({ EntryPageViewerQuery, EntryPageQuery }) => ({
		...EntryPageViewerQuery,
		...EntryPageQuery,
	})),
)

export const loader = (async (args) => {
	return pipe(
		_loader,

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

function getStyleFromTheme(theme: Theme | undefined | null, dark: boolean) {
	if (!theme) return {}

	const mapping = dark ? colors.dark : colors.light

	return Object.fromEntries(
		Object.entries(mapping).map(([key, value]) => {
			const [token = "", tone] = value.replaceAll(/(\d+)$/g, "_$1").split("_")

			const palette = (
				{
					primary: "primary",
					secondary: "secondary",
					tertiary: "tertiary",
					neutral: "neutral",
					"neutral-variant": "neutralVariant",
					error: "error",
				} as const
			)[token]
			if (!palette) {
				return []
			}
			return [`--${key}`, parseArgb(theme.palettes[palette].tone(Number(tone)))]
		}),
	)
}

function parseArgb(value: number) {
	const [, r1 = "", r2 = "", g1 = "", g2 = "", b1 = "", b2 = ""] =
		hexFromArgb(value)
	const color = [
		Number.parseInt(r1 + r2, 16),
		Number.parseInt(g1 + g2, 16),
		Number.parseInt(b1 + b2, 16),
	].join(" ")

	return color
}

const ThemeProvider = ({
	theme,
	children,
	...props
}: ComponentPropsWithoutRef<"div"> & {
	theme: Theme | undefined | null
}) => {
	const rawId = useId()

	const id = `#${cssEscape(rawId)}`

	return (
		<div {...props} id={rawId}>
			<style>
				{`${id}, ${id} ::backdrop{${Object.entries(
					getStyleFromTheme(theme, false),
				)
					.map(([key, value]) => `${key}:${value};`)
					.join(
						"",
					)}} @media(prefers-color-scheme: dark){${id}, ${id} ::backdrop{${Object.entries(
					getStyleFromTheme(theme, true),
				)
					.map(([key, value]) => `${key}:${value};`)
					.join("")}}}`}
			</style>

			{children}
		</div>
	)
}

export default function Page() {
	const data = useLoaderData<typeof loader>()

	const outlet = useOutlet()
	const { pathname } = useLocation()

	return (
		<>
			<ThemeProvider
				theme={useThemeFromHex(data.Media?.coverImage?.color)}
				className="contents"
			>
				<PaneFlexible className="relative">
					<motion.div
						variants={variants}
						{...(!useReducedMotion() && {
							initial: "enter",
							animate: "center",
							exit: "exit",
						})}
						transition={{
							y: { type: "spring", stiffness: 300, damping: 30 },
							opacity: { duration: 0.2 },
						}}
						custom={useOutletContext()}
						className="flex gap-2"
					>
						<CardFilled className="grid flex-1 gap-4 rounded-[2.5rem]">
							<img
								src={data.Media?.coverImage?.extraLarge ?? ""}
								style={{
									"--bg": `url(${data.Media?.coverImage?.medium})`,
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
							<CardElevated className="force:rounded-xl force:p-16">
								<h1 className="text-balance text-display-lg">
									{data.Media?.title?.userPreferred}
								</h1>
								<Menu>
									<MenuTrigger
										className={button({
											className: "cursor-default",
										})}
									>
										Format
									</MenuTrigger>

									<MenuList className="top-auto">
										<li>
											<MenuItem asChild>
												<a href="">
													<MenuItemLeadingIcon>visibility</MenuItemLeadingIcon>
													Item 1
												</a>
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
											<MenuItemLeadingIcon>edit</MenuItemLeadingIcon>
											Item 3<MenuItemTrailingIcon>check</MenuItemTrailingIcon>
										</MenuItem>
										<MenuDivider></MenuDivider>
										<li>
											<Menu className="group">
												<MenuItem asChild>
													<MenuTrigger>
														<MenuItemLeadingIcon>cloud</MenuItemLeadingIcon>
														Item 4
														<MenuItemTrailingIcon className="group-open:rotate-180">
															chevron_right
														</MenuItemTrailingIcon>
													</MenuTrigger>
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
										__html: data.Media?.description || "",
									}}
								></div>
							</CardElevated>
						</CardFilled>
					</motion.div>

					<Edit />

					{outlet && (
						<AnimatePresence mode="wait">
							{cloneElement(outlet, {
								key: pathname,
							})}
						</AnimatePresence>
					)}
				</PaneFlexible>
			</ThemeProvider>
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
	const data = useLoaderData<typeof loader>()

	const { pathname } = useLocation()

	const store = useTooltipStore()

	return (
		<motion.div layoutId="edit" className="fixed bottom-4 end-4">
			<div className="relative">
				<TooltipPlain store={store}>
					<TooltipPlainTrigger
						render={
							<Link
								to={
									data.Viewer
										? "edit"
										: `/login/?${new URLSearchParams({
												redirect: `${pathname}/edit`,
											})}`
								}
								preventScrollReset={true}
								className={fab({})}
								onClick={() => store.setOpen(false)}
							>
								edit
							</Link>
						}
					></TooltipPlainTrigger>
					<TooltipPlainContainer>Edit</TooltipPlainContainer>
				</TooltipPlain>
			</div>
		</motion.div>
	)
}
