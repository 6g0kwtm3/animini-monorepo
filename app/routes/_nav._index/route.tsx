import type { MetaFunction } from "@remix-run/node"
import {
	Await,
	Link,
	unstable_defineClientLoader,
	useFetcher,
	useRouteLoaderData,
} from "@remix-run/react"

import {
	Predicate,
	Array as ReadonlyArray,
	Record as ReadonlyRecord,
} from "effect"
import type { ComponentPropsWithRef, ReactNode } from "react"
import { Fragment, Suspense, createElement, useEffect, useMemo } from "react"

import marked from "marked"
import ReactRelay from "react-relay"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemImg,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "~/components/List"

import { client_operation } from "~/lib/client"

import { route_media, route_user } from "~/lib/route"

// import * as R from '@remix-run/router'
// console.log(R)

// import {RouterProvider} from 'react-router-dom'
import { useRawLoaderData } from "~/lib/data"

import { Parser } from "htmlparser2"
import { MediaCover } from "~/lib/entry/MediaCover"

import createDOMPurify from "dompurify"
import {
	TooltipRich,
	TooltipRichActions,
	TooltipRichContainer,
	TooltipRichTrigger,
} from "~/components/Tooltip"

import * as Ariakit from "@ariakit/react"
import { Button } from "~/components/Button"
import { Loading, Skeleton } from "~/components/Skeleton"
import type { clientLoader as rootLoader } from "~/root"
import type { clientLoader as userInfoLoader } from "../user.$userName.info/route"

import { ClientOnly } from "remix-utils/client-only"
import type { routeNavFeedMediaQuery } from "~/gql/routeNavFeedMediaQuery.graphql"
import type { routeNavFeedQuery } from "~/gql/routeNavFeedQuery.graphql"
import { MediaTitle } from "~/lib/MediaTitle"
import { m } from "~/lib/paraglide"
import { getThemeFromHex } from "~/lib/theme"
import type { clientAction as userFollowAction } from "../user.$userId.follow/route"
const { graphql } = ReactRelay

function MediaLink({
	mediaId,
	...props
}: Omit<ComponentPropsWithRef<typeof Link>, "to"> & {
	mediaId: number
}) {
	const data = useRawLoaderData<typeof clientLoader>()

	return (
		<Link to={route_media({ id: mediaId })} {...props}>
			<Suspense fallback="Loading...">
				<Await errorElement={"Error..."} resolve={data.media}>
					{(data) => {
						const { media, theme } = data[mediaId] ?? {}

						return (
							media && (
								<Card
									className={`not-prose inline-flex overflow-hidden text-start contrast-standard theme-light force:p-0 contrast-more:contrast-high dark:theme-dark`}
									style={theme}
									render={<span />}
								>
									<List className="force:p-0" render={<span />}>
										<ListItem render={<span />}>
											<ListItemImg>
												<MediaCover media={media} />
											</ListItemImg>
											<ListItemContent>
												<ListItemTitle render={<span />}>
													<MediaTitle mediaTitle={media.title} />
												</ListItemTitle>
												<ListItemSubtitle render={<span />}>
													{media.type}
												</ListItemSubtitle>
											</ListItemContent>
										</ListItem>
									</List>
								</Card>
							)
						)
					}}
				</Await>
			</Suspense>
		</Link>
	)
}

function matchMediaId(s: string) {
	return [...s.matchAll(/https:\/\/anilist.co\/(anime|manga)\/(\d+)/g)]
		.map((group) => Number(group[2]))
		.filter(isFinite)
}

async function getPage() {
	const data = await client_operation<routeNavFeedQuery>(
		graphql`
			query routeNavFeedQuery {
				Page(perPage: 10) {
					activities(sort: [ID_DESC], type_in: [TEXT]) {
						__typename
						... on TextActivity {
							id
							createdAt
							text
							user {
								id
								name
								avatar {
									large
									medium
								}
							}
						}
					}
				}
			}
		`,
		{}
	)
	return data?.Page
}

async function getMedia(variables: routeNavFeedMediaQuery["variables"]) {
	const data = await client_operation<routeNavFeedMediaQuery>(
		graphql`
			query routeNavFeedMediaQuery($ids: [Int]) {
				Page {
					media(id_in: $ids) {
						id
						title @required(action: LOG) {
							...MediaTitle_mediaTitle
						}
						type
						...MediaCover_media
						coverImage {
							color
						}
					}
				}
			}
		`,
		variables
	)

	return ReadonlyRecord.fromEntries(
		data?.Page?.media
			?.filter((el) => el != null)
			.map(
				(media) =>
					[
						String(media.id),
						{
							media,
							theme: Predicate.isString(media.coverImage?.color)
								? getThemeFromHex(media.coverImage.color)
								: {},
						},
					] as const
			) ?? []
	)
}

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const page = await getPage()

	const ids =
		page?.activities?.flatMap((activity) => {
			if (activity?.__typename === "TextActivity") {
				return activity.text ? matchMediaId(activity.text) : []
			}
			return []
		}) ?? []

	return {
		page,
		media: ReadonlyArray.isNonEmptyArray(ids)
			? getMedia({ ids: ids })
			: Promise.resolve<Awaited<ReturnType<typeof getMedia>>>({}),
	}
})

export default function Index(): ReactNode {
	const data = useRawLoaderData<typeof clientLoader>()

	return (
		<LayoutBody>
			<LayoutPane>
				<ul className="flex flex-col gap-2">
					{data.page?.activities
						?.filter((el) => el != null)
						.map((activity) => {
							if (activity.__typename === "TextActivity") {
								return (
									<li
										key={activity.id}
										className="animate-appear [animation-range:entry_5%_cover_20%] [animation-timeline:view()]"
									>
										<Card
											variant="filled"
											render={<article />}
											className="grid max-w-7xl gap-4 force:rounded-[1.75rem]"
										>
											<List
												lines="two"
												className="-mx-4 -my-4"
												render={<address />}
											>
												<ListItem className="hover:state-none">
													<div className="col-start-1 h-10 w-10">
														<img
															alt=""
															loading="lazy"
															src={activity.user?.avatar?.large || ""}
															className="h-10 w-10 rounded-full bg-[image:--bg] bg-cover object-cover"
															style={{
																"--bg": `url(${activity.user?.avatar?.medium})`,
															}}
														/>
													</div>
													<ListItemContent>
														<ListItemTitle>{activity.user?.name}</ListItemTitle>
														<ListItemSubtitle>
															{activity.createdAt}
														</ListItemSubtitle>
													</ListItemContent>
													{/* <ListItemTrailingSupportingText></ListItemTrailingSupportingText> */}
												</ListItem>
											</List>
											<ClientOnly>
												{() =>
													activity.text && <Markdown>{activity.text}</Markdown>
												}
											</ClientOnly>
										</Card>
									</li>
								)
							}
							return null
						})}
				</ul>
				{/* <div className="flex justify-center gap-4">
					<Button>Previous page</Button>
					<Button>Next page</Button>
				</div> */}
			</LayoutPane>
		</LayoutBody>
	)
}

interface Options {
	replace: Partial<{
		[K in keyof JSX.IntrinsicElements]: (
			props: ComponentPropsWithRef<K>
		) => ReactNode
	}>
}

const options = {
	replace: {
		center(props) {
			return <center {...props} />
		},
		p(props) {
			return <div {...props} />
		},
		a(props) {
			if (!props.href?.trim()) {
				return <span className="text-primary">{props.children}</span>
			}

			// @ts-ignore
			if (props.className === "media-link" && props["data-id"]) {
				// @ts-ignore
				return <MediaLink mediaId={props["data-id"]} />
			}

			// @ts-ignore
			if (props["data-user-name"]) {
				return (
					// @ts-ignore
					<UserLink userName={props["data-user-name"]}>
						{props.children}
					</UserLink>
				)
			}

			return (
				<a {...props} rel="noopener noreferrer" target="_blank">
					{props.children}
				</a>
			)
		},
	},
} satisfies Options

function UserLink(props: { userName: string; children: ReactNode }) {
	const fetcher = useFetcher<typeof userInfoLoader>({
		key: `${props.userName}-info`,
	})
	const follow = useFetcher<typeof userFollowAction>({
		key: `${props.userName}-follow`,
	})

	const store = Ariakit.useHovercardStore()

	// eslint-disable-next-line react-compiler/react-compiler
	const open = store.useState("open")

	useEffect(() => {
		if (open && fetcher.state === "idle" && !fetcher.data) {
			fetcher.load(`/user/${props.userName}/info`)
		}
	}, [open, fetcher, props.userName])

	const rootData = useRouteLoaderData<typeof rootLoader>("root")

	return (
		<TooltipRich placement="top" store={store}>
			<TooltipRichTrigger
				render={
					<Link to={route_user({ userName: props.userName })}>
						{props.children}
					</Link>
				}
			/>
			<TooltipRichContainer className="not-prose text-start">
				<Loading value={fetcher.data === undefined}>
					<div className="-mx-4 -my-2">
						<List lines={"two"} className="">
							<ListItem className="force:hover:state-none">
								<ListItemAvatar>
									<Skeleton full>
										<img
											src={fetcher.data?.User?.avatar?.large ?? ""}
											className="bg-[image:--bg] bg-cover bg-center object-cover object-center"
											style={{
												"--bg": `url(${fetcher.data?.User?.avatar?.medium ?? ""})`,
											}}
											loading="lazy"
											alt=""
										/>
									</Skeleton>
								</ListItemAvatar>
								<ListItemContent>
									<ListItemTitle>{props.userName}</ListItemTitle>
									<ListItemSubtitle>
										<Skeleton>
											{fetcher.data?.User?.isFollower
												? "Follower"
												: "Not follower"}
										</Skeleton>
									</ListItemSubtitle>
								</ListItemContent>
							</ListItem>
						</List>
					</div>

					<TooltipRichActions>
						{rootData?.Viewer?.name &&
							rootData.Viewer.name !== props.userName && (
								<follow.Form
									method="post"
									action={`/user/${fetcher.data?.User?.id}/follow`}
								>
									<input
										type="hidden"
										name="isFollowing"
										value={
											(follow.formData?.get("isFollowing") ??
											follow.data?.ToggleFollow.isFollowing ??
											fetcher.data?.User?.isFollowing)
												? ""
												: "true"
										}
										id=""
									/>

									<Button type="submit" aria-disabled={!fetcher.data?.User?.id}>
										{(follow.formData?.get("isFollowing") ??
										follow.data?.ToggleFollow.isFollowing ??
										fetcher.data?.User?.isFollowing)
											? m.unfollow_button()
											: m.follow_button()}
									</Button>
								</follow.Form>
							)}
					</TooltipRichActions>
					{/* <TooltipRichSubhead>{props.children}</TooltipRichSubhead>
				<TooltipRichSupportingText>{props.children}</TooltipRichSupportingText> */}
				</Loading>
			</TooltipRichContainer>
		</TooltipRich>
	)
}

// const options: HTMLReactParserOptions = {
// 	replace(domNode) {
// 		if (
// 			domNode instanceof Element &&
// 			domNode.name === "a" &&
// 			!domNode.attribs["href"]?.trim()
// 		) {
// 			return (
// 				<span className="text-primary">
// 					{domToReact(domNode.children, options)}
// 				</span>
// 			)
// 		}

// 		if (domNode instanceof Element && domNode.name === "center") {
// 			return (
// 				<span className="text-center">
// 					{domToReact(domNode.children, options)}
// 				</span>
// 			)
// 		}

// 		if (
// 			domNode instanceof Element &&
// 			domNode.attribs["class"] === "media-link" &&
// 			domNode.attribs["data-id"] &&
// 			domNode.name === "a"
// 		) {
// 			return <MediaLink mediaId={domNode.attribs["data-id"]}></MediaLink>
// 		}

// 		if (
// 			domNode instanceof Element &&
// 			domNode.attribs["class"] === "user-link" &&
// 			domNode.attribs["data-user-name"] &&
// 			domNode.name === "a"
// 		) {
// 			return (
// 				<Link  to={route_user({ userName: domNode.attribs["data-user-name"] })}>
// 					{domToReact(domNode.children, options)}
// 				</Link>
// 			)
// 		}

// 		if (domNode instanceof Element && domNode.name === "a") {
// 			return (
// 				<a
// 					{...attributesToProps(domNode.attribs)}
// 					rel="noopener noreferrer"
// 					target="_blank"
// 				>
// 					{domToReact(domNode.children, options)}
// 				</a>
// 			)
// 		}
// 	}
// }

function Markdown(props: { children: string }) {
	return (
		<div className="prose max-w-full overflow-x-auto md:prose-lg lg:prose-xl dark:prose-invert prose-img:rounded-md prose-video:rounded-md">
			{/* {(markdownHtml(props.children))} */}
			{useMemo(
				async () => parse2(markdownHtml(props.children), options),
				[props.children]
			)}
		</div>
	)
}

interface HtmlNode {
	node: ReactNode
}

class HtmlTag implements HtmlNode {
	constructor(private _name: React.FC<{ children: ReactNode }>) {}

	private _children: HtmlNode[] = []

	get children(): ReactNode {
		return this._children.reduce<ReactNode>(
			(acc, node, i) => (
				<>
					{acc}
					{node.node}
				</>
			),
			null
		)
	}

	get node() {
		return createElement(this._name, undefined, this.children)
	}

	appendNode(node: HtmlNode) {
		this._children.push(node)
	}
}

function getAttributes(attributes: any) {
	const {
		class: className,
		allowfullscreen: allowFullScreen,
		frameborder: frameBorder,
		..._attributes
	} = attributes ?? {}

	return {
		..._attributes,
		...(className ? { className } : {}),
		...(allowFullScreen ? { allowFullScreen } : {}),
		...(frameBorder ? { frameBorder } : {}),
	}
}

function parse2(html: string, options: any): ReactNode {
	const stack = [new HtmlTag(Fragment)]

	const parser = new Parser({
		onopentag(Name, attributes) {
			const node = new HtmlTag((props) => {
				const fullProps = {
					...getAttributes(attributes),
					...props,
				}

				if (Name in options.replace) {
					return options.replace[Name](fullProps)
				}

				return <Name {...fullProps} />
			})
			stack.at(-1)?.appendNode(node)
			stack.push(node)
		},
		ontext(text) {
			stack.at(-1)?.appendNode({ node: text })
		},
		onclosetag(name) {
			stack.pop()
		},
	})
	parser.write(html)
	parser.end()

	return stack[0]?.node
}

function sanitizeHtml(t: string) {
	const DOMPurify = createDOMPurify(window)

	DOMPurify.addHook("afterSanitizeAttributes", (node) => {
		if (node.tagName === "a") {
			node.setAttribute("target", "_blank")
			node.setAttribute("rel", "noopener noreferrer")
		}
	})

	const out: string = DOMPurify.sanitize(t, {
		ALLOWED_TAGS: [
			"a",
			"b",
			"blockquote",
			"br",
			"center",
			"del",
			"div",
			"em",
			"font",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"hr",
			"i",
			"img",
			"li",
			"ol",
			"p",
			"pre",
			"code",
			"span",
			"strike",
			"strong",
			"ul",
		],
		ALLOWED_ATTR: ["align", "height", "href", "src", "target", "width", "rel"],
	})

	return out
}

function markdownHtml(t: string) {
	marked.setOptions({
		gfm: true,
		tables: true,
		breaks: true,
		pedantic: false,
		sanitize: false,
		smartLists: true,
		smartypants: false,
	})

	const d = new marked.Renderer(),
		u = new marked.Lexer()

	d.link = (t: string, e: string | undefined, a: string) => {
		return `<a href="${t}" title="${e}" target="_blank" rel="noopener noreferrer">${a}</a>`
	}
	u.rules.heading = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/

	return (
		(t = t.replace(
			/(http)(:([/|.|\w|\s|-])*\.(?:jpg|.jpeg|gif|png|mp4|webm))/gi,
			"$1s$2"
		)),
		(t = t.replaceAll(/(^|>| )@([A-Za-z0-9]+)/gm, (group, one, userName) => {
			return `${one}<a class='user-link' data-user-name='${userName}' href='${route_user({ userName: userName })}'>@${userName}</a>`
		})),
		(t = t.replace(
			/img\s?(\d+%?)?\s?\((.[\S]+)\)/gi,
			"<img width='$1' src='$2'>"
		)),
		(t = t.replace(
			/youtube\s?\([^]*?([-_0-9A-Za-z]{10,15})[^]*?\)/gi,
			"youtube ($1)"
		)),
		(t = t.replace(
			/webm\s?\(h?([A-Za-z0-9-._~:/?#[\]@!$&()*+,;=%]+)\)/gi,
			"webmv(`$1`)"
		)),
		(t = t.replace(/~{3}([^]*?)~{3}/gm, "+++$1+++")),
		(t = t.replace(/~!([^]*?)!~/gm, '<div rel="spoiler">$1</div>')),
		(t = sanitizeHtml(
			// @ts-ignore
			marked(t, {
				renderer: d,
				lexer: u,
			})
		)),
		(t = t.replace(/\+{3}([^]*?)\+{3}/gm, "<center>$1</center>")),
		(t = t.replace(
			/<div rel="spoiler">([\s\S]*?)<\/div>/gm,
			"<details><summary>Show spoiler</summary>$1</details>"
		)),
		(t = t.replace(
			/youtube\s?\(([-_0-9A-Za-z]{10,15})\)/gi,
			"<iframe width='450' height='315' src='https://www.youtube.com/embed/$1/' title='YouTube video player' frameBorder='0' name='1' class='rounded-md' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;' allowfullscreen loading='lazy'>Your browser does not support iframes</iframe>"
		)),
		(t = t.replace(
			/webmv\s?\(<code>([A-Za-z0-9-._~:/?#[\]@!$&()*+,;=%]+)<\/code>\)/gi,
			"<video muted loop controls><source src='h$1' type='video/webm'>Your browser does not support the video tag.</video>"
		)),
		(t = t.replace(
			/(?:<a.*?href="https?:\/\/anilist.co\/(anime|manga)\/)([0-9]+).*?>(?:https?:\/\/anilist.co\/(?:anime|manga)\/[0-9]+).*?<\/a>/gm,
			(group, _, mediaId) => {
				return `<a class="media-link" href="${route_media({ id: mediaId })}" data-id="${mediaId}">Loading...</a>`
			}
		)),
		t
	)
}

export const meta = (() => {
	return [{ title: "Feed" }]
}) satisfies MetaFunction
