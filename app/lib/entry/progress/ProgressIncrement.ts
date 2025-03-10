import { type } from "arktype"
import ReactRelay from "react-relay"
import type {
    ProgressIncrementMutation,
    ProgressIncrementMutation$data,
} from "~/gql/ProgressIncrementMutation.graphql"
import { client_get_client } from "~/lib/client"
import { invariant } from "~/lib/invariant"
const { graphql } = ReactRelay

const IncrementFormData = type({
	id: "string.integer.parse",
	progress: "string.integer.parse",
})
export const increment = async (
	form: FormData
): Promise<{
	SaveMediaListEntry: ProgressIncrementMutation$data["SaveMediaListEntry"]
}> => {
	const formData = invariant(IncrementFormData(Object.fromEntries(form)))

	const client = client_get_client()

	const data = await client.mutation<ProgressIncrementMutation>({
		mutation: graphql`
			mutation ProgressIncrementMutation($entryId: Int!, $progress: Int) {
				SaveMediaListEntry(id: $entryId, progress: $progress) {
					id
					progress
				}
			}
		`,
		variables: { entryId: formData?.id, progress: formData?.progress },
	})

	if (!data?.SaveMediaListEntry) {
		throw new Error("Failed to increment progress")
	}

	return { SaveMediaListEntry: data?.SaveMediaListEntry }
}
