import ReactRelay, { useMutation } from "react-relay"

import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off"

import { CompositeItem } from "@ariakit/react"
import { Button, ButtonIcon } from "~/components/Button"

import type { AddToListMutation } from "~/gql/AddToListMutation.graphql"
import type { AddToList_media$key } from "~/gql/AddToList_media.graphql"
import type { AddToList_mediaListCollection$key } from "~/gql/AddToList_mediaListCollection.graphql"
import type { AddToList_originalEntry$key } from "~/gql/AddToList_originalEntry.graphql"
import type { AddToList_updatable$key } from "~/gql/AddToList_updatable.graphql"
import { useFragment } from "../Network"

const { graphql } = ReactRelay

export function AddToList({
	media: mediaKey,
	originalEntry,
	mediaListCollection: mediaListCollectionKey,
}: {
	media: AddToList_media$key
	mediaListCollection: AddToList_mediaListCollection$key
	originalEntry: AddToList_originalEntry$key
}) {
	const source = useFragment(
		graphql`
			fragment AddToList_originalEntry on MediaList {
				id
				private
				status
			}
		`,
		originalEntry
	)

	const mediaListCollection = useFragment(
		graphql`
			fragment AddToList_mediaListCollection on MediaListCollection {
				lists {
					...AddToList_updatable
					status
					entries {
						id
						...AddToList_assignable
					}
				}
			}
		`,
		mediaListCollectionKey
	)

	const media = useFragment(
		graphql`
			fragment AddToList_media on Media {
				id
			}
		`,
		mediaKey
	)

	const [mutate, inFlight] = useMutation<AddToListMutation>(graphql`
		mutation AddToListMutation(
			$mediaId: Int!
			$status: MediaListStatus!
			$private: Boolean
		) @raw_response_type {
			SaveMediaListEntry(
				mediaId: $mediaId
				status: $status
				private: $private
			) {
				id
				status
				...MediaListItem_entry
				...AddToList_originalEntry
				...SyncMedia_entry
				...SyncMedia_source
				...ProgressIncrement_entry
				...AddToList_assignable
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

	return (
		<form
			className="flex justify-end"
			action={() => {
				void mutate({
					variables: {
						mediaId: media.id,
						status: source.status ?? "PLANNING",
						private: source.private,
					},
					// optimisticResponse: {
					// 	SaveMediaListEntry: {
					// 		__typename: "MediaList",
					// 		id: Math.random(),
					// 		status: source.status ?? "PLANNING",
					// 		private: source.private,
					// 	},
					// },
					updater: (store, response) => {
						for (const list of mediaListCollection.lists ?? []) {
							if (list != null && list.status === source.status) {
								const { updatableData } =
									store.readUpdatableFragment<AddToList_updatable$key>(
										graphql`
											fragment AddToList_updatable on MediaListGroup
											@updatable {
												entries {
													id
													...AddToList_assignable
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
			}}
		>
			<Button type="submit" render={<CompositeItem />} disabled={inFlight}>
				Add to list
				{source.private ? (
					<ButtonIcon>
						<MaterialSymbolsVisibilityOff></MaterialSymbolsVisibilityOff>
					</ButtonIcon>
				) : null}
			</Button>
		</form>
	)
}

void graphql`
	fragment AddToList_assignable on MediaList @assignable {
		__typename
	}
`
