import {
	json,
	useLoaderData,
	type ClientLoaderFunction,
	type ShouldRevalidateFunction,
} from "@remix-run/react"
import { type ReactNode } from "react"
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"

import type { routeNavUserListEntryQuery } from "~/gql/routeNavUserListEntryQuery.graphql"
import { M3 } from "~/lib/components"
import { MediaCover } from "~/lib/entry/MediaCover"

import { Schema } from "@effect/schema"
import ReactRelay from "react-relay"
import type { routeSidePanel_entry$key } from "~/gql/routeSidePanel_entry.graphql"
import { Ariakit } from "~/lib/ariakit"
import { loadQuery, useFragment, usePreloadedQuery } from "~/lib/Network"

const { graphql } = ReactRelay

const Params = Schema.Struct({
	selected: Schema.optional(Schema.String),
	userName: Schema.String,
	typelist: Schema.Literal("animelist", "mangalist"),
	entryId: Schema.NumberFromString,
})

export const clientLoader = (async (args) => {
	const params = Schema.decodeUnknownSync(Params)(args.params)

	const variables = {
		userName: params.userName,
		id: params.entryId,
	}

	const data = await loadQuery<routeNavUserListEntryQuery>(
		graphql`
			query routeNavUserListEntryQuery($userName: String!, $id: Int!) {
				MediaList(userName: $userName, id: $id) @required(action: LOG) {
					...routeSidePanel_entry
				}
			}
		`,
		variables
	)

	return { routeNavUserListEntryQuery: data }
}) satisfies ClientLoaderFunction

export const shouldRevalidate: ShouldRevalidateFunction = ({
	defaultShouldRevalidate,
	formMethod,
	currentParams,
	nextParams,
}) => {
	if (
		formMethod === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.entryId === nextParams.entryId
	) {
		return false
	}
	return defaultShouldRevalidate
}

const SidePanel_entry = graphql`
	fragment routeSidePanel_entry on MediaList {
		id
		status
		score
		progress
		media {
			id
			title {
				userPreferred
			}
			episodes
			avalible
			...MediaCover_media
		}
		...Progress_entry
	}
`

function SidePanel(): ReactNode {
	const data = usePreloadedQuery(
		...useLoaderData<typeof clientLoader>().routeNavUserListEntryQuery
	)

	if (!data?.MediaList) {
		throw json("Data not found", { status: 404 })
	}

	const mediaList: routeSidePanel_entry$key = data.MediaList
	const entry = useFragment(SidePanel_entry, mediaList)

	return (
		<M3.LayoutPane
			variant="fixed"
			className="duration-2sm ease-emphasized starting:w-0 max-xl:hidden"
		>
			<M3.Card
				variant="elevated"
				className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
			>
				<MediaCover media={entry.media} className="mb-4 rounded-lg" />
				<M3.CardHeader className="text-xl mb-2 font-bold">
					<Ariakit.Heading>{entry.media.title.userPreferred}</Ariakit.Heading>
				</M3.CardHeader>
				<div>
					<strong>Status:</strong> {entry.status}
				</div>
				<M3.Field>
					<M3.FieldText
						variant="outlined"
						label="Score"
						readOnly
						type="number"
						value={entry.score ?? ""}
					/>
				</M3.Field>
				<M3.Field>
					<M3.FieldText
						variant="outlined"
						label="Progress"
						readOnly
						type="number"
						value={entry.progress ?? ""}
						trailing={`/${entry.media?.avalible ?? entry.media?.episodes}`}
					/>
				</M3.Field>
			</M3.Card>
		</M3.LayoutPane>
	)
}

export default function Route(): ReactNode {
	return <ExtraOutlets side={<SidePanel />} />
}

function SidePanelErrorBoundary() {
	return (
		<M3.LayoutPane variant="fixed" className="max-xl:hidden">
			<M3.Card variant="elevated" className="p-4">
				Not Found
			</M3.Card>
		</M3.LayoutPane>
	)
}

export function ErrorBoundary(): ReactNode {
	return <ExtraOutlets side={<SidePanelErrorBoundary />} />
}
