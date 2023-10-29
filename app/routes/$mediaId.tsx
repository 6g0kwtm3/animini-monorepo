import type { LoaderFunction } from "@remix-run/node"
import type { Link } from "@remix-run/react"
import {
  useHref,
  useLoaderData,
  useLocation,
  useOutlet,
  useOutletContext,
} from "@remix-run/react"
import type { Variants } from "framer-motion"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import {
  ClientArgs,
  EffectUrql,
  LoaderArgs,
  ServerLive,
  useLoader,
} from "~/lib/urql"

import type { Theme } from "@material/material-color-utilities"
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities"
import { cloneElement, useEffect, useId, useMemo, useState } from "react"

import colors from "colors.json"

import { Effect, Sink, Stream, pipe } from "effect"
import {
  Check,
  ChevronRight,
  Cloud,
  Command,
  Copy,
  Eye,
  Pencil,
} from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

import { CardElevated, CardFilled } from "~/components/Card"

import { cssEscape } from "~/lib/cssEscape"

import {
  ButtonElevated,
  ButtonFilled,
  ButtonOutlined,
  ButtonText,
  ButtonTonal,
  btn,
  fab,
} from "~/components/Button"
import { query } from "~/gql/sizzle"

import { useLinkClickHandler } from "react-router-dom"
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

const EntryPageQuery = query(
  "EntryPage",
  {
    id: "Int!",
  },
  ($) => ({
    Media: [
      { id: $.id },
      {
        id: 1,
        coverImage: {
          extraLarge: 1,
          medium: 1,
          color: 1,
        },
        bannerImage: 1,
        title: {
          userPreferred: 1,
        },
        description: 1,
      },
    ],
  }),
)

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

export function getThemeFromHex(hex: string) {
  const theme = themeFromSourceColor(argbFromHex(hex))

  return theme
}

export function useThemeFromHex(hex: string | null | undefined) {
  return useMemo(
    () => (typeof hex === "string" ? getThemeFromHex(hex) : hex),
    [hex],
  )
}

const _loader = pipe(
  Stream.Do,
  Stream.bind("args", () => ClientArgs),
  Stream.bind("client", () => EffectUrql),
  Stream.flatMap(({ client, args: { params } }) =>
    client.query(EntryPageQuery, {
      id: Number(params["mediaId"]),
    }),
  ),
)

export const loader = (async (args) => {
  return pipe(
    _loader,
    Stream.run(Sink.head()),
    Effect.flatten,
    Effect.provide(ServerLive),
    Effect.provideService(LoaderArgs, args),
    Effect.runPromise,
  )
}) satisfies LoaderFunction

export function getStyleFromTheme(
  theme: Theme | undefined | null,
  dark: boolean,
) {
  if (!theme) return {}

  const mapping = dark ? colors.dark : colors.light

  return Object.fromEntries(
    Object.entries(mapping).map(([key, value]) => {
      const [token = "", tone] = value.replace(/(\d+)$/g, "_$1").split("_")

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
    parseInt(r1 + r2, 16),
    parseInt(g1 + g2, 16),
    parseInt(b1 + b2, 16),
  ].join(" ")

  return color
}

export function ChipFilter({
  children,
  ...props
}: ComponentPropsWithoutRef<"input">) {
  return (
    <label className="flex h-8 items-center gap-2 rounded-sm border border-outline px-4 text-label-lg text-on-surface-variant shadow surface state-on-surface-variant hover:state-hover has-[:checked]:border-0 has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container has-[:checked]:elevation-1 has-[:checked]:state-on-secondary-container">
      <input type="checkbox" className="peer hidden" {...props} />

      <ChipFilterIcon></ChipFilterIcon>
      {children}
    </label>
  )
}

export function ChipFilterIcon() {
  return (
    <div className="-ms-2 w-0 opacity-0 transition-all ease-out peer-checked:w-[1.125rem] peer-checked:opacity-100">
      <Check size={18}></Check>
    </div>
  )
}
/**
 * @example
 * useMediaQuery('(max-width > 250px)')
 * */
export function useMediaQuery(input: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(input)
    setMatches(query.matches)

    function listener() {
      setMatches(query.matches)
    }
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [input])

  return matches
}

export const ThemeProvider = ({
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
  const data = useLoader(_loader, useLoaderData<typeof loader>())

  return (
    <>
      <ThemeProvider
        theme={useThemeFromHex(data?.Media?.coverImage?.color)}
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
                src={data?.Media?.coverImage?.extraLarge ?? ""}
                style={{
                  "--bg": `url(${data?.Media?.coverImage?.medium})`,
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
              <CardElevated className="!rounded-xl !p-16">
                <h1 className="text-display-lg text-balance">
                  {data?.Media?.title?.userPreferred}
                </h1>
                <Menu>
                  <MenuTrigger
                    className={btn({
                      className: "cursor-default",
                    })}
                  >
                    Format
                  </MenuTrigger>

                  <MenuList className="top-auto">
                    <li>
                      <MenuItem asChild>
                        <a href="">
                          <MenuItemLeadingIcon>
                            <Eye></Eye>
                          </MenuItemLeadingIcon>
                          Item 1
                        </a>
                      </MenuItem>
                    </li>
                    <MenuItem>
                      <MenuItemLeadingIcon>
                        <Copy></Copy>
                      </MenuItemLeadingIcon>
                      Item 2
                      <MenuItemTrailingText>
                        <Command className="inline">da</Command>+Shift+X
                      </MenuItemTrailingText>
                    </MenuItem>
                    <MenuItem>
                      <MenuItemLeadingIcon>
                        <Pencil></Pencil>
                      </MenuItemLeadingIcon>
                      Item 3
                      <MenuItemTrailingIcon>
                        <Check></Check>
                      </MenuItemTrailingIcon>
                    </MenuItem>
                    <MenuDivider></MenuDivider>
                    <li>
                      <Menu className="group">
                        <MenuItem asChild>
                          <MenuTrigger>
                            <MenuItemLeadingIcon>
                              <Cloud></Cloud>
                            </MenuItemLeadingIcon>
                            Item 4
                            <MenuItemTrailingIcon>
                              <ChevronRight className="group-open:rotate-180"></ChevronRight>
                            </MenuItemTrailingIcon>
                          </MenuTrigger>
                        </MenuItem>
                        <MenuList className="-top-2 left-full">
                          <MenuItem>
                            <MenuItemLeadingIcon>
                              <Eye></Eye>
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
                    __html: data?.Media?.description || "",
                  }}
                ></div>
              </CardElevated>
            </CardFilled>
          </motion.div>

          <MotionLink
            to="edit"
            className={fab({ className: "fixed bottom-4 end-4" })}
            layoutId="edit"
          >
            <Pencil></Pencil>
          </MotionLink>

          <AnimatePresence initial={false}>
            {cloneElement(useOutlet() ?? <></>, {
              key: useLocation().pathname,
            })}
          </AnimatePresence>
        </PaneFlexible>
      </ThemeProvider>
    </>
  )
}

function MotionLink({
  onClick,
  replace = false,
  state,
  target,
  to,
  ...rest
}: Pick<
  ComponentPropsWithoutRef<typeof Link>,
  "onClick" | "replace" | "state" | "target" | "to"
> &
  Omit<ComponentPropsWithoutRef<typeof motion.a>, "href" | "target">) {
  let href = useHref(to)
  let handleClick = useLinkClickHandler(to, {
    replace,
    state,
    ...(target !== undefined ? { target } : {}),
  })

  return (
    <motion.a
      {...rest}
      href={href}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          handleClick(event)
        }
      }}
      target={target}
    />
  )
}
// type X = React.HTMLAttributes<any>

declare global {
  namespace React {
    interface HTMLAttributes<T>
      extends React.AriaAttributes,
        React.DOMAttributes<T> {
      popover?: "manual" | true | "auto" | undefined
    }
  }
}
