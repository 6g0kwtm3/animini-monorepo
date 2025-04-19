import { graphql } from "react-relay"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
} from "~/components"
import type { UserActivitiesListActivity_listActivity$key } from "~/gql/UserActivitiesListActivity_listActivity.graphql"
import { MediaCover } from "~/lib/entry/MediaCover"
import { useFragment } from "~/lib/Network"

const UserActivitiesListActivity_listActivity = graphql`
	fragment UserActivitiesListActivity_listActivity on ListActivity {
		id
		status @required(action: LOG) 
		progress
		media @required(action: LOG) {
			id
			title {
				userPreferred @required(action: LOG) 
			}
			...MediaCover_media
		}
	}
`

export function UserActivitiesListActivity(props: {
	listActivity: UserActivitiesListActivity_listActivity$key
}) {
	const data = useFragment(
		UserActivitiesListActivity_listActivity,
		props.listActivity
	)
	return (
		data && (
			<ListItem>
				<ListItemImg>
					<MediaCover media={data.media}></MediaCover>
				</ListItemImg>
				<ListItemContent>
					<ListItemContentTitle>{data.media.title?.userPreferred}</ListItemContentTitle>
					<ListItemContentSubtitle>{data.status} {data.progress} </ListItemContentSubtitle>
				</ListItemContent>
			</ListItem>
		)
	)
}
