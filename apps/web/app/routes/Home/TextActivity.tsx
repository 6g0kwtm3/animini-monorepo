import { Card } from "@animedes/components/Card"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "@animedes/components/List"
import { stable } from "@animedes/react-stable"
import { A } from "@anitrove/a"
import { state } from "@anitrove/design"
import { precompileStyles } from "@anitrove/unstyled"
// console.log(R)
import { ErrorBoundary } from "@sentry/react-router"
import { Markdown, Html } from "markdown/Markdown"
import ReactRelay from "react-relay"
import { useFragment } from "~/lib/Network"

import { htmlOptions, options } from "./options"

import type { TextActivity_textActivity$key } from "~/gql/TextActivity_textActivity.graphql"
const { graphql } = ReactRelay

const TextActivity_textActivity = graphql`
	fragment TextActivity_textActivity on TextActivity
	@argumentDefinitions(
		enableSanitizerWebAPI: {
			type: "Boolean!"
			provider: "~/routes/Home/TextActivity_enableSanitizerWebAPI.relayprovider.ts"
		}
	) {
		id
		createdAt
		textHtml: text(asHtml: true, htmlVersion: 2)
			@include(if: $enableSanitizerWebAPI)
		textMarkdown: text(asHtml: false, htmlVersion: 2)
			@skip(if: $enableSanitizerWebAPI)
		user {
			id
			name
			avatar {
				large
				medium
			}
		}
	}
`

export function TextActivity(props: {
	activityKey: TextActivity_textActivity$key
	first: boolean
	last: boolean
}) {
	const activity = useFragment(TextActivity_textActivity, props.activityKey)
	return (
		<Card
			variant="filled"
			render={<div />}
			className="grid max-w-7xl gap-4 rounded-[1.75rem]"
		>
			<List style={precompileStyles({ margin: "-1rem" })} render={<address />}>
				<ListItem
					first={props.first}
					last={props.last}
					style={precompileStyles({ ...state("none") })}
				>
					<div className="col-start-1 h-10 w-10">
						{activity.user?.avatar?.large ? (
							<img
								alt=""
								loading="lazy"
								src={activity.user.avatar.large}
								className="h-10 w-10 rounded-full bg-(image:--bg) bg-cover object-cover"
								style={
									activity.user.avatar.medium
										? { "--bg": `url(${activity.user.avatar.medium})` }
										: undefined
								}
							/>
						) : null}
					</div>
					<ListItemContent>
						<ListItemTitle>
							{activity.user?.name ? (
								<A href={`/user/${activity.user.name}`}>{activity.user.name}</A>
							) : null}
						</ListItemTitle>
						<ListItemSubtitle>{activity.createdAt}</ListItemSubtitle>
					</ListItemContent>
					{/* <ListItemTrailingSupportingText></ListItemTrailingSupportingText> */}
				</ListItem>
			</List>
			<ErrorBoundary fallback={<>Failed to parse markdown</>}>
				<div className="prose md:prose-lg lg:prose-xl dark:prose-invert prose-img:inline prose-img:rounded-md prose-video:inline prose-video:rounded-md max-w-full overflow-x-auto">
					{activity.textMarkdown ? (
						<Markdown options={stable(options)}>
							{activity.textMarkdown}
						</Markdown>
					) : activity.textHtml ? (
						<Html options={stable(htmlOptions)}>{activity.textHtml}</Html>
					) : null}
				</div>
			</ErrorBoundary>
		</Card>
	)
}
