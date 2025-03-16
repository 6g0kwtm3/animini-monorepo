// console.log(R)

import * as Predicate from "~/lib/Predicate"
import { type Options } from "markdown"
import { MediaLink } from "./MediaLink"
import { UserLink } from "./UserLink"

export const options: Options = {
	replace: {
		a(props) {
			if (!props.href?.trim()) {
				return <a className="text-primary">{props.children}</a>
			}

			let mediaId: number

			if (
				props.className === "media-link" &&
				"data-id" in props &&
				"data-type" in props &&
				"data-slug" in props &&
				Predicate.isString(props["data-type"]) &&
				Predicate.isString(props["data-slug"]) &&
				isFinite((mediaId = Number(props["data-id"])))
			) {
				return (
					<MediaLink
						{...props}
						mediaId={mediaId}
						type={props["data-type"]}
						slug={props["data-slug"]}
					/>
				)
			}

			if (
				"data-user-name" in props &&
				Predicate.isString(props["data-user-name"])
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
					rel="noopener noreferrer"
					target="_blank"
					className="text-primary"
				>
					{props.children}
				</a>
			)
		},
	},
} satisfies Options
