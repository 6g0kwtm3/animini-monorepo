import { type ReactNode } from "react"
import { type ShouldRevalidateFunction } from "react-router"
import { ExtraOutlets } from "../User/ExtraOutlet"

import type { routeNavUserListEntryQuery } from "~/gql/routeNavUserListEntryQuery.graphql"
import { M3 } from "~/lib/components"
import { MediaCover } from "~/lib/entry/MediaCover"
import type { Route } from "./+types/route"

import { type } from "arktype"
import ReactRelay from "react-relay"
import type { routeSidePanel_entry$key } from "~/gql/routeSidePanel_entry.graphql"
import { Ariakit } from "~/lib/ariakit"
import { invariant } from "~/lib/invariant"
import { loadQuery, useFragment, usePreloadedQuery } from "~/lib/Network"

const { graphql } = ReactRelay

const Params = type({
	entryId: "string.integer.parse",
})

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const params = invariant(Params(args.params))

	const variables = {
		userName: args.params.userName,
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
}

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

function SidePanel({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(...loaderData.routeNavUserListEntryQuery)

	if (!data?.MediaList) {
		throw Response.json("Data not found", { status: 404 })
	}

	const mediaList: routeSidePanel_entry$key = data.MediaList
	const entry = useFragment(SidePanel_entry, mediaList)

	return (
		<M3.LayoutPane
			variant="fixed"
			className="duration-2sm ease-emphasized max-xl:hidden starting:w-0"
		>
			<M3.Card
				variant="elevated"
				className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
			>
				{entry.media && (
					<MediaCover media={entry.media} className="mb-4 rounded-lg" />
				)}
				<M3.CardHeader className="mb-2 text-xl font-bold">
					<Ariakit.Heading>{entry.media?.title?.userPreferred}</Ariakit.Heading>
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

export default function SidePanelRoute(props: Route.ComponentProps): ReactNode {
	return <ExtraOutlets side={<SidePanel {...props} />} />
}

function SidePanelErrorBoundary(_props: Route.ErrorBoundaryProps) {
	return (
		<M3.LayoutPane variant="fixed" className="max-xl:hidden">
			<M3.Card variant="elevated" className="p-4">
				Not Found
			</M3.Card>
		</M3.LayoutPane>
	)
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps): ReactNode {
	return <ExtraOutlets side={<SidePanelErrorBoundary {...props} />} />
}
