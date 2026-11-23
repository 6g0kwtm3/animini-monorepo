import * as Predicate from "@animedes/components/Predicate"
import { type Options } from "markdown/Markdown"

import { matchPath } from "react-router"

import { InViewIframe, InViewProvider } from "./InView"
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
				&& (props["data-type"] === "anime" || props["data-type"] === "manga")
				&& Predicate.isString(props["data-slug"])
				&& isFinite((mediaId = Number(props["data-id"])))
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

export const htmlOptions: Options = {
	text(text) {
		if (URL.canParse(text)) {
			const url = new URL(text)
			const match = matchPath("/:type/:id/:slug?", url.pathname)

			let mediaId: number
			if (
				match != null
				&& (match.params.type === "anime" || match.params.type === "manga")
				&& isFinite((mediaId = Number(match.params.id)))
			) {
				return (
					<MediaLink
						mediaId={mediaId}
						type={match.params.type}
						slug={match.params.slug}
					/>
				)
			}
		}

		return text
	},
	replace: {
		div(props) {
			if (props.className === "markdown-spoiler") {
				return (
					<InViewProvider>
						<details>
							<summary>
								{"data-label" in props
								&& typeof props["data-label"] === "string"
									? props["data-label"]
									: "Show spoiler"}
							</summary>
							{props.children}
						</details>
					</InViewProvider>
				)
			}
			if (props.className === "youtube") {
				return (
					<InViewIframe
						width="450"
						height="315"
						src={`https://www.youtube.com/embed/${props.id}/`}
						title="YouTube video player"
						name="1"
						className="rounded-md border-none"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
						allowFullScreen
					>
						Your browser does not support iframes
					</InViewIframe>
				)
			}

			return <div {...props} />
		},
		video() {
			return <video muted loop controls></video>
		},
		a(props) {
			if (!props.href?.trim() || !URL.canParse(props.href)) {
				return <span className="text-primary">{props.children}</span>
			}

			const href = new URL(props.href)

			let mediaId: number

			if (
				props.className === "media-link"
				&& "data-id" in props
				&& "data-type" in props
				&& "data-slug" in props
				&& (props["data-type"] === "anime" || props["data-type"] === "manga")
				&& Predicate.isString(props["data-slug"])
				&& isFinite((mediaId = Number(props["data-id"])))
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

			const matchUser = matchPath("/user/:userName", href.pathname)

			if (matchUser?.params.userName != null) {
				return (
					<UserLink userName={matchUser.params.userName}>
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
