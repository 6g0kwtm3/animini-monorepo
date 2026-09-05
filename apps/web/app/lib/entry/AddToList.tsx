import ReactRelay, { useMutation } from "react-relay"

import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off"

import { CompositeItem } from "@ariakit/react"
import { Button, ButtonIcon } from "~/components/Button"

import type { FragmentRefs } from "relay-runtime"
import type { AddToListMutation } from "~/gql/AddToListMutation.graphql"
import type { AddToList_media$key } from "~/gql/AddToList_media.graphql"
import type { AddToList_mediaListCollection$key } from "~/gql/AddToList_mediaListCollection.graphql"
import type { AddToList_originalEntry$key } from "~/gql/AddToList_originalEntry.graphql"
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
				...MediaListItem_entry @alias
				...AddToList_originalEntry @alias
				...SyncMedia_entry_plural
				...SyncMedia_source @alias
				...ProgressIncrement_entry @alias
				...AddToList_assignable
				media {
					id
					...MediaListItem_media @alias
					...AddToList_media @alias
					relations {
						edges {
							id
							relationType(version: 3)
							node {
								id
								...MediaListItem_media @alias
								...AddToList_media @alias
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
						mediaId: Number(media.id),
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
						const { updatableData: mediaListCollection } =
							store.readUpdatableFragment<AddToList_mediaListCollection$key>(
								graphql`
									fragment AddToList_mediaListCollection on MediaListCollection
									@updatable {
										lists {
											status
											entries {
												__typename
												__id
												...AddToList_assignable
											}
										}
									}
								`,
								mediaListCollectionKey
							)

						for (const list of mediaListCollection.lists ?? []) {
							if (list != null && list.status === source.status) {
								if (response?.SaveMediaListEntry != null) {
									list.entries = [
										...(list.entries?.filter(
											(
												entry
											): entry is {
												readonly " $fragmentSpreads": FragmentRefs<"AddToList_assignable">
												readonly __id: string
												readonly __typename: "MediaList"
											} => entry != null
										) ?? []),
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
