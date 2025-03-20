import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"

import { Checkbox, Radio } from "~/components/Checkbox"
import { ListItemContent, ListItemContentTitle } from "~/components/List"

import { createList, ListContext } from "~/lib/list"
import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"

import {
	createContext,
	use,
	useId,
	type ComponentProps,
	type ReactNode,
} from "react"
import type { VariantProps } from "tailwind-variants"
import { subheader } from "~/components/subheader"
import type { Route } from "./+types/route"
import {
	MANGA_PROGRESS_OPTIONS,
	useAnimeFormatOptions,
	useAnimeStatusOptions,
	useMangaFormatOptions,
	useMangaStatusOptions,
} from "./options"

export function SheetFilter({ params }: Route.ComponentProps): ReactNode {
	const searchParams = useOptimisticSearchParams()

	const lines = "one"

	const list = createList({ lines })

	const ANIME_FORMAT_OPTIONS = useAnimeFormatOptions()
	const ANIME_STATUS_OPTIONS = useAnimeStatusOptions()
	const MANGA_FORMAT_OPTIONS = useMangaFormatOptions()
	const MANGA_STATUS_OPTIONS = useMangaStatusOptions()

	return (
		<ListContext value={list}>
			<Group>
				<GroupLabel className={subheader({ lines })}>Status</GroupLabel>
				<div className={list.root({ className: "-mt-2" })}>
					<CheckboxProvider defaultValue={searchParams.getAll("status")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_STATUS_OPTIONS
								: MANGA_STATUS_OPTIONS
						).map(([value, label]) => {
							return (
								<LabelItem key={value}>
									<LabelItemCheckbox name="format" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</LabelItem>
							)
						})}
					</CheckboxProvider>
				</div>
			</Group>
			<Group>
				<GroupLabel className={subheader({ lines })}>Format</GroupLabel>
				<div className={list.root({ className: "-mt-2" })}>
					<CheckboxProvider value={searchParams.getAll("format")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_FORMAT_OPTIONS
								: MANGA_FORMAT_OPTIONS
						).map(([value, label]) => {
							return (
								<LabelItem key={value}>
									<LabelItemCheckbox name="format" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</LabelItem>
							)
						})}
					</CheckboxProvider>
				</div>
			</Group>
			<Group>
				<GroupLabel className={subheader({ lines })}>Progress</GroupLabel>
				<div className={list.root({ className: "-mt-2" })}>
					<CheckboxProvider value={searchParams.getAll("progress")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_PROGRESS_OPTIONS
								: MANGA_PROGRESS_OPTIONS
						).map(([value, label]) => {
							return (
								<LabelItem key={value}>
									<LabelItemCheckbox name="progress" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</LabelItem>
							)
						})}
					</CheckboxProvider>
				</div>
			</Group>
		</ListContext>
	)
}

interface LabelItemVariantProps
	extends ComponentProps<"label">,
		VariantProps<typeof createList> {}

export function LabelItem({
	lines,
	...props
}: LabelItemVariantProps): ReactNode {
	const { item } = use(ListContext)
	const id = useId()
	return (
		<label
			htmlFor={id}
			{...props}
			className={item({ className: props.className, lines })}
		/>
	)
}

const Id = createContext("")

export function LabelItemCheckbox(props: ComponentProps<typeof Checkbox>) {
	const id = use(Id)
	return <Checkbox id={id} {...props} />
}

export function LabelItemRadio(props: ComponentProps<typeof Radio>) {
	const id = use(Id)
	return <Radio id={id} {...props} />
}
