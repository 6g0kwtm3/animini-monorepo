import type {
  ActionFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
  Form,
  Link,
  useLoaderData,
  useNavigation,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import type { Variants } from "framer-motion"
import { motion, useReducedMotion } from "framer-motion"

import type { InferVariables } from "~/lib/urql"
import { getClient, nonNull, useLoadedQuery } from "~/lib/urql"

import type { Theme } from "@material/material-color-utilities"
import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities"
import React, { useEffect, useMemo, useState } from "react"

import colors from "colors.json"

import type * as urql from "urql"

import {
  Context,
  Effect,
  Layer,
  Option,
  Predicate,
  ReadonlyRecord,
  pipe,
} from "effect"
import { sumAll } from "effect/Number"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import type { ComponentPropsWithoutRef } from "react"

import { CardElevated, CardFilled } from "~/components/Card"
import {
  TextFieldOutlined,
  TextFieldOutlinedInput,
} from "~/components/TextField"
import type { ScoreFormat } from "~/gql/graphql"
import { MediaListStatus } from "~/gql/graphql"

import { cssEscape } from "~/lib/cssEscape"

import * as S from "@effect/schema/Schema"
import { ButtonText } from "~/components/Button"
import { mutation, query } from "~/gql/sizzle"

function EntryPageVariables(
  params: Readonly<Params<string>>,
  format: ScoreFormat | null
): InferVariables<typeof EntryPageQuery> {
  return { id: Number(params["mediaId"]), format }
}

const EntryPageUserQuery = query("EntryPageUser", {
  Viewer: {
    id: 1,
    mediaListOptions: {
      animeList: {
        advancedScoringEnabled: 1,
        advancedScoring: 1,
        customLists: 1,
      },
      scoreFormat: 1,
    },
  },
})

const EntryPageQuery = query(
  "EntryPage",
  {
    id: "Int!",
    format: "ScoreFormat",
  },
  ($) => ({
    Media: [
      { id: $.id },
      {
        id: 1,
        episodes: 1,
        mediaListEntry: {
          status: 1,
          id: 1,
          advancedScores: 1,
          customLists: 1,
          notes: 1,
          score: [{ format: $.format }],
          repeat: 1,
          progress: 1,
          startedAt: {
            day: 1,
            month: 1,
            year: 1,
          },
          completedAt: {
            day: 1,
            month: 1,
            year: 1,
          },
        },
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
  })
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
    [hex]
  )
}

function EntryPageUserVariables(
  params: Readonly<Params<string>>
): InferVariables<typeof EntryPageUserQuery> {
  return {}
}

interface EffectClient {
  query<Data = any, Variables extends urql.AnyVariables = urql.AnyVariables>(
    query: urql.DocumentInput<Data, Variables>,
    variables: Variables,
    context?: Partial<urql.OperationContext>
  ): Effect.Effect<never, never, Data | undefined>
  mutation<Data = any, Variables extends urql.AnyVariables = urql.AnyVariables>(
    mutation: urql.DocumentInput<Data, Variables>,
    variables: Variables,
    context?: Partial<urql.OperationContext>
  ): Effect.Effect<never, never, Data | undefined>
}

export const Client = Context.Tag<EffectClient>("urql/Client")
export const LoaderArgs = Context.Tag<LoaderFunctionArgs>("loader/Args")

const ClientLive = Layer.effect(
  Client,
  Effect.map(LoaderArgs, ({ request }) => {
    const client = getClient(request)

    return Client.of({
      query: (query, variables) =>
        pipe(
          Effect.promise(async () => {
            return client
              .query(query, variables, {
                fetchOptions: {
                  signal: request.signal,
                },
              })
              .toPromise()
          }),
          Effect.flatMap((result) => {
            if (result.error?.networkError) {
              Effect.fail(result.error.networkError)
            }
            return Effect.succeed(result.data)
          })
        ),
      mutation: (mutation, variables) =>
        pipe(
          Effect.promise(async () => {
            return client.mutation(mutation, variables).toPromise()
          }),
          Effect.flatMap((result) => {
            if (result.error?.networkError) {
              Effect.fail(result.error.networkError)
            }
            return Effect.succeed(result.data)
          })
        ),
    })
  })
)

const _loader = Effect.gen(function* (_) {
  const { params } = yield* _(LoaderArgs)
  const client = yield* _(Client)

  const EntryPageUser = yield* _(
    client.query(EntryPageUserQuery, EntryPageUserVariables(params))
  )

  return {
    EntryPageUser,
    EntryPage: yield* _(
      client.query(
        EntryPageQuery,
        EntryPageVariables(
          params,
          EntryPageUser?.Viewer?.mediaListOptions?.scoreFormat || null
        )
      )
    ),
  }
})

export const loader = (async (args) => {
  return pipe(
    _loader,
    Effect.provide(ClientLive),
    Effect.provideService(LoaderArgs, args),
    Effect.runPromise
  )

  // const headers = await getHeaders(request)
  // const EntryPageUser = await getClient(request).query(
  //   EntryPageUserQuery,
  //   EntryPageUserVariables(params),
  //   headers
  // )

  // return {
  //   EntryPageUser,
  //   EntryPage: await getClient(request).query(
  //     EntryPageQuery,
  //     EntryPageVariables(
  //       params,
  //       EntryPageUser.data?.Viewer?.mediaListOptions?.scoreFormat
  //     ),
  //     headers
  //   ),
  // }
}) satisfies LoaderFunction

export function getStyleFromTheme(
  theme: Theme | undefined | null,
  dark: boolean
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
    })
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
    <label className="has-[:checked]:bg-secondary-container has-[:checked]:elevation-1 shadow surface has-[:checked]:border-0 border border-outline h-8 gap-2 flex items-center px-4 rounded-sm text-label-lg text-on-surface-variant has-[:checked]:text-on-secondary-container has-[:checked]:state-on-secondary-container state-on-surface-variant hover:state-hover">
      <input type="checkbox" className="peer hidden" {...props} />

      <ChipFilterIcon></ChipFilterIcon>
      {children}
    </label>
  )
}

export function ChipFilterIcon() {
  return (
    <div className="-ml-2 peer-checked:opacity-100 opacity-0 peer-checked:w-[1.125rem] w-0 transition-all ease-out">
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
  const id = React.useId()

  return (
    <div {...props} id={id}>
      <style>
        {`#${cssEscape(id)}{${Object.entries(getStyleFromTheme(theme, false))
          .map(([key, value]) => `${key}:${value};`)
          .join("")}} @media(prefers-color-scheme: dark){#${cssEscape(
          id
        )}{${Object.entries(getStyleFromTheme(theme, true))
          .map(([key, value]) => `${key}:${value};`)
          .join("")}}}`}
      </style>

      {children}
    </div>
  )
}

const Save = mutation(
  "Save",
  {
    mediaId: "Int!",
    advancedScores: "[Float]",
    completedAt: "FuzzyDateInput",
    startedAt: "FuzzyDateInput",
    notes: "String",
    progress: "Int",
    repeat: "Int",
    score: "Float",
    status: "MediaListStatus",
    customLists: "[String]",
  },
  ($) => ({
    SaveMediaListEntry: [
      $,
      {
        id: 1,
      },
    ],
  })
)

const UnpadStart = (maxLength: number, fillString?: string | undefined) =>
  S.transform(
    S.string,
    S.string,
    (s) => s.replace(new RegExp(`^${fillString}{0,${maxLength}}`), ""),
    (s) => s.padStart(maxLength, fillString)
  )

const FuzzyDateInput = S.compose(
  S.compose(
    S.compose(
      S.split(S.string, "-"),
      S.tuple(UnpadStart(4, "0"), UnpadStart(2, "0"), UnpadStart(2, "0"))
    ),
    S.tuple(S.NumberFromString, S.NumberFromString, S.NumberFromString)
  ),
  S.transform(
    S.tuple(S.number, S.number, S.number),
    S.struct({
      year: S.number,
      month: S.number,
      day: S.number,
    }),
    ([year, month, day]) => ({ year, month, day }),
    ({ year, month, day }) => [year, month, day]
  )
)

const SaveVariablesSchema = S.struct({
  mediaId: S.NumberFromString,
  advancedScores: S.array(S.NumberFromString),
  completedAt: FuzzyDateInput,
  startedAt: FuzzyDateInput,
  notes: S.string,
  progress: S.NumberFromString,
  repeat: S.NumberFromString,
  score: S.NumberFromString,
  status: S.string,
  customLists: S.array(S.string),
})

function SaveVariables(
  params: Readonly<Params<string>>,
  formData: FormData
): InferVariables<typeof Save> {
  const advancedScores = formData
    .getAll("advancedScores")
    .map((score) => Number(score))

  // return S.parseSync(SaveVariablesSchema)({
  //   mediaId: params["mediaId"],
  //   advancedScores,
  //   completedAt: formData.get("completedAt"),
  //   startedAt: formData.get("startedAt"),
  //   notes: formData.get("notes"),
  //   progress: formData.get("progress"),
  //   repeat: formData.get("repeat"),
  //   score: formData.get("score") || avg(advancedScores),
  //   status: formData.get("status"),
  //   customLists: formData.getAll("customLists"),
  // })

  return {
    mediaId: Number(params["mediaId"]),
    advancedScores,
    completedAt: S.parseSync(S.nullable(FuzzyDateInput))(
      formData.get("completedAt") || null
    ),
    startedAt: S.parseSync(S.nullable(FuzzyDateInput))(
      formData.get("startedAt") || null
    ),
    notes: String(formData.get("notes")),
    progress: Number(formData.get("progress")) || 0,
    repeat: Number(formData.get("repeat")) || 0,
    score: Number(formData.get("score")) || avg(advancedScores) || 0,
    status: getStatus(String(formData.get("status"))) || null,
    customLists: formData.getAll("customLists").map(String),
  }
}

function avg(nums: number[]) {
  return pipe(
    sumAll(nums) / nums.length,
    Option.some,
    Option.filter(isFinite),
    Option.getOrElse(() => 0)
  )
}

function getStatus(status: string) {
  if (
    status === MediaListStatus.Completed ||
    status === MediaListStatus.Current ||
    status === MediaListStatus.Dropped ||
    status === MediaListStatus.Paused ||
    status === MediaListStatus.Planning ||
    status === MediaListStatus.Repeating
  ) {
    return status
  }
  return undefined
}

export const action = (async ({ request, params }) => {
  // const variables = SaveVariables(params, await request.formData())
  // console.log(variables)
  // return {}
  const variables = SaveVariables(params, await request.formData())

  const result = await getClient(request).mutation(Save, variables)
  if (result.error) {
    console.error(variables)
    console.error(result.error.graphQLErrors.at(0)?.originalError)
    throw result.error
  }

  return null
}) satisfies ActionFunction

export default function Page() {
  const params = useParams()
  const loaderData = useLoaderData<typeof loader>()

  const [EntryPageUser] = useLoadedQuery(
    {
      query: EntryPageUserQuery,
      variables: EntryPageUserVariables(params),
    },
    loaderData.EntryPageUser
  )

  const [EntryPage] = useLoadedQuery(
    {
      query: EntryPageQuery,
      variables: EntryPageVariables(
        params,
        EntryPageUser.data?.Viewer?.mediaListOptions?.scoreFormat || null
      ),
    },
    loaderData.EntryPage
  )

  const [score, setScore] = useState(
    String(EntryPage.data?.Media?.mediaListEntry?.score || 0)
  )

  const navigation = useNavigation()

  const busy = navigation.state === "submitting"

  return (
    <ThemeProvider
      theme={useThemeFromHex(EntryPage.data?.Media?.coverImage?.color)}
      className="relative"
    >
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
        <CardFilled className="flex-1 grid gap-4 rounded-[2.5rem]">
          <img
            src={EntryPage.data?.Media?.coverImage?.extraLarge ?? ""}
            style={{
              "--bg": `url(${EntryPage.data?.Media?.coverImage?.medium})`,
            }}
            loading="lazy"
            className="rounded-xl bg-[image:--bg]"
            alt=""
          />
          {/* <div className="grid gap-4 flex-1">
        <img
          src={EntryPage.data?.Media?.bannerImage ?? ""}
          loading="lazy"
          className="rounded-xl"
          alt=""
        />


        </div>
        <div className="border-outline-variant border-r min-h-full"></div> */}
          <CardElevated className="!rounded-xl !p-16">
            <h1 className="text-display-lg text-balance">
              {EntryPage.data?.Media?.title?.userPreferred}
            </h1>
            <div
              className="text-title-lg"
              dangerouslySetInnerHTML={{
                __html: EntryPage.data?.Media?.description || "",
              }}
            ></div>
          </CardElevated>
        </CardFilled>

        <CardFilled className="flex-1">
          {/* <div className="flex gap-2">
            <FilledButton>Favourite</FilledButton>
        
            <OutlinedButton>Favourite</OutlinedButton>
            <Text>Favourite</Text>
            <ElevatedButton>Favourite</ElevatedButton>
            <TonalButton>Edit</TonalButton>
          </div> */}
          <div className="p-2">
            <Form method="post" className="grid gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-2">
                <TextFieldOutlined>
                  <TextFieldOutlinedInput
                    asChild
                    name="status"
                    defaultValue={
                      EntryPage.data?.Media?.mediaListEntry?.status ?? undefined
                    }
                  >
                    <select>
                      {[
                        ["Watching", MediaListStatus.Current],
                        ["Plan to watch", MediaListStatus.Planning],
                        ["Completed", MediaListStatus.Completed],
                        ["Rewatching", MediaListStatus.Repeating],
                        ["Paused", MediaListStatus.Paused],
                        ["Dropped", MediaListStatus.Dropped],
                      ].map(([label, value]) => {
                        return (
                          <option
                            key={value}
                            value={value}
                            className="bg-surface-container text-on-surface text-label-lg surface elevation-2"
                          >
                            {label}
                          </option>
                        )
                      })}
                    </select>
                  </TextFieldOutlinedInput>
                  <TextFieldOutlined.Label>Status</TextFieldOutlined.Label>
                  <TextFieldOutlined.TrailingIcon className="absolute right-0 pointer-events-none">
                    <ChevronDown></ChevronDown>
                  </TextFieldOutlined.TrailingIcon>
                </TextFieldOutlined>

                <TextFieldOutlined>
                  <TextFieldOutlinedInput
                    type="number"
                    name="score"
                    min={0}
                    step={0.1}
                    onChange={(e) => setScore(e.currentTarget.value)}
                    value={score}
                  />
                  <TextFieldOutlined.Label>Score</TextFieldOutlined.Label>
                </TextFieldOutlined>
                <TextFieldOutlined>
                  <TextFieldOutlinedInput
                    name="progress"
                    type="number"
                    min={0}
                    defaultValue={
                      EntryPage.data?.Media?.mediaListEntry?.progress ??
                      undefined
                    }
                    className={
                      typeof EntryPage.data?.Media?.episodes === "number"
                        ? "text-right [&::-webkit-inner-spin-button]:hidden"
                        : ""
                    }
                  />
                  <TextFieldOutlined.Label>
                    Episode Progress
                  </TextFieldOutlined.Label>
                  {typeof EntryPage.data?.Media?.episodes === "number" && (
                    <TextFieldOutlined.Suffix className="pointer-events-none">
                      /{EntryPage.data?.Media?.episodes}
                    </TextFieldOutlined.Suffix>
                  )}
                </TextFieldOutlined>
                <TextFieldOutlined>
                  <TextFieldOutlinedInput
                    name="startedAt"
                    type="date"
                    defaultValue={pipe(
                      S.parseOption(FuzzyDateLift)(
                        EntryPage.data?.Media?.mediaListEntry?.startedAt
                      ),
                      Option.flatMap(Option.all),
                      Option.flatMap(S.encodeOption(FuzzyDateInput)),
                      Option.getOrUndefined
                    )}
                  />
                  <TextFieldOutlined.Label>Start Date</TextFieldOutlined.Label>
                </TextFieldOutlined>
                <TextFieldOutlined>
                  <TextFieldOutlinedInput
                    name="completedAt"
                    type="date"
                    defaultValue={pipe(
                      S.parseOption(FuzzyDateLift)(
                        EntryPage.data?.Media?.mediaListEntry?.completedAt
                      ),
                      Option.flatMap(Option.all),
                      Option.flatMap(S.encodeOption(FuzzyDateInput)),
                      Option.getOrUndefined
                    )}
                  />
                  <TextFieldOutlined.Label>Finish Date</TextFieldOutlined.Label>
                </TextFieldOutlined>
                <TextFieldOutlined>
                  <TextFieldOutlinedInput
                    name="repeat"
                    type="number"
                    min={0}
                    defaultValue={
                      EntryPage.data?.Media?.mediaListEntry?.repeat ?? undefined
                    }
                  />
                  <TextFieldOutlined.Label>
                    Total Rewatches
                  </TextFieldOutlined.Label>
                </TextFieldOutlined>
              </div>
              <TextFieldOutlined className="">
                <TextFieldOutlinedInput
                  asChild
                  children={<textarea />}
                  spellCheck
                  name="notes"
                  onInput={function (e) {
                    e.currentTarget.style.height = ""
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                  }}
                  defaultValue={
                    EntryPage.data?.Media?.mediaListEntry?.notes ?? undefined
                  }
                />
                <TextFieldOutlined.Label>Notes</TextFieldOutlined.Label>
              </TextFieldOutlined>
              {EntryPageUser.data?.Viewer?.mediaListOptions?.animeList
                ?.advancedScoringEnabled && (
                <fieldset className="grid-cols-1 sm:grid-cols-2  grid gap-2">
                  <legend className="col-span-full mt-2">
                    Advanced Scores
                  </legend>
                  {EntryPageUser.data?.Viewer.mediaListOptions.animeList.advancedScoring
                    ?.filter(nonNull)
                    .map((category, i) => {
                      return (
                        <TextFieldOutlined key={category}>
                          <TextFieldOutlinedInput
                            onChange={(e) => {
                              const formData = new FormData(
                                e.currentTarget.form ?? undefined
                              )
                              setScore(
                                String(
                                  Math.round(
                                    avg(
                                      formData
                                        .getAll("advancedScores")
                                        .map((s) => Number(s))
                                        .filter((s) => s)
                                    ) * 10
                                  ) / 10
                                )
                              )
                            }}
                            type="number"
                            min={0}
                            step={0.1}
                            name="advancedScores"
                            defaultValue={pipe(
                              Option.fromNullable(
                                EntryPage.data?.Media?.mediaListEntry
                                  ?.advancedScores
                              ),
                              Option.filter(Predicate.isReadonlyRecord),
                              Option.flatMap(ReadonlyRecord.get(category)),
                              Option.filter(Predicate.isNumber),
                              Option.getOrUndefined
                            )}
                          />
                          <TextFieldOutlined.Label>
                            {category}
                          </TextFieldOutlined.Label>
                        </TextFieldOutlined>
                      )
                    })}
                </fieldset>
              )}
              <fieldset className="grid gap-2">
                <legend className="">Custom Lists</legend>
                <div className="flex flex-wrap gap-2">
                  {EntryPageUser.data?.Viewer?.mediaListOptions?.animeList?.customLists
                    ?.filter(nonNull)
                    .map((list) => {
                      return (
                        <ChipFilter
                          name="customLists"
                          key={list}
                          value={list}
                          defaultChecked={pipe(
                            Option.fromNullable(
                              EntryPage.data?.Media?.mediaListEntry?.customLists
                            ),
                            Option.filter(Predicate.isReadonlyRecord),
                            Option.flatMap(ReadonlyRecord.get(list)),
                            Option.filter(Predicate.isBoolean),
                            Option.getOrUndefined
                          )}
                        >
                          {list}
                        </ChipFilter>
                      )
                    })}
                </div>
              </fieldset>
              <div className="border-outline-variant border-b w-full" />
              {/* <nav className="flex gap-2">
                <button type="button" className="btn btn-outlined">
                  <Outlined.Icon>
                    <Heart size={18}></Heart>
                  </Outlined.Icon>
                  Favourite
                </button>
                <Tonal>
                  <Tonal.Icon>
                    <Pencil size={18}></Pencil>
                  </Tonal.Icon>
                  Edit
                </Tonal>
              </nav> */}
              <nav className="flex gap-2 justify-between">
                <ButtonText asChild>
                  <Link to={`..?${useSearchParams()[0]}`} relative="path">
                    Back
                  </Link>
                </ButtonText>
                <ButtonText>
                  {busy && (
                    <ButtonText.Icon className="animate-spin">
                      <Loader2 size={18}></Loader2>
                    </ButtonText.Icon>
                  )}
                  Save
                </ButtonText>
              </nav>
            </Form>
          </div>
        </CardFilled>
      </motion.div>
    </ThemeProvider>
  )
}

const FuzzyDateLift = S.struct({
  month: S.optionFromNullable(S.number),
  year: S.optionFromNullable(S.number),
  day: S.optionFromNullable(S.number),
})
