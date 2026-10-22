import { ErrorBoundary } from "@sentry/react"
import { Suspense } from "react"
import { graphql } from "relay-runtime"
import { UserActivitiesQuery as UserActivitiesQueryOperation } from "~/gql/UserActivitiesQuery.graphql"
import {
	usePreloadedQuery,
	useQueryLoader,
	type NodeAndQueryFragment,
} from "~/lib/Network"
import { isNumber } from "~/lib/Predicate"
import { Intersection } from "./Intersection"
import { UserActivitiesListActivity } from "./UserActivitiesListActivity"

export const UserActivitiesQuery = graphql`
	query UserActivitiesQuery($userId: Int!, $page: Int) {
		Page(page: $page) {
			activities(userId: $userId, sort: [PINNED, ID_DESC]) {
				__typename
				... on ListActivity {
					id
					...UserActivitiesListActivity_listActivity
				}
			}
			pageInfo {
				hasNextPage
				currentPage
			}
		}
	}
`

export function UserActivities(props: {
	queryRef: NodeAndQueryFragment<UserActivitiesQueryOperation>
	userId: number
}) {
	const data = usePreloadedQuery(props.queryRef)
	const [queryRef, loadQuery] =
		useQueryLoader<UserActivitiesQueryOperation>(UserActivitiesQuery)

	const loading = "Loading..."
	const currentPage = data.Page?.pageInfo?.currentPage

	const fetchMore =
		data.Page?.pageInfo?.hasNextPage && isNumber(currentPage) ? (
			<Intersection
				onIntersect={() => {
					loadQuery({ userId: props.userId, page: currentPage + 1 })
				}}
			>
				{loading}
			</Intersection>
		) : (
			"No next page"
		)

	return (
		<>
			{data.Page?.activities?.map((activity, i) => {
				if (activity?.__typename === "ListActivity") {
					return (
						<UserActivitiesListActivity
							key={activity.id}
							listActivity={activity}
						></UserActivitiesListActivity>
					)
				}
			})}

			{queryRef ? (
				<ErrorBoundary fallback={<>{fetchMore}</>}>
					<Suspense fallback={loading}>
						<UserActivities
							queryRef={queryRef}
							userId={props.userId}
						></UserActivities>
					</Suspense>
				</ErrorBoundary>
			) : (
				fetchMore
			)}
		</>
	)
}
