// console.log(R)

import { type Options } from "markdown/Markdown"
import * as Predicate from "~/lib/Predicate"
import { MediaLink } from "./MediaLink"
import { UserLink } from "./UserLink"

export const options: Options = {
	replace: {
		a(props) {
			if (!props.href?.trim()) {
				return <span className="text-primary">{props.children}</span>
			}

			let mediaId: number

			if (
				props.className === "media-link"
				&& "data-id" in props
				&& "data-type" in props
				&& "data-slug" in props
				&& Predicate.isString(props["data-type"])
				&& Predicate.isString(props["data-slug"])
				&& isFinite((mediaId = Number(props["data-id"])))
			) {
				return (
					<MediaLink
						{...props}
						mediaId={mediaId}
						slug={props["data-slug"]}
						type={props["data-type"]}
					/>
				)
			}

			if (
				"data-user-name" in props
				&& Predicate.isString(props["data-user-name"])
			) {
				return (
					<UserLink userName={props["data-user-name"]}>
						{props.children}
					</UserLink>
				)
			}

			return (
				<a
					{...props}
					className="text-primary"
					rel="noopener noreferrer"
					target="_blank"
				>
					{props.children}
				</a>
			)
		},
	},
} satisfies Options
