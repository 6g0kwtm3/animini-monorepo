import type { ActionFunction } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
  Form,
  Link,
  unstable_useBlocker,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { Option, Predicate, ReadonlyRecord, Stream, pipe } from "effect"

import { useRef, useState } from "react"
import { ButtonText } from "~/components/Button"

import { sumAll } from "effect/Number"
import { Snackbar, SnackbarAction } from "~/components/Snackbar"
import TextFieldOutlined, {
  TextFieldOutlinedInput,
} from "~/components/TextField"
import { MediaListStatus } from "~/gql/graphql"
import type { InferVariables } from "~/lib/urql"
import {
  ClientArgs,
  EffectUrql,
  getClient,
  nonNull,
  useLoader,
} from "~/lib/urql"
import type { loader } from "./$mediaId"
import { ChipFilter } from "./$mediaId"

import * as S from "@effect/schema/Schema"
import { DialogFullscreenIcon } from "~/components/Dialog"

import { mutation, query } from "~/gql/sizzle"

import * as Ariakit from "@ariakit/react"
import { motion } from "framer-motion"
import { dialog } from "~/lib/dialog"
import { useSignal } from "@preact/signals-react"

function ChevronDown() {
  return null
}
function Loader2() {
  return null
}
function X() {
  return null
}

function isTouched(form: HTMLFormElement) {
  return !(
    Object.values(form.elements)
      .flatMap((el) => (el instanceof HTMLTextAreaElement ? [el] : []))
      .every((el) => el.defaultValue === el.value) &&
    Object.values(form.elements)
      .flatMap((el) => (el instanceof HTMLInputElement ? [el] : []))
      .every(
        (el) =>
          el.defaultValue === el.value && el.defaultChecked === el.checked,
      ) &&
    Object.values(form.elements)
      .flatMap((el) => (el instanceof HTMLSelectElement ? [el] : []))
      .every((el) =>
        Array.from(el.selectedOptions).every(
          (option) => option.defaultSelected === true,
        ),
      )
  )
}

function SaveVariables(
  params: Readonly<Params<string>>,
  formData: FormData,
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
      formData.get("completedAt") || null,
    ),
    startedAt: S.parseSync(S.nullable(FuzzyDateInput))(
      formData.get("startedAt") || null,
    ),
    notes: String(formData.get("notes")),
    progress: Number(formData.get("progress")) || 0,
    repeat: Number(formData.get("repeat")) || 0,
    score: Number(formData.get("score")) || avg(advancedScores) || 0,
    status: getStatus(String(formData.get("status"))) || null,
    customLists: formData.getAll("customLists").map(String),
  }
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

  return { saved: true }
}) satisfies ActionFunction

function avg(nums: number[]) {
  return pipe(
    sumAll(nums) / nums.length,
    Option.some,
    Option.filter(isFinite),
    Option.getOrElse(() => 0),
  )
}

const UnpadStart = (maxLength: number, fillString?: string | undefined) =>
  S.transform(
    S.string,
    S.string,
    (s) => s.replace(new RegExp(`^${fillString}{0,${maxLength}}`), ""),
    (s) => s.padStart(maxLength, fillString),
  )

const FuzzyDateInput = S.compose(
  S.compose(
    S.compose(
      S.split(S.string, "-"),
      S.tuple(
        S.nullable(UnpadStart(4, "0")),
        S.nullable(UnpadStart(2, "0")),
        S.nullable(UnpadStart(2, "0")),
      ),
    ),
    S.tuple(
      S.nullable(S.NumberFromString),
      S.nullable(S.NumberFromString),
      S.nullable(S.NumberFromString),
    ),
  ),
  S.transform(
    S.tuple(S.nullable(S.number), S.nullable(S.number), S.nullable(S.number)),
    S.struct({
      year: S.nullable(S.number),
      month: S.nullable(S.number),
      day: S.nullable(S.number),
    }),
    ([year, month, day]) => ({ year, month, day }),
    ({ year, month, day }) => [year, month, day] as const,
  ),
)

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
  }),
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

const EntryPageUserQuery = query("EntryIndexPageUser", {
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
  "EntryIndexPage",
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
      },
    ],
  }),
)

const _loader = pipe(
  Stream.Do,
  Stream.bind("args", () => ClientArgs),
  Stream.bind("client", () => EffectUrql),
  Stream.bind("EntryPageUser", ({ client }) =>
    client.query(EntryPageUserQuery, {}),
  ),
  Stream.bind("EntryPage", ({ client, EntryPageUser, args: { params } }) =>
    client.query(EntryPageQuery, {
      format: EntryPageUser?.Viewer?.mediaListOptions?.scoreFormat || null,
      id: Number(params["mediaId"]),
    }),
  ),
  Stream.map(({ EntryPageUser, EntryPage }) => ({
    ...EntryPageUser,
    ...EntryPage,
  })),
)

const { root, content, headline, backdrop, body, actions } = dialog({
  variant: {
    initial: "fullscreen",
    sm: "basic",
  },
})

export default function Page() {
  const data = useLoader(_loader, useLoaderData<typeof loader>())

  const score = useSignal(String(data?.Media?.mediaListEntry?.score || 0))

  const navigation = useNavigation()

  const actionData = useActionData<typeof action>()
  const saved = actionData?.saved ?? false
  const form = useRef<HTMLFormElement>(null)
  const touched = useSignal(false)
  unstable_useBlocker(touched)
  const busy = navigation.state === "submitting"

  return (
    <>
      <>
        <div>
          <div>
            <Ariakit.Dialog
              portal={false}
              alwaysVisible
              hideOnInteractOutside={false}
              className={root()}
              backdrop={<div className={backdrop()} />}
              render={<motion.div layoutId="edit" />}
            >
              <div className={content()}>
                <header className={headline()}>
                  <DialogFullscreenIcon className="sm:hidden">
                    <Ariakit.DialogDismiss
                      render={
                        <Link to=".." replace>
                          <span className="i">close</span>
                          <div className="sr-only">Cancel</div>
                        </Link>
                      }
                    />
                  </DialogFullscreenIcon>
                  Foo fa ra fa
                  <ButtonText type="submit" className="ms-auto sm:hidden">
                    Save
                  </ButtonText>
                </header>
                <div className={body()}>
                  <Form
                    method="post"
                    ref={form}
                    className="grid gap-2"
                    onChange={(e) => {
                      touched.value = isTouched(e.currentTarget)
                    }}
                    onReset={(e) => {
                      console.log("reset")
                      score.value = String(
                        data?.Media?.mediaListEntry?.score || 0,
                      )
                      touched.value = false
                    }}
                  >
                    <div className="grid grid-cols-1 gap-2  sm:grid-cols-2">
                      <TextFieldOutlined>
                        <TextFieldOutlinedInput
                          asChild
                          name="status"
                          defaultValue={
                            data?.Media?.mediaListEntry?.status ?? undefined
                          }
                          className="appearance-none"
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
                                  className="bg-surface-container text-label-lg text-on-surface surface elevation-2"
                                >
                                  {label}
                                </option>
                              )
                            })}
                          </select>
                        </TextFieldOutlinedInput>
                        <TextFieldOutlined.Label>
                          Status
                        </TextFieldOutlined.Label>
                        <TextFieldOutlined.TrailingIcon className="pointer-events-none absolute right-0">
                          <ChevronDown></ChevronDown>
                        </TextFieldOutlined.TrailingIcon>
                      </TextFieldOutlined>
                      <TextFieldOutlined>
                        <TextFieldOutlinedInput
                          type="number"
                          name="score"
                          min={0}
                          step={0.01}
                          onChange={(e) =>
                            (score.value = e.currentTarget.value)
                          }
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
                            data?.Media?.mediaListEntry?.progress ?? undefined
                          }
                          className={
                            Number.isFinite(data?.Media?.episodes)
                              ? "text-right [appearance:textfield] [&::-webkit-inner-spin-button]:hidden"
                              : ""
                          }
                        />
                        <TextFieldOutlined.Label>
                          Episode Progress
                        </TextFieldOutlined.Label>
                        {Number.isFinite(data?.Media?.episodes) && (
                          <TextFieldOutlined.Suffix className="pointer-events-none">
                            /{data?.Media?.episodes}
                          </TextFieldOutlined.Suffix>
                        )}
                      </TextFieldOutlined>
                      <TextFieldOutlined>
                        <TextFieldOutlinedInput
                          name="startedAt"
                          type="date"
                          defaultValue={pipe(
                            S.parseOption(FuzzyDateLift)(
                              data?.Media?.mediaListEntry?.startedAt,
                            ),
                            Option.flatMap(Option.all),
                            Option.flatMap(S.encodeOption(FuzzyDateInput)),
                            Option.getOrUndefined,
                          )}
                        />
                        <TextFieldOutlined.Label>
                          Start Date
                        </TextFieldOutlined.Label>
                      </TextFieldOutlined>
                      <TextFieldOutlined>
                        <TextFieldOutlinedInput
                          name="completedAt"
                          type="date"
                          defaultValue={pipe(
                            S.parseOption(FuzzyDateLift)(
                              data?.Media?.mediaListEntry?.completedAt,
                            ),
                            Option.flatMap(Option.all),
                            Option.flatMap(S.encodeOption(FuzzyDateInput)),
                            Option.getOrUndefined,
                          )}
                        />
                        <TextFieldOutlined.Label>
                          Finish Date
                        </TextFieldOutlined.Label>
                      </TextFieldOutlined>
                      <TextFieldOutlined>
                        <TextFieldOutlinedInput
                          name="repeat"
                          type="number"
                          min={0}
                          defaultValue={
                            data?.Media?.mediaListEntry?.repeat ?? undefined
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
                        onInput={(e) => {
                          e.currentTarget.style.height = ""
                          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                        }}
                        defaultValue={
                          data?.Media?.mediaListEntry?.notes ?? undefined
                        }
                      />
                      <TextFieldOutlined.Label>Notes</TextFieldOutlined.Label>
                    </TextFieldOutlined>
                    {data?.Viewer?.mediaListOptions?.animeList
                      ?.advancedScoringEnabled && (
                      <fieldset className="grid grid-cols-1  gap-2 sm:grid-cols-2">
                        <legend className="col-span-full mt-2">
                          Advanced Scores
                        </legend>
                        {data?.Viewer.mediaListOptions.animeList.advancedScoring
                          ?.filter(nonNull)
                          .map((category, i) => {
                            return (
                              <TextFieldOutlined key={category}>
                                <TextFieldOutlinedInput
                                  onChange={(e) => {
                                    const formData = new FormData(
                                      e.currentTarget.form ?? undefined,
                                    )
                                    score.value = String(
                                      Math.round(
                                        avg(
                                          formData
                                            .getAll("advancedScores")
                                            .map((s) => Number(s))
                                            .filter((s) => s),
                                        ) * 10,
                                      ) / 10,
                                    )
                                  }}
                                  type="number"
                                  min={0}
                                  step={0.01}
                                  name="advancedScores"
                                  defaultValue={pipe(
                                    Option.fromNullable(
                                      data?.Media?.mediaListEntry
                                        ?.advancedScores,
                                    ),
                                    Option.filter(Predicate.isReadonlyRecord),
                                    Option.flatMap(
                                      ReadonlyRecord.get(category),
                                    ),
                                    Option.filter(Predicate.isNumber),
                                    Option.getOrUndefined,
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
                        {data?.Viewer?.mediaListOptions?.animeList?.customLists
                          ?.filter(nonNull)
                          .map((list) => {
                            return (
                              <ChipFilter
                                name="customLists"
                                key={list}
                                value={list}
                                defaultChecked={pipe(
                                  Option.fromNullable(
                                    data?.Media?.mediaListEntry?.customLists,
                                  ),
                                  Option.filter(Predicate.isReadonlyRecord),
                                  Option.flatMap(ReadonlyRecord.get(list)),
                                  Option.filter(Predicate.isBoolean),
                                  Option.getOrUndefined,
                                )}
                              >
                                {list}
                              </ChipFilter>
                            )
                          })}
                      </div>
                    </fieldset>
                    <div className="border-b border-outline-variant sm:w-full" />
                    <footer className={actions({ className: "max-sm:hidden" })}>
                      <ButtonText type="reset">Reset</ButtonText>
                      <ButtonText aria-busy={busy}>
                        {busy && (
                          <ButtonText.Icon className="animate-spin">
                            <Loader2 size={18}></Loader2>
                          </ButtonText.Icon>
                        )}
                        Save changes
                      </ButtonText>
                    </footer>
                    <Snackbar open={touched}>
                      Careful - you have unsaved changes!
                      <SnackbarAction type="reset">Reset</SnackbarAction>
                      <SnackbarAction
                        onClick={() => form.current!.requestSubmit()}
                      >
                        Save changes
                      </SnackbarAction>
                    </Snackbar>
                  </Form>
                </div>
                <Snackbar timeout={4000} open={saved}>
                  Entry saved
                </Snackbar>
              </div>
            </Ariakit.Dialog>
          </div>
        </div>
      </>
    </>
  )
}

const FuzzyDateLift = S.struct({
  month: S.optionFromNullable(S.number),
  year: S.optionFromNullable(S.number),
  day: S.optionFromNullable(S.number),
})
