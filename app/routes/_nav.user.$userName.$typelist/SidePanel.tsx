import {
	CheckboxProvider,
	Group,
	GroupLabel,
	RadioProvider,
} from "@ariakit/react"

import { Form, useLocation, useSubmit } from "react-router"

import type { ReactNode } from "react"
import { Button as ButtonText } from "~/components/Button"
import { Card } from "~/components/Card"

import { M3 } from "~/lib/components"

import { MediaListSort } from "~/lib/MediaListSort"

import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"

import { usePreloadedQuery } from "~/lib/Network"
import type { Route } from "./+types/route"
import {
	ANIME_FORMAT_OPTIONS,
	ANIME_PROGRESS_OPTIONS,
	ANIME_SORT_OPTIONS,
	ANIME_STATUS_OPTIONS,
	MANGA_FORMAT_OPTIONS,
	MANGA_PROGRESS_OPTIONS,
	MANGA_SORT_OPTIONS,
	MANGA_STATUS_OPTIONS,
} from "./options"

export function SidePanel({
	params,
	loaderData,
}: Route.ComponentProps): ReactNode {
	const submit = useSubmit()

	const searchParams = useOptimisticSearchParams()
	const { pathname } = useLocation()

	const data = usePreloadedQuery(...loaderData!.routeNavUserListQuery)

	return (
		<M3.LayoutPane variant="fixed" className="max-xl:hidden">
			<Card
				variant="elevated"
				className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
			>
				<Form
					action={pathname}
					replace
					onChange={(e) => void submit(e.currentTarget)}
					className="grid grid-cols-2 gap-2"
				>
					<CheckboxProvider value={searchParams.getAll("status")}>
						<Group className="col-span-2" render={<fieldset />}>
							<GroupLabel render={<legend />}>Status</GroupLabel>
							<div className="flex flex-wrap gap-2">
								{Object.entries(
									params.typelist === "animelist"
										? ANIME_STATUS_OPTIONS
										: MANGA_STATUS_OPTIONS
								).map(([value, label]) => {
									return (
										<M3.ChipFilter key={value}>
											<M3.ChipFilterCheckbox name="status" value={value} />
											{label}
										</M3.ChipFilter>
									)
								})}
							</div>
						</Group>
					</CheckboxProvider>
					<CheckboxProvider value={searchParams.getAll("format")}>
						<Group className="col-span-2" render={<fieldset />}>
							<GroupLabel render={<legend />}>Format</GroupLabel>
							<div className="flex flex-wrap gap-2">
								{Object.entries(
									params.typelist === "animelist"
										? ANIME_FORMAT_OPTIONS
										: MANGA_FORMAT_OPTIONS
								).map(([value, label]) => {
									return (
										<M3.ChipFilter key={value}>
											<M3.ChipFilterCheckbox name="format" value={value} />
											{label}
										</M3.ChipFilter>
									)
								})}
							</div>
						</Group>
					</CheckboxProvider>
					<CheckboxProvider value={searchParams.getAll("progress")}>
						<Group className="col-span-2" render={<fieldset />}>
							<GroupLabel render={<legend />}>Progress</GroupLabel>
							<div className="flex flex-wrap gap-2">
								{Object.entries(
									params.typelist === "animelist"
										? ANIME_PROGRESS_OPTIONS
										: MANGA_PROGRESS_OPTIONS
								).map(([value, label]) => {
									return (
										<M3.ChipFilter key={value}>
											<M3.ChipFilterCheckbox name="progress" value={value} />
											{label}
										</M3.ChipFilter>
									)
								})}
							</div>
						</Group>
					</CheckboxProvider>

					<RadioProvider
						value={
							searchParams.get("sort") ??
							{
								title: MediaListSort.TitleEnglish,
								score: MediaListSort.Score,
							}[
								String(
									data.MediaListCollection?.user?.mediaListOptions?.rowOrder
								)
							]
						}
					>
						<Group className="col-span-2" render={<fieldset />}>
							<GroupLabel render={<legend />}>Sort</GroupLabel>
							<div className="flex flex-wrap gap-2">
								{Object.entries(
									params.typelist === "animelist"
										? ANIME_SORT_OPTIONS
										: MANGA_SORT_OPTIONS
								).map(([value, label]) => {
									return (
										<M3.ChipFilter key={value}>
											<M3.ChipFilterRadio name="sort" value={value} />
											{label}
										</M3.ChipFilter>
									)
								})}
							</div>
						</Group>
					</RadioProvider>

					<ButtonText type="submit">Filter</ButtonText>
					<ButtonText type="reset">Reset</ButtonText>
				</Form>
			</Card>
		</M3.LayoutPane>
	)
}
