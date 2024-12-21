import { Schema } from "@effect/schema"

import ReactRelay from "react-relay"
import type {
	ProgressIncrementMutation,
	ProgressIncrementMutation$data,
} from "~/gql/ProgressIncrementMutation.graphql"
import { mutation } from "~/lib/Network"

const { graphql } = ReactRelay

export const increment = async (
	form: FormData
): Promise<{
	SaveMediaListEntry: ProgressIncrementMutation$data["SaveMediaListEntry"]
}> => {
	const formData = Schema.decodeUnknownSync(
		Schema.Struct({
			id: Schema.NumberFromString,
			progress: Schema.NumberFromString,
		})
	)(Object.fromEntries(form))

	const data = await mutation<ProgressIncrementMutation>({
		mutation: graphql`
			mutation ProgressIncrementMutation($entryId: Int!, $progress: Int) {
				SaveMediaListEntry(id: $entryId, progress: $progress) {
					id
					progress
				}
			}
		`,
		variables: { entryId: formData.id, progress: formData.progress },
	})

	if (!data.SaveMediaListEntry) {
		throw new Error("Failed to increment progress")
	}

	return { SaveMediaListEntry: data.SaveMediaListEntry }
}
