import { type ActionFunction, type LoaderFunction } from "@remix-run/node"
import {
  Form,
  Link,
  unstable_useBlocker,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import {
  Effect,
  Option,
  Predicate,
  ReadonlyArray,
  ReadonlyRecord,
  Sink,
  Stream,
  pipe,
} from "effect"

import { ButtonText } from "~/components/Button"

import { sumAll } from "effect/Number"
import {
  TextFieldOutlined,
  TextFieldOutlinedInput,
} from "~/components/TextField"
import { MediaListStatus } from "~/gql/graphql"
import type { InferVariables } from "~/lib/urql"
import {
  ClientArgs,
  EffectUrql,
  LoaderArgs,
  LoaderLive,
  getClient,
  nonNull,
  useLoader,
} from "~/lib/urql"
import { ChipFilter } from "./$mediaId"

import * as S from "@effect/schema/Schema"
import { DialogFullscreenIcon } from "~/components/Dialog"

import * as Ariakit from "@ariakit/react"
import type { FieldConfig, Submission } from "@conform-to/react"
import { conform, useFieldList, useForm } from "@conform-to/react"
import { useSignal } from "@preact/signals-react"
import { motion } from "framer-motion"
import type { FragmentType } from "~/gql"
import { graphql, useFragment } from "~/gql"
import { dialog } from "~/lib/dialog"

import { parse } from "@conform-to/dom"
import { type ComponentPropsWithoutRef } from "react"
import { Select } from "~/components/Select"

function isTouched(form: HTMLFormElement) {
  return !(
    Object.values(form.elements)
      .flatMap((element) =>
        element instanceof HTMLTextAreaElement ? [element] : [],
      )
      .every((element) => element.defaultValue === element.value) &&
    Object.values(form.elements)
      .flatMap((element) =>
        element instanceof HTMLInputElement ? [element] : [],
      )
      .every(
        (element) =>
          element.defaultValue === element.value &&
          element.defaultChecked === element.checked,
      ) &&
    Object.values(form.elements)
      .flatMap((element) =>
        element instanceof HTMLSelectElement ? [element] : [],
      )
      .every((element) =>
        [...element.selectedOptions].every(
          (option) => option.defaultSelected === true,
        ),
      )
  )
}

export const action = (async ({ request, params }): Promise<Submission<{}>> => {
  const formData = await request.formData()

  const submission = parse(formData, {
    resolve(payload) {
      return {
        value: {
          ...payload,
          completedAt: S.parseSync(S.nullable(FuzzyDateInput))(
            formdata?.get("completedAt") || null,
          ),
          startedAt: S.parseSync(S.nullable(FuzzyDateInput))(
            formdata?.get("startedAt") || null,
          ),
        },
      }
    },
  })

  console.log(submission)

  // const submission = SaveVariables(formData)

  if (submission.intent !== "submit" || !submission.value) {
    return submission
  }

  const result = await getClient(request).mutation(Save, submission.value)

  const errorEntries =
    result.error?.graphQLErrors
      .flatMap((error) => {
        return Predicate.isReadonlyRecord(error.originalError) &&
          "validation" in error.originalError &&
          Predicate.isReadonlyRecord(error.originalError["validation"])
          ? Object.entries(error.originalError["validation"])
          : []
      })
      .flatMap(([key, value]) =>
        (Array.isArray(value) ? value : [value]).flatMap((value) =>
          Predicate.isString(value) ? [[key, value] as const] : [],
        ),
      ) ?? []

  const errorKeys = Object.fromEntries(
    errorEntries.map(([key, value]) => [value, key]),
  )

  const error = ReadonlyArray.groupBy(
    errorEntries.map(([, value]) => value),
    (value) => errorKeys[value] ?? "undefined",
  )

  return { ...submission, error }

  return submission
}) satisfies ActionFunction

function avg(nums: number[]) {
  return pipe(
    sumAll(nums) / nums.length,
    Option.some,
    Option.filter(Number.isFinite),
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

export const loader = (async (args) => {
  return pipe(
    _loader,
    Stream.run(Sink.head()),
    Effect.flatten,
    Effect.provide(LoaderLive),
    Effect.provideService(LoaderArgs, args),
    Effect.runPromise,
  )
}) satisfies LoaderFunction

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

const Save = graphql(`
  mutation Save(
    $mediaId: Int
    $advancedScores: [Float]
    $completedAt: FuzzyDateInput
    $startedAt: FuzzyDateInput
    $notes: String
    $progress: Int
    $repeat: Int
    $score: Float
    $status: MediaListStatus
    $customLists: [String]
  ) {
    SaveMediaListEntry(
      advancedScores: $advancedScores
      completedAt: $completedAt
      startedAt: $startedAt
      notes: $notes
      mediaId: $mediaId
      progress: $progress
      repeat: $repeat
      score: $score
      status: $status
      customLists: $customLists
    ) {
      id
    }
  }
`)

const EditPageViewer = graphql(`
  query EditPageViewer {
    Viewer {
      id
      mediaListOptions {
        animeList {
          advancedScoringEnabled
          advancedScoring
          ...AdvancedScores_mediaListTypeOptions
          ...CustomLists_mediaListTypeOptions
        }
        scoreFormat
      }
    }
  }
`)

const EditPageMedia = graphql(`
  query EditPageMedia($id: Int!, $format: ScoreFormat) {
    Media(id: $id) {
      id
      episodes
      mediaListEntry {
        status
        id
        advancedScores
        customLists
        notes
        score(format: $format)
        repeat
        progress
        startedAt {
          day
          month
          year
        }
        completedAt {
          day
          month
          year
        }
      }
    }
  }
`)

const _loader = pipe(
  Stream.Do,
  Stream.bind("args", () => ClientArgs),
  Stream.bind("client", () => EffectUrql),
  Stream.bind("EntryPageUser", ({ client }) =>
    client.query(EditPageViewer, {}),
  ),
  Stream.bind("EntryPage", ({ client, EntryPageUser, args: { params } }) =>
    client.query(EditPageMedia, {
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

const OPTIONS = {
  [MediaListStatus.Current]: "Watching",
  [MediaListStatus.Planning]: "Plan to watch",
  [MediaListStatus.Completed]: "Completed",
  [MediaListStatus.Repeating]: "Rewatching",
  [MediaListStatus.Paused]: "Paused",
  [MediaListStatus.Dropped]: "Dropped",
}

export default function Page() {
  const data = useLoader(_loader, useLoaderData<typeof loader>())

  const score = useSignal(String(data?.Media?.mediaListEntry?.score || 0))

  const navigation = useNavigation()

  const actionData = useActionData<typeof action>()
  const saved = (actionData?.intent === "submit" && !actiondata?.error) ?? false

  const touched = useSignal(false)

  unstable_useBlocker(touched.value)

  const busy = navigation.state === "submitting"

  const lastSubmission = useActionData<typeof action>()

  const advancedScores = pipe(
    Option.fromNullable(data?.Media?.mediaListEntry?.advancedScores),
    Option.filter(Predicate.isReadonlyRecord),
  )

  const [form, fields] = useForm<
    Record<keyof InferVariables<typeof Save>, unknown>
  >({
    defaultValue: {
      advancedScores: data?.Viewer?.mediaListOptions?.animeList
        ?.advancedScoringEnabled
        ? pipe(
            data?.Viewer?.mediaListOptions?.animeList?.advancedScoring
              ?.filter(nonNull)
              .map((category) =>
                pipe(
                  advancedScores,
                  Option.flatMap(ReadonlyRecord.get(category)),
                  Option.filter(Predicate.isNumber),
                  Option.getOrUndefined,
                ),
              ),
          )
        : [],
      completedAt: pipe(
        S.parseOption(FuzzyDateLift)(data?.Media?.mediaListEntry?.completedAt),
        Option.flatMap(Option.all),
        Option.flatMap(S.encodeOption(FuzzyDateInput)),
        Option.getOrUndefined,
      ),
      startedAt: pipe(
        S.parseOption(FuzzyDateLift)(data?.Media?.mediaListEntry?.startedAt),
        Option.flatMap(Option.all),
        Option.flatMap(S.encodeOption(FuzzyDateInput)),
        Option.getOrUndefined,
      ),
      notes: data?.Media?.mediaListEntry?.notes,
      progress: data?.Media?.mediaListEntry?.progress,
      repeat: data?.Media?.mediaListEntry?.repeat,
      score: score.value,
      status: pipe(
        Option.fromNullable(data?.Media?.mediaListEntry?.status),
        Option.flatMap((key) => ReadonlyRecord.get(OPTIONS, key)),
        Option.getOrElse(() => OPTIONS[MediaListStatus.Current]),
      ),
      customLists: pipe(
        Option.fromNullable(data?.Media?.mediaListEntry?.customLists),
        Option.filter(Predicate.isReadonlyRecord),
        Option.map(Object.keys),
        Option.getOrUndefined,
      ),
    },
    ...(lastSubmission ? { lastSubmission } : {}),
  })

  const advancedScoresFields = useFieldList(form, fields["advancedScores"])
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
              render={<motion.div layoutId="edit" initial={false} />}
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
                    className="grid gap-2"
                    onChange={(event) => {
                      touched.value = isTouched(event.currentTarget)
                    }}
                    onReset={(event) => {
                      console.log("reset")
                      touched.value = false
                    }}
                    {...form.props}
                  >
                    <input
                      type="hidden"
                      name="mediaId"
                      value={data?.Media?.id}
                    />
                    <div className="grid grid-cols-1 gap-2  sm:grid-cols-2">
                      <Select
                        options={Object.values(OPTIONS)}
                        {...conform.select(fields.status)}
                        children="Status"
                      />
                      <TextFieldOutlinedInput
                        min={0}
                        step={0.01}
                        onChange={(e) => (score.value = e.currentTarget.value)}
                        {...conform.input(fields["score"], {
                          type: "number",
                        })}
                        children="Score"
                      />

                      <TextFieldOutlined>
                        <TextFieldOutlinedInput
                          min={0}
                          {...conform.input(fields["progress"], {
                            type: "number",
                          })}
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

                      <TextFieldOutlinedInput
                        {...conform.input(fields["startedAt"], {
                          type: "date",
                        })}
                        children="Start Date"
                      />

                      <TextFieldOutlinedInput
                        type="date"
                        {...conform.input(fields["completedAt"], {
                          type: "date",
                        })}
                        children="Finish Date"
                      />

                      <TextFieldOutlinedInput
                        min={0}
                        {...conform.input(fields["repeat"], {
                          type: "number",
                        })}
                        children="Total Rewatches"
                      />
                    </div>

                    <TextFieldOutlinedInput
                      render={<textarea />}
                      spellCheck
                      onInput={(e) => {
                        e.currentTarget.style.height = ""
                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
                      }}
                      {...conform.textarea(fields["notes"])}
                      children="Notes"
                    />

                    {data?.Viewer?.mediaListOptions?.animeList
                      ?.advancedScoringEnabled && (
                      <AdvancedScores
                        form={form}
                        advancedScoring={
                          data?.Viewer?.mediaListOptions?.animeList
                            ?.advancedScoring
                        }
                        fields={advancedScoresFields}
                        onScoreChange={(newScore) => {
                          score.value = newScore
                          console.log(score.value)
                        }}
                      ></AdvancedScores>
                    )}

                    <CustomLists
                      field={fields["customLists"]}
                      mediaListTypeOptions={
                        data?.Viewer?.mediaListOptions?.animeList ?? null
                      }
                    ></CustomLists>
                    <div className="border-b border-outline-variant sm:w-full" />
                    <footer className={actions({ className: "max-sm:hidden" })}>
                      <ButtonText type="reset">Reset</ButtonText>
                      <ButtonText aria-busy={busy} type="submit">
                        {busy && (
                          <ButtonText.Icon className="animate-spin">
                            progress_activity
                          </ButtonText.Icon>
                        )}
                        Save changes
                      </ButtonText>
                    </footer>
                    {/* <Snackbar open={touched}>
                      Careful - you have unsaved changes!
                      <SnackbarAction type="reset">Reset</SnackbarAction>
                      <SnackbarAction
                        onClick={() => form.current!.requestSubmit()}
                      >
                        Save changes
                      </SnackbarAction>
                    </Snackbar> */}
                  </Form>
                </div>
                {/* <Snackbar timeout={4000} open={saved}>
                  Entry saved
                </Snackbar> */}
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

const AdvancedScores_mediaListTypeOptions = graphql(`
  fragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {
    advancedScoring
  }
`)

function calculateAverageScore(
  e: React.FormEvent<HTMLInputElement>,
  advancedScoresFields: FieldConfig<unknown>[],
) {
  const formData = new FormData(e.currentTarget.form ?? undefined)

  console.log({ e: e.currentTarget, formData: Object.fromEntries(formData) })

  return String(
    Math.round(
      avg(
        advancedScoresFields
          .map((field) => field.name)
          .map((name) => formData.get(name))
          .map((s) => Number(s))
          .filter((s) => s),
      ) * 10,
    ) / 10,
  )
}

function AdvancedScores({
  advancedScoring,
  fields,
  onScoreChange:onChange,
  ...props
}: {
  field: FieldConfig<unknown>
} & ComponentPropsWithoutRef<"fieldset">): React.ReactNode {
  if (!fields.length) {
    return null
  }

  return (
    <fieldset className="grid grid-cols-1  gap-2 sm:grid-cols-2" {...props}>
      <legend className="col-span-full mt-2">Advanced Scores</legend>
      {fields.map((field) => {
        return (
          <TextFieldOutlinedInput
            key={field.key}
            min={0}
            step={0.01}
            onChange={(e)=>{
              onChange(calculateAverageScore(e, fields))
            }}
            {...conform.input(field, {
              type: "number",
            })}
            children={advancedScoring[field.key]}
          />
        )
      })}
    </fieldset>
  )
}

const CustomLists_mediaListTypeOptions = graphql(`
  fragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {
    customLists
  }
`)

function CustomLists({
  field,
  ...props
}: {
  field: FieldConfig<unknown>
  mediaListTypeOptions: FragmentType<
    typeof CustomLists_mediaListTypeOptions
  > | null
}) {
  const mediaListTypeOptions = useFragment(
    CustomLists_mediaListTypeOptions,
    props.mediaListTypeOptions,
  )

  const customLists = mediaListTypeOptions?.customLists?.filter(nonNull) ?? []

  if (!customLists.length) {
    return null
  }

  return (
    <fieldset className="grid gap-2">
      <legend>Custom Lists</legend>
      <div className="flex flex-wrap gap-2">
        {conform
          .collection(field, {
            type: "checkbox",
            options: customLists,
          })
          .map((field) => {
            return (
              <ChipFilter {...field} key={field.value}>
                {field.value}
              </ChipFilter>
            )
          })}
      </div>
    </fieldset>
  )
}
