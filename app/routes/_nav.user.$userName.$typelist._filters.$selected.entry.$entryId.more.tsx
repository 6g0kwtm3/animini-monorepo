import type { HeadersFunction } from "@remix-run/node"
import {
	Await,
	useLocation,
	useNavigate,
	useNavigation
} from "@remix-run/react"
import { Predicate } from "effect"
import { Sheet } from "~/components/Sheet"
import { useRawRouteLoaderData } from "~/lib/data"

import { serverOnly$ } from "vite-env-only"
import { graphql } from "~/gql"
import type { loader as typelistSelectedLoader } from "./_nav.user.$userName.$typelist._filters.$selected"

export const headers = (({ loaderHeaders }) => {
	const cacheControl = loaderHeaders.get("Cache-Control")
	return Predicate.isString(cacheControl)
		? { "Cache-Control": cacheControl }
		: new Headers()
}) satisfies HeadersFunction

const Entry_query = serverOnly$(
	graphql(`
		fragment Entry_query on Query {
			MediaList(id: $entryId) @include(if: $isEntryId) {
				id
			}
		}
	`)
)

export default function Page() {
	const navigate = useNavigate()
	const navigation = useNavigation()
	const location = useLocation()
	const data = useRawRouteLoaderData<typeof typelistSelectedLoader>(
		"routes/_nav.user.$userName.$typelist._filters.$selected"
	)

	return (
		<Sheet
			open={navigation.state !== "loading"}
			onClose={() => navigate("../../..")}
		>
			Hello World
			<Await resolve={data?.query}>
				{(list) => JSON.stringify(list?.MediaList)}
			</Await>
		</Sheet>
	)
}
