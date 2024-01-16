import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { ClientLoaderFunction, Params } from "@remix-run/react"
import {
	Form,
	Link,
	Outlet,
	useParams,
	useSearchParams,
	useSubmit,
} from "@remix-run/react"
import {
	Effect,
	Function,
	Order,
	ReadonlyArray,
	ReadonlyRecord,
	pipe,
} from "effect"

import { useMemo } from "react"

import { ButtonText } from "~/components/Button"
import { ChipFilter } from "~/components/Chip"
import { graphql } from "~/gql"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"
import { button } from "~/lib/button"
import type { InferVariables } from "~/lib/urql"
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
		throw new Error(`Invalid list type`)
	}

	return {
		userName: params["userName"]!,
		type,
	}
}

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.flatMap(({ client, args }) =>
		// Effect.fromEffect(
		// 	Effect.request(
		// 		new GqlRequest({
		// 			operation: FiltersQuery,
		// 			variables: FiltersQueryVariables(args.params),
		// 		}),
		// 		ResolveOperation,
		// 	),	Effect.withRequestCache(true),
		// ),
		client.query(FiltersQuery, FiltersQueryVariables(args.params)),
	),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Effect.map(raw),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
	return pipe(
		_loader,
		Effect.map(raw),
		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies ClientLoaderFunction

export default function Filters() {
	const [searchParams] = useSearchParams()

	const data = useRawLoaderData<typeof loader>()
	const params = useParams()

	const selected = params["selected"]

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
				entries.map((entry) => entry?.media?.status).filter(nonNull),
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
				entries.map((entry) => entry?.media?.format).filter(nonNull),
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
				{Object.entries(status).length > 1 && (
					<CheckboxProvider defaultValue={searchParams.getAll("status")}>
						<Group className="col-span-2" render={<fieldset />}>
							<GroupLabel render={<legend />}>Status</GroupLabel>
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
					<CheckboxProvider defaultValue={searchParams.getAll("format")}>
						<Group className="col-span-2" render={<fieldset />}>
							<GroupLabel render={<legend />}>Format</GroupLabel>
							<ul className="flex flex-wrap gap-2">
								{Object.entries(format).map(([value, label]) => {
									return (
										<li key={value}>
											<ChipFilter name="format" value={value}>
												{label}
											</ChipFilter>
										</li>
									)
								})}
							</ul>
						</Group>
					</CheckboxProvider>
				)}

				<ButtonText type="submit">Filter</ButtonText>
				<ButtonText type="reset">Reset</ButtonText>
			</Form>

			<ul className="flex gap-2 overflow-x-auto overscroll-contain [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center">
					{allLists?.map((list) => {
						return (
							<li className="min-w-max" key={list.name}>
								<Link
									to={`/${params["userName"]}/${params["typelist"]}/${list.name}/`}
									className={button({
										variant: "tonal",
										className: `${
											selected === list.name
												? `force:bg-tertiary-container `
												: ``
										}force:rounded capitalize`,
									})}
								>
									{list.name}
								</Link>
							</li>
						)
					})}
				</ul>
				
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
