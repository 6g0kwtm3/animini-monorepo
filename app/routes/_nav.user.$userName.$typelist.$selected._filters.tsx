import { CheckboxProvider, Group, GroupLabel } from "@ariakit/react"
import { Schema } from "@effect/schema"
import type { LoaderFunction } from "@remix-run/cloudflare"
import type { Params } from "@remix-run/react"
import {
	Form,
	Link,
	Outlet,
	useParams,
	useSearchParams,
	useSubmit
} from "@remix-run/react"
import { Effect, Order, pipe } from "effect"

import { ButtonText } from "~/components/Button"
import { ChipFilter } from "~/components/Chip"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"
import { Remix } from "~/lib/Remix/index.server"
import { button } from "~/lib/button"
import { graphql } from "~/lib/graphql"
import type { InferVariables } from "~/lib/urql.server"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"

// export const clientLoader = (async (args) => {
// 	return pipe(
// 		_loader,
//
// 		Effect.provide(ClientLoaderLive),
// 		Effect.provideService(LoaderArgs, args),

// 		Remix.runLoader
// 	)
// }) satisfies ClientLoaderFunction
import { Predicate } from "effect"
import { Card } from "~/components/Card"
import { LayoutPane } from "~/components/Layout"
import { route_user_list_selected } from "~/lib/route"
import { useRawLoaderData } from "~/lib/data"
import { m } from "~/lib/paraglide"

function FiltersQueryVariables(
	params: Readonly<Params<string>>
): InferVariables<typeof FiltersQuery> {
	const type = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga
	}[String(params["typelist"])]

	if (!type) {
		throw new Error(`Invalid list type`)
	}

	return {
		userName: params["userName"]!,
		type
	}
}

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const params = yield* _(
				Remix.params({
					userName: Schema.string,
					typelist: Schema.string,
					selected: Schema.string
				})
			)

			const client = yield* _(EffectUrql)

			const data = yield* _(
				client.query(
					graphql(`
						query FiltersQuery($userName: String!, $type: MediaType!) {
							MediaListCollection(userName: $userName, type: $type) {
								lists {
									name
								}
							}
						}
					`),
					FiltersQueryVariables(params)
				)
			)

			return data
		}),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Remix.runLoader
	)
}) satisfies LoaderFunction
export default function Filters() {
	const [searchParams] = useSearchParams()

	const data = useRawLoaderData<typeof loader>()
	const params = useParams<"userName" | "selected">()

	const selected = params["selected"]

	const submit = useSubmit()

	return (
		<>
			<LayoutPane variant="fixed" className="max-md:hidden">
				<Card variant="elevated">
					<Form
						replace
						onChange={(e) => submit(e.currentTarget)}
						className="grid grid-cols-2 gap-2"
					>
						<CheckboxProvider defaultValue={searchParams.getAll("status")}>
							<Group className="col-span-2" render={<fieldset />}>
								<GroupLabel render={<legend />}>Status</GroupLabel>
								<ul className="flex flex-wrap gap-2">
									{Object.entries(STATUS_OPTIONS).map(([value, label]) => {
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

						<CheckboxProvider defaultValue={searchParams.getAll("format")}>
							<Group className="col-span-2" render={<fieldset />}>
								<GroupLabel render={<legend />}>Format</GroupLabel>
								<ul className="flex flex-wrap gap-2">
									{Object.entries(FORMAT_OPTIONS).map(([value, label]) => {
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

						<ButtonText type="submit">Filter</ButtonText>
						<ButtonText type="reset">Reset</ButtonText>
					</Form>

					<ul className="flex gap-2 overflow-x-auto overscroll-contain [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center">
						{data?.MediaListCollection?.lists
							?.filter(Predicate.isNotNull)
							.sort(
								Order.reverse(
									Order.mapInput(Order.string, (list) => list.name ?? "")
								)
							)
							?.map((list) => {
								return (
									list.name && (
										<li className="min-w-max" key={list.name}>
											<Link
												to={route_user_list_selected({
													...params,
													selected: list.name
												})}
												className={button({
													variant: "tonal",
													className: `${
														selected === list.name
															? `force:bg-tertiary-container `
															: ``
													}force:rounded capitalize`
												})}
											>
												{list.name}
											</Link>
										</li>
									)
								)
							})}
					</ul>
				</Card>
			</LayoutPane>

			<LayoutPane>
				<Card variant="elevated" className="max-sm:contents">
					<Outlet></Outlet>
				</Card>
			</LayoutPane>
		</>
	)
}

const STATUS_OPTIONS = {
	[MediaStatus.Finished]: m.media_status_finished(),
	[MediaStatus.Releasing]: m.media_status_releasing(),
	[MediaStatus.NotYetReleased]: m.media_status_not_yet_released(),
	[MediaStatus.Cancelled]: m.media_status_cancelled()
}

const FORMAT_OPTIONS = {
	[MediaFormat.Tv]: m.media_format_tv(),
	[MediaFormat.TvShort]: m.media_format_tv_short(),
	[MediaFormat.Movie]: m.media_format_movie(),
	[MediaFormat.Special]: m.media_format_special(),
	[MediaFormat.Ova]: m.media_format_ova(),
	[MediaFormat.Ona]: m.media_format_ona(),
	[MediaFormat.Music]: m.media_format_music()
}
