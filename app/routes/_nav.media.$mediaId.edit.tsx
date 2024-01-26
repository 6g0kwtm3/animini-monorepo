import {
	json,
	redirect,
	type ActionFunction,
	type LoaderFunction
} from "@remix-run/node"
import {
	Link,
	useActionData,
	useFetcher,
	useNavigate,
	useNavigation
} from "@remix-run/react"
import {
	Effect,
	Option,
	pipe,
	Predicate,
	ReadonlyArray,
	ReadonlyRecord
} from "effect"

import { ButtonText } from "~/components/Button"

import { divide, sumAll } from "effect/Number"
import {
	TextFieldOutlined,
	TextFieldOutlinedFactory,
	TextFieldOutlinedInput
} from "~/components/TextField"
import { MediaListStatus, ScoreFormat } from "~/gql/graphql"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	nonNull,
	useRawLoaderData
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
import { Remix } from "~/lib/Remix"

export const action = (async ({ request, params }): Promise<Submission<{}>> => {
	const formData = await request.formData()

	return null
}) satisfies ActionFunction

const UnpadStart = (maxLength: number, fillString?: string | undefined) =>
	S.transform(
		S.string,
		S.string,
		(s: string) => s.replace(new RegExp(`^${fillString}{0,${maxLength}}`), ""),
		(s: string) => s.padStart(maxLength, fillString)
	)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Effect.map((data) =>
			Predicate.isNotNull(data?.Viewer)
				? json(data, {
						headers: {
							"Cache-Control": "max-age=60, private"
						}
					})
				: redirect("..")
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

const FuzzyDateInput = S.compose(
	S.compose(
		S.compose(
			S.split("-"),
			S.tuple(
				S.nullable(UnpadStart(4, "0")),
				S.nullable(UnpadStart(2, "0")),
				S.nullable(UnpadStart(2, "0"))
			)
		),
		S.tuple(
			S.nullable(S.NumberFromString),
			S.nullable(S.NumberFromString),
			S.nullable(S.NumberFromString)
		)
	),
	S.transform(
		S.tuple(S.nullable(S.number), S.nullable(S.number), S.nullable(S.number)),
		S.struct({
			year: S.nullable(S.number),
			month: S.nullable(S.number),
			day: S.nullable(S.number)
		}),
		([year, month, day]) => ({ year, month, day }),
		({ year, month, day }) => [year, month, day] as const
	)
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

const EditPageMedia = graphql(`
	query EditPageMedia($mediaId: Int!, $format: ScoreFormat) {
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
			}
		}
		Media(id: $mediaId) {
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

const ScoreFormatSchema = S.enums(ScoreFormat)

const _loader = pipe(
	Effect.gen(function* (_) {
		const { mediaId } = yield* _(Remix.params({ mediaId: S.NumberFromString }))
		const { searchParams } = yield* _(ClientArgs)
		const client = yield* _(EffectUrql)

		const format = yield* _(
			S.decodeUnknownEither(S.nullable(ScoreFormatSchema))(
				searchParams.get("format")
			)
		)

		return yield* _(
			client.query(EditPageMedia, {
				format,
				mediaId
			})
		)
	})
)

const { root, content, headline, backdrop, body, actions } = dialog({
	variant: {
		initial: "fullscreen",
		sm: "basic"
	}
})

const OPTIONS = {
	[MediaListStatus.Current]: "Watching",
	[MediaListStatus.Planning]: "Plan to watch",
	[MediaListStatus.Completed]: "Completed",
	[MediaListStatus.Repeating]: "Rewatching",
	[MediaListStatus.Paused]: "Paused",
	[MediaListStatus.Dropped]: "Dropped"
}

const Score = (
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedFactory>,
		"label"
	>
) => (
	<TextFieldOutlinedFactory
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
		Option.fromNullable(data?.Media?.mediaListEntry?.advancedScores),
		Option.filter(Predicate.isReadonlyRecord)
	)

	const defaultAdvancedScores =
		pipe(
			data?.Viewer?.mediaListOptions?.animeList?.advancedScoring
				?.filter(nonNull)
				.map((category) =>
					pipe(
						advancedScores,
						Option.flatMap(ReadonlyRecord.get(category)),
						Option.filter(Predicate.isNumber),
						Option.getOrElse(() => 0)
					)
				)
		) ?? []

	const navigate = useNavigate()

	const store = Ariakit.useFormStore({
		defaultValues: {
			advancedScores: defaultAdvancedScores,
			completedAt: pipe(
				S.decodeUnknownOption(FuzzyDateLift)(
					data?.Media?.mediaListEntry?.completedAt
				),
				Option.flatMap(Option.all),
				Option.flatMap(S.encodeOption(FuzzyDateInput)),
				Option.getOrElse(() => "")
			),
			startedAt: pipe(
				S.decodeUnknownOption(FuzzyDateLift)(
					data?.Media?.mediaListEntry?.startedAt
				),
				Option.flatMap(Option.all),
				Option.flatMap(S.encodeOption(FuzzyDateInput)),
				Option.getOrElse(() => "")
			),
			notes: data?.Media?.mediaListEntry?.notes ?? "",
			progress: data?.Media?.mediaListEntry?.progress || 0,
			repeat: data?.Media?.mediaListEntry?.repeat || 0,
			score: data?.Media?.mediaListEntry?.score || 0,
			status: pipe(
				Option.fromNullable(data?.Media?.mediaListEntry?.status),
				Option.flatMap((key) => ReadonlyRecord.get(OPTIONS, key)),
				Option.getOrElse(() => OPTIONS[MediaListStatus.Current])
			),
			customLists: pipe(
				Option.fromNullable(data?.Media?.mediaListEntry?.customLists),
				Option.filter(Predicate.isReadonlyRecord),
				Option.getOrElse(ReadonlyRecord.empty),
				ReadonlyRecord.filter((key) => !!key),
				Object.keys
			)
		}
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
		round
	)

	function avg(numbers: number[]) {
		return divide(sumAll(numbers), numbers.length)
	}

	function round(n: number) {
		return Math.round(n * 10) / 10
	}

	const listOptions =
		data?.Media?.type === "MANGA"
			? data?.Viewer?.mediaListOptions?.mangaList
			: data?.Viewer?.mediaListOptions?.animeList
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
								<input type="hidden" name="mediaId" value={data?.Media?.id} />
								<div className="grid grid-cols-1 gap-2  sm:grid-cols-2">
									<Status name={store.names.status}></Status>
									<Score name={store.names.score}></Score>

									<Progress
										name={store.names.progress}
										media={data?.Media}
									></Progress>
									<StartDate name={store.names.startedAt} />
									<FinishDate name={store.names.completedAt} />
									<Repeat name={store.names.repeat}></Repeat>
								</div>
								<Notes name={store.names.notes}></Notes>

								<AdvancedScores advancedScoring={listOptions}>
									{data?.Viewer?.mediaListOptions?.animeList?.advancedScoring?.map(
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
										}
									)}
								</AdvancedScores>

								<CustomLists
									name={store.names.customLists}
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
	day: S.optionFromNullable(S.number)
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
		ComponentPropsWithoutRef<typeof TextFieldOutlinedFactory>,
		"label"
	>
) {
	return <TextFieldOutlinedFactory {...props} type="date" label="Finish Date" />
}

function StartDate(
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedFactory>,
		"label"
	>
) {
	return <TextFieldOutlinedFactory {...props} type="date" label="Start Date" />
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
			{data && Predicate.isNumber(data?.episodes) ? (
				<TextFieldOutlined.Suffix className="pointer-events-none">
					/{data?.episodes}
				</TextFieldOutlined.Suffix>
			) : null}
		</TextFieldOutlined>
	)
}

function Repeat(
	props: Omit<
		ComponentPropsWithoutRef<typeof TextFieldOutlinedFactory>,
		"label"
	>
) {
	return (
		<TextFieldOutlinedFactory
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
		ComponentPropsWithoutRef<typeof TextFieldOutlinedFactory>,
		"label"
	>
) {
	return (
		<TextFieldOutlinedFactory
			{...props}
			render={<textarea />}
			spellCheck
			onInput={(e) => {
				e.currentTarget.style.height = ""
				e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
			}}
			className="[field-sizing:content]"
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

	if (!data?.advancedScoring?.length) {
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
	props: ComponentPropsWithoutRef<typeof TextFieldOutlinedFactory>
): ReactNode {
	return (
		<TextFieldOutlinedFactory
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
	listOptions,
	...props
}: {
	listOptions: FragmentType<typeof CustomLists_mediaListTypeOptions> | null
}) {
	const mediaListTypeOptions = useFragment(
		CustomLists_mediaListTypeOptions,
		listOptions
	)

	const customLists = mediaListTypeOptions?.customLists?.filter(nonNull) ?? []

	if (!customLists.length) {
		return null
	}

	return (
		<fieldset className="grid gap-2">
			<legend>Custom Lists</legend>
			<div className="flex flex-wrap gap-2">
				{customLists.map((list, i) => {
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
