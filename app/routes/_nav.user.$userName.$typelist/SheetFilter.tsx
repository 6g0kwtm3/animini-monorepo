import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"

import { useParams } from "@remix-run/react"

import { Checkbox } from "~/components/Checkbox"
import { ListItemContent, ListItemContentTitle } from "~/components/List"

import ReactRelay from "react-relay"
import { createList } from "~/lib/list"
import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"

import { subheader } from "~/components/subheader"
import {
	ANIME_FORMAT_OPTIONS,
	ANIME_PROGRESS_OPTIONS,
	ANIME_STATUS_OPTIONS,
	MANGA_FORMAT_OPTIONS,
	MANGA_PROGRESS_OPTIONS,
	MANGA_STATUS_OPTIONS,
} from "./options"
const { graphql } = ReactRelay

export function SheetFilter() {
	const searchParams = useOptimisticSearchParams()

	const params = useParams<"typelist">()

	const lines = "one"

	const list = createList({ lines })

	return (
		<>
			<Group>
				<GroupLabel className={subheader({ lines })}>Status</GroupLabel>
				<div className={list.root({ className: "-mt-2" })}>
					<CheckboxProvider value={searchParams.getAll("status")}>
						{Object.entries(
							params.typelist === "animelist"
								? ANIME_STATUS_OPTIONS
								: MANGA_STATUS_OPTIONS
						).map(([value, label]) => {
							return (
								<label className={list.item()} key={value}>
									<Checkbox name="status" value={value} />
									<div className="col-span-2 col-start-2">
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</div>
								</label>
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
								<label className={list.item()} key={value}>
									<Checkbox name="format" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</label>
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
								<label className={list.item()} key={value}>
									<Checkbox name="progress" value={value} />
									<ListItemContent>
										<ListItemContentTitle>{label}</ListItemContentTitle>
									</ListItemContent>
								</label>
							)
						})}
					</CheckboxProvider>
				</div>
			</Group>
		</>
	)
}
