import { Schema } from "@effect/schema"

import { client_operation, type AnyActionFunctionArgs } from "~/lib/client"
import { graphql } from "~/lib/graphql"

export async function increment(args: AnyActionFunctionArgs) {
	const formData = Schema.decodeUnknownSync(
		Schema.struct({
			id: Schema.NumberFromString,
			progress: Schema.NumberFromString
		})
	)(Object.fromEntries(await args.request.formData()))

	const data = await client_operation(
		graphql(`
			mutation EntryProgressIncrement($entryId: Int!, $progress: Int) {
				SaveMediaListEntry(id: $entryId, progress: $progress) {
					id
					progress
				}
			}
		`),
		{ entryId: formData.id, progress: formData.progress },
		args
	)

	if (!data?.SaveMediaListEntry) {
		throw new Error("Failed to increment progress")
	}

	return {
		...data,
		SaveMediaListEntry: data.SaveMediaListEntry
	}
}
