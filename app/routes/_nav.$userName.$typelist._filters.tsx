import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { ClientLoaderFunction, Params } from "@remix-run/react"
import {
	Form,
	Outlet,
	useFetcher,
	useSearchParams,
	useSubmit,
} from "@remix-run/react"
import {
	Effect,
	Function,
	Order,
	ReadonlyArray,
	ReadonlyRecord,
	Sink,
	Stream,
	pipe,
} from "effect"

import { useMemo } from "react"

import { ButtonText } from "~/components/Button"
import { ChipFilter } from "~/components/Chip"
import { graphql } from "~/gql"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"
import { SearchParam } from "~/lib/SearchParam"
import type { InferVariables } from "~/lib/urql"
import {
	ClientArgs,
	ClientLoaderLive,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	nonNull,
	raw,
	useLoader,
	useRawLoaderData,
} from "~/lib/urql"

const FiltersQuery = graphql(`
	query FiltersQuery($userName: String!, $type: MediaType!) {
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
				entries {
					id
					media {
						id
						status
						format
					}
				}
			}
		}
	}
`)

function FiltersQueryVariables(
	params: Readonly<Params<string>>,
): InferVariables<typeof FiltersQuery> {
	const type = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga,
	}[String(params["typelist"])]

	if (!type) {
		throw redirect(`/${params["userName"]}/animelist`)
	}

	return {
		userName: params["userName"]!,
		type,
	}
}

const _loader = pipe(
	Stream.Do,
	Stream.bind("args", () => ClientArgs),
	Stream.bind("client", () => EffectUrql),
	Stream.flatMap(({ client, args }) =>
		client.query(FiltersQuery, FiltersQueryVariables(args.params)),
	),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,
		Effect.map(raw),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,
		Effect.map(raw),
		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies ClientLoaderFunction

export default function Filters() {
	const [searchParams] = useSearchParams()

	const data = useLoader(_loader, useRawLoaderData<typeof loader>())

	const selected = searchParams.get("selected")

	let allLists = data?.MediaListCollection?.lists
		?.filter(nonNull)
		.sort(
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
		)

	let lists = allLists

	if (selected) {
		lists = lists?.filter((list) => list.name === selected)
	}

	const submit = useSubmit()

	const statusParams = searchParams
		.getAll("status")
		.flatMap((status) => (status in STATUS_OPTIONS ? [status] : []))

	const formatParams = searchParams
		.getAll("format")
		.flatMap((format) => (format in FORMAT_OPTIONS ? [format] : []))

	let entries = useMemo(() => lists?.[0]?.entries ?? [], [lists])

	// if (formatParams.length) {
	// 	entries = entries.filter((entry) =>
	// 		formatParams.includes(entry?.media?.format ?? ""),
	// 	)
	// }

	const status = useMemo(
		() =>
			pipe(
				entries?.map((entry) => entry?.media?.status).filter(nonNull) ?? [],
				ReadonlyArray.groupBy(Function.identity),
				ReadonlyRecord.map(ReadonlyArray.length),
				ReadonlyRecord.map(String),
				ReadonlyRecord.intersection(STATUS_OPTIONS, (a, b) => `${b} (${a})`),
			),
		[entries],
	)

	entries = useMemo(() => lists?.[0]?.entries ?? [], [lists])

	if (statusParams.length) {
		entries = entries.filter((entry) =>
			statusParams.includes(entry?.media?.status ?? ""),
		)
	}

	const format = useMemo(
		() =>
			pipe(
				entries?.map((entry) => entry?.media?.format).filter(nonNull) ?? [],
				ReadonlyArray.groupBy(Function.identity),
				ReadonlyRecord.map(ReadonlyArray.length),
				ReadonlyRecord.map(String),
				ReadonlyRecord.intersection(FORMAT_OPTIONS, (a, b) => `${b} (${a})`),
			),
		[entries],
	)

	return (
		<div>
			<Form
				replace
				onChange={(e) => submit(e.currentTarget)}
				className="grid grid-cols-2 gap-2"
			>
				<SearchParam name="selected" />
				{Object.entries(status).length > 1 && (
					<CheckboxProvider defaultValue={searchParams.getAll("status")}>
						<Group className="col-span-2">
							<GroupLabel>Status</GroupLabel>
							<ul className="flex flex-wrap gap-2">
								{Object.entries(status).map(([value, label]) => {
									return (
										<li key={value}>
											<ChipFilter name="status" value={value}>
												{label}
											</ChipFilter>
										</li>
									)
								})}
							</ul>
						</Group>
					</CheckboxProvider>
				)}
				{Object.entries(format).length > 1 && (
					<fieldset className="col-span-2">
						<legend>Format</legend>
						<ul className="flex flex-wrap gap-2">
							{Object.entries(format).map(([value, label]) => {
								return (
									<li key={value}>
										<ChipFilter
											name="format"
											value={value}
											defaultChecked={searchParams
												.getAll("format")
												.includes(value)}
										>
											{label}
										</ChipFilter>
									</li>
								)
							})}
						</ul>
					</fieldset>
				)}
				<ButtonText type="submit">Filter</ButtonText>
				<ButtonText type="reset">Reset</ButtonText>
			</Form>
			<Outlet></Outlet>
		</div>
	)
}

const STATUS_OPTIONS = {
	[MediaStatus.Finished]: "Finished",
	[MediaStatus.Releasing]: "Releasing",
	[MediaStatus.NotYetReleased]: "Not Yet Released",
	[MediaStatus.Cancelled]: "Cancelled",
}

const FORMAT_OPTIONS = {
	[MediaFormat.Tv]: "TV",
	[MediaFormat.TvShort]: "TV Short",
	[MediaFormat.Movie]: "Movie",
	[MediaFormat.Special]: "Special",
	[MediaFormat.Ova]: "OVA",
	[MediaFormat.Ona]: "ONA",
	[MediaFormat.Music]: "Music",
}
