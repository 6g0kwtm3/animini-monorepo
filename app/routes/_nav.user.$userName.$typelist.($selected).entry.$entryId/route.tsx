import {
	json,
	unstable_defineClientLoader,
	useLoaderData,
} from "@remix-run/react"
import type { ReactNode } from "react"
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"

import type { routeNavUserListEntryQuery } from "~/gql/routeNavUserListEntryQuery.graphql"
import { client_get_client } from "~/lib/client"
import { M3 } from "~/lib/components"
import { MediaCover } from "~/lib/entry/MediaCover"

import ReactRelay from "react-relay"
import { Ariakit } from "~/lib/ariakit"

const { graphql } = ReactRelay

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const client = client_get_client()

	const data = await client.operation<routeNavUserListEntryQuery>(
		graphql`
			query routeNavUserListEntryQuery($userName: String!, $entryId: Int!) {
				MediaList(userName: $userName, id: $entryId) @required(action: LOG) {
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
			}
		`,
		{
			userName: args.params.userName,
			entryId: Number(args.params.entryId),
		}
	)

	if (!data?.MediaList) {
		throw json("Data not found", { status: 404 })
	}

	return data
})

function SidePanel(): ReactNode {
	const data = useLoaderData<typeof clientLoader>()
	const entry = data.MediaList

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
						defaultValue={entry.score ?? ""}
					/>
				</M3.Field>
				<M3.Field>
					<M3.FieldText
						variant="outlined"
						label="Progress"
						readOnly
						type="number"
						defaultValue={entry.progress ?? ""}
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
