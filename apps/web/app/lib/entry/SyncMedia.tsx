import { CompositeItem } from "@ariakit/react"
import ReactRelay, { useMutation } from "react-relay"
import { Button, ButtonIcon } from "~/components/Button"
import type { SyncMedia_entry$key } from "~/gql/SyncMedia_entry.graphql"
import type { SyncMedia_mediaListCollection$key } from "~/gql/SyncMedia_mediaListCollection.graphql"
import type { SyncMedia_source$key } from "~/gql/SyncMedia_source.graphql"
import type { SyncMedia_updatable$key } from "~/gql/SyncMedia_updatable.graphql"
import type { SyncMediaMutation } from "~/gql/SyncMediaMutation.graphql"
import MaterialSymbolsSyncArrowDown from "~icons/material-symbols/sync-arrow-down"
import { useFragment } from "../Network"

const { graphql } = ReactRelay

export function SyncMedia(props: {
	mediaListCollection: SyncMedia_mediaListCollection$key
	source: SyncMedia_source$key
	targetEntries: SyncMedia_entry$key
	targetMediaIds: number[]
}) {
	const targets = new Map(
		useFragment(
			graphql`
				fragment SyncMedia_entry on MediaList @relay(plural: true) {
					id
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
					media {
						id
					}
				}
			`,
			props.targetEntries
		).map((target) => [target.media?.id, target])
	)

	const source = useFragment(
		graphql`
			fragment SyncMedia_source on MediaList {
				id
				private
				status
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
		`,
		props.source
	)

	const [mutation, inFlight] = useMutation<SyncMediaMutation>(graphql`
		mutation SyncMediaMutation(
			$status: MediaListStatus
			$startedAt: FuzzyDateInput
			$completedAt: FuzzyDateInput
			$private: Boolean
			$mediaId: Int!
		) @raw_response_type {
			SaveMediaListEntry(
				mediaId: $mediaId
				status: $status
				startedAt: $startedAt
				completedAt: $completedAt
				private: $private
			) {
				id
				status
				...MediaListItem_entry
				...AddToList_originalEntry
				...SyncMedia_entry
				...SyncMedia_source
				...ProgressIncrement_entry
				...SyncMedia_assignable
				media {
					id
					...MediaListItem_media
					...AddToList_media
					relations {
						edges {
							id
							relationType(version: 2)
							node {
								id
								...MediaListItem_media
								...AddToList_media
							}
						}
					}
				}
			}
		}
	`)

	const mediaListCollection = useFragment(
		graphql`
			fragment SyncMedia_mediaListCollection on MediaListCollection {
				lists {
					...SyncMedia_updatable
					status
					entries {
						id
						...SyncMedia_assignable
					}
				}
			}
		`,
		props.mediaListCollection
	)

	return (
		<form
			className="flex justify-end"
			action={() => {
				for (const mediaId of props.targetMediaIds) {
					const currentEntry = targets.get(mediaId)

					void mutation({
						variables: {
							mediaId: mediaId,
							status: source.status,
							private: source.private,

							completedAt:
								currentEntry?.completedAt?.day == null
								&& currentEntry?.completedAt?.month == null
								&& currentEntry?.completedAt?.year == null
									? source.completedAt
									: null,
							startedAt:
								currentEntry?.startedAt?.day == null
								&& currentEntry?.startedAt?.month == null
								&& currentEntry?.startedAt?.year == null
									? source.startedAt
									: null,
						},
						updater: (store, response) => {
							for (const list of mediaListCollection.lists ?? []) {
								if (list != null && list.status === source.status) {
									const { updatableData } =
										store.readUpdatableFragment<SyncMedia_updatable$key>(
											graphql`
												fragment SyncMedia_updatable on MediaListGroup
												@updatable {
													entries {
														id
														...SyncMedia_assignable
													}
												}
											`,
											list
										)

									if (response?.SaveMediaListEntry != null) {
										updatableData.entries = [
											...(list.entries?.filter((entry) => entry != null) ?? []),
											response.SaveMediaListEntry,
										]
									}
								}
							}
						},
					})
				}
			}}
		>
			<Button type="submit" render={<CompositeItem />} disabled={inFlight}>
				Sync
				<ButtonIcon>
					<MaterialSymbolsSyncArrowDown></MaterialSymbolsSyncArrowDown>
				</ButtonIcon>
			</Button>
		</form>
	)
}

void graphql`
	fragment SyncMedia_assignable on MediaList @assignable {
		__typename
	}
`
