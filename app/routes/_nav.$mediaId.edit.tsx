import {
	redirect,
	type ActionFunction,
	type LoaderFunction,
} from "@remix-run/node"
import {
	Link,
	useActionData,
	useFetcher,
	useNavigate,
	useNavigation,
	type ClientLoaderFunction,
} from "@remix-run/react"
import {
	Effect,
	Option,
	Predicate,
	ReadonlyArray,
	ReadonlyRecord,
	pipe,
} from "effect"

import { ButtonText } from "~/components/Button"

import { divide, sumAll } from "effect/Number"
import {
	TextFieldOutlined,
	TextFieldOutlinedInput,
	TextFieldOutlinedInputFactory,
} from "~/components/TextField"
import { MediaListStatus } from "~/gql/graphql"
import {
	ClientArgs,
	ClientLoaderLive,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	nonNull,
	raw,
	useRawLoaderData,
} from "~/lib/urql"

import * as S from "@effect/schema/Schema"
import { DialogFullscreenIcon } from "~/components/Dialog"

import * as Ariakit from "@ariakit/react"

import { motion } from "framer-motion"
import type { FragmentType } from "~/gql"
import { graphql, useFragment } from "~/gql"
import { dialog } from "~/lib/dialog"

import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { ChipFilter } from "~/components/Chip"
import { SelectFactory } from "~/components/Select"
import { SelectOption } from "~/components/SelectOption"
import { button } from "~/lib/button"

export const action = (async ({ request, params }): Promise<Submission<{}>> => {
	const formData = await request.formData()

	const submission = parse(formData, {
		resolve(payload) {
			return {
				value: {
					...payload,
					status: Object.entries(OPTIONS).find(
						([, value]) => value === formData.get("status"),
					)?.[0],
					completedAt: S.parseSync(S.nullable(FuzzyDateInput))(
						formData.get("completedAt") || null,
					),
					startedAt: S.parseSync(S.nullable(FuzzyDateInput))(
						formData.get("startedAt") || null,
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

	console.log("request")
	const result = await getClient(request).mutation(Save, submission.value)

	console.log(result)

	if (!result.error) {
		throw redirect("..")
	}

	if (result.error.networkError) {
	}

	const errorEntries =
		result.error.graphQLErrors
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
		Effect.map((data) =>
			Predicate.isNotNull(data.Viewer) ? raw(data) : redirect(".."),
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
	return pipe(
		_loader,
		Effect.map((data) =>
			Predicate.isNotNull(data.Viewer) ? raw(data) : redirect(".."),
		),
		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies ClientLoaderFunction

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
					...CustomLists_mediaListTypeOptions
				}
				mangaList {
					advancedScoringEnabled
					advancedScoring
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
			type
			...Progress_media
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
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.bind("EntryPageUser", ({ client }) =>
		client.query(EditPageViewer, {}),
	),
	Effect.bind("EntryPage", ({ client, EntryPageUser, args: { params } }) =>
		client.query(EditPageMedia, {
			format: EntryPageUser?.Viewer?.mediaListOptions?.scoreFormat || null,
			id: Number(params["mediaId"]),
		}),
	),
	Effect.map(({ EntryPageUser, EntryPage }) => ({
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

const Score = (
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedInputFactory>,
		"label"
	>,
) => (
	<TextFieldOutlinedInputFactory
		{...props}
		min={0}
		step={0.01}
		type="number"
		label="Score"
	/>
)
export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	const navigation = useNavigation()

	const actionData = useActionData<typeof action>()

	const busy = navigation.state === "submitting"

	const advancedScores = pipe(
		Option.fromNullable(data.Media?.mediaListEntry?.advancedScores),
		Option.filter(Predicate.isReadonlyRecord),
	)

	const defaultAdvancedScores =
		pipe(
			data.Viewer?.mediaListOptions?.animeList?.advancedScoring
				?.filter(nonNull)
				.map((category) =>
					pipe(
						advancedScores,
						Option.flatMap(ReadonlyRecord.get(category)),
						Option.filter(Predicate.isNumber),
						Option.getOrElse(() => 0),
					),
				),
		) ?? []

	const navigate = useNavigate()

	const store = Ariakit.useFormStore({
		defaultValues: {
			advancedScores: defaultAdvancedScores,
			completedAt: pipe(
				S.parseOption(FuzzyDateLift)(data.Media?.mediaListEntry?.completedAt),
				Option.flatMap(Option.all),
				Option.flatMap(S.encodeOption(FuzzyDateInput)),
				Option.getOrElse(() => ""),
			),
			startedAt: pipe(
				S.parseOption(FuzzyDateLift)(data.Media?.mediaListEntry?.startedAt),
				Option.flatMap(Option.all),
				Option.flatMap(S.encodeOption(FuzzyDateInput)),
				Option.getOrElse(() => ""),
			),
			notes: data.Media?.mediaListEntry?.notes ?? "",
			progress: data.Media?.mediaListEntry?.progress || 0,
			repeat: data.Media?.mediaListEntry?.repeat || 0,
			score: data.Media?.mediaListEntry?.score || 0,
			status: pipe(
				Option.fromNullable(data.Media?.mediaListEntry?.status),
				Option.flatMap((key) => ReadonlyRecord.get(OPTIONS, key)),
				Option.getOrElse(() => OPTIONS[MediaListStatus.Current]),
			),
			customLists: pipe(
				Option.fromNullable(data.Media?.mediaListEntry?.customLists),
				Option.filter(Predicate.isReadonlyRecord),
				Option.getOrElse(ReadonlyRecord.empty),
				ReadonlyRecord.filter((key) => !!key),
				Object.keys,
			),
		},
	})

	const fetcher = useFetcher()

	store.useSubmit(async (state) => {
		await new Promise((resolve) => setTimeout(resolve, 10_000, state))
		// fetcher.submit(state.values, { method: "post" })
	})

	const values = store.useState("values")

	const avgScore = pipe(
		values.advancedScores.map((n) => Number(n)),
		avg,
		Option.getOrElse(() => 0),
		round,
	)

	function avg(numbers: number[]) {
		return divide(sumAll(numbers), numbers.length)
	}

	function round(n: number) {
		return Math.round(n * 10) / 10
	}

	const listOptions =
		data.Media?.type === "MANGA"
			? data.Viewer?.mediaListOptions?.mangaList
			: data.Viewer?.mediaListOptions?.animeList
	// useEffect(() => store.setValue("score", avgScore), [store, avgScore])

	return (
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
					<Ariakit.Form store={store} method="post" className={content({})}>
						<header className={headline({ className: "text-balance" })}>
							<DialogFullscreenIcon className="sm:hidden">
								<Ariakit.DialogDismiss
									render={
										<Link
											to=".."
											onClick={(e) => (e.preventDefault(), navigate(-1))}
										>
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
							<div className="grid gap-2">
								<input type="hidden" name="mediaId" value={data.Media?.id} />
								<div className="grid grid-cols-1 gap-2  sm:grid-cols-2">
									<Status name={store.names.status}></Status>
									<Score name={store.names.score}></Score>

									<Progress
										name={store.names.progress}
										media={data.Media}
									></Progress>
									<StartDate name={store.names.startedAt} />
									<FinishDate name={store.names.completedAt} />
									<Repeat name={store.names.repeat}></Repeat>
								</div>
								<Notes name={store.names.notes}></Notes>

								<AdvancedScores advancedScoring={listOptions}>
									{data.Viewer?.mediaListOptions?.animeList?.advancedScoring?.map(
										(label, i) => {
											const name = store.names.advancedScores[i]
											return name ? (
												<AdvancedScore
													onChange={() => store.setValue("score", avgScore)}
													key={label}
													label={label}
													name={name}
												></AdvancedScore>
											) : null
										},
									)}
								</AdvancedScores>

								<CustomLists
									field={store.names.customLists}
									listOptions={listOptions}
								></CustomLists>

								{/* <Snackbar open={touched}>
																			Careful - you have unsaved changes!
																			<SnackbarAction type="reset">Reset</SnackbarAction>
																			<SnackbarAction
																				onClick={() => form.current!.requestSubmit()}
																			>
																				Save changes
																			</SnackbarAction>
																		</Snackbar> */}
							</div>
						</div>

						<div className="mx-6 border-b border-outline-variant max-sm:hidden" />
						<footer className={actions({ className: "max-sm:hidden" })}>
							<Ariakit.FormReset className={button()}>Reset</Ariakit.FormReset>
							<Ariakit.FormSubmit className={button()}>
								{busy && (
									<ButtonText.Icon className="animate-spin">
										progress_activity
									</ButtonText.Icon>
								)}
								Save changes
							</Ariakit.FormSubmit>
						</footer>
						{/* <Snackbar timeout={4000} open={saved}>
                  Entry saved
                </Snackbar> */}
					</Ariakit.Form>
				</Ariakit.Dialog>
			</div>
		</div>
	)
}

const FuzzyDateLift = S.struct({
	month: S.optionFromNullable(S.number),
	year: S.optionFromNullable(S.number),
	day: S.optionFromNullable(S.number),
})

function Status(props: ComponentPropsWithoutRef<typeof SelectFactory>) {
	return (
		<SelectFactory
			{...props}
			children={Object.values(OPTIONS).map((value) => {
				return <SelectOption value={value} key={value} />
			})}
			label="Status"
		/>
	)
}

function FinishDate(
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedInputFactory>,
		"label"
	>,
) {
	return (
		<TextFieldOutlinedInputFactory {...props} type="date" label="Finish Date" />
	)
}

function StartDate(
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedInputFactory>,
		"label"
	>,
) {
	return (
		<TextFieldOutlinedInputFactory {...props} type="date" label="Start Date" />
	)
}

const Progress_media = graphql(`
	fragment Progress_media on Media {
		id
		episodes
	}
`)

function Progress({
	media,
	...props
}: ComponentPropsWithoutRef<typeof TextFieldOutlinedInput> & {
	media: FragmentType<typeof Progress_media> | null
}) {
	const data = useFragment(Progress_media, media)
	return (
		<TextFieldOutlined>
			<TextFieldOutlinedInput {...props} min={0} type="number" />
			<TextFieldOutlined.Label name={props.name}>
				Episode Progress
			</TextFieldOutlined.Label>
			{data && Predicate.isNumber(data.episodes) ? (
				<TextFieldOutlined.Suffix className="pointer-events-none">
					/{data.episodes}
				</TextFieldOutlined.Suffix>
			) : null}
		</TextFieldOutlined>
	)
}

function Repeat(
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedInputFactory>,
		"label"
	>,
) {
	return (
		<TextFieldOutlinedInputFactory
			{...props}
			min={0}
			type="number"
			label="Total Rewatches"
		/>
	)
}

type StringLike = {
	toString: () => string
	valueOf: () => string
}

function Notes(
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedInputFactory>,
		"label"
	>,
) {
	return (
		<TextFieldOutlinedInputFactory
			{...props}
			render={<textarea />}
			spellCheck
			onInput={(e) => {
				e.currentTarget.style.height = ""
				e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
			}}
			label="Notes"
		/>
	)
}

const AdvancedScoring_listOptions = graphql(`
	fragment AdvancedScoring_listOptions on MediaListTypeOptions {
		advancedScoringEnabled
		advancedScoring
	}
`)

function AdvancedScores({
	advancedScoring: listOptions,
	children,
	...props
}: {
	advancedScoring: FragmentType<typeof AdvancedScoring_listOptions> | null
}): ReactNode {
	const data = useFragment(AdvancedScoring_listOptions, listOptions)
	if (!data?.advancedScoringEnabled) {
		return null
	}

	if (!data.advancedScoring?.length) {
		return null
	}

	return (
		<fieldset className="grid grid-cols-1  gap-2 sm:grid-cols-2">
			<legend className="col-span-full mt-2">Advanced Scores</legend>
			{children}
		</fieldset>
	)
}

function AdvancedScore(
	props: ComponentPropsWithoutRef<typeof TextFieldOutlinedInputFactory>,
): ReactNode {
	return (
		<TextFieldOutlinedInputFactory
			{...props}
			min={0}
			max={100}
			step={0.01}
			type="number"
		/>
	)
}

const CustomLists_mediaListTypeOptions = graphql(`
	fragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {
		customLists
	}
`)

function CustomLists({
	...props
}: {
	listOptions: FragmentType<typeof CustomLists_mediaListTypeOptions> | null
}) {
	const mediaListTypeOptions = useFragment(
		CustomLists_mediaListTypeOptions,
		props.listOptions,
	)

	const customLists = mediaListTypeOptions?.customLists?.filter(nonNull) ?? []

	if (!customLists.length) {
		return null
	}

	return (
		<fieldset className="grid gap-2">
			<legend>Custom Lists</legend>
			<div className="flex flex-wrap gap-2">
				{customLists.map((list) => {
					return (
						<ChipFilter {...props} key={list}>
							{list}
						</ChipFilter>
					)
				})}
			</div>
		</fieldset>
	)
}
