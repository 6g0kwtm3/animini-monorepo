import type {
	HeadersFunction,
	LoaderFunction,
	LoaderFunctionArgs
} from "@remix-run/cloudflare"
import { Await, Link, defer } from "@remix-run/react"

import { Predicate, ReadonlyArray, ReadonlyRecord } from "effect"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { Fragment, Suspense, createElement } from "react"

import marked from "marked"
import { Card } from "~/components/Card"
import { LayoutPane } from "~/components/Layout"
import List from "~/components/List"
import { graphql } from "~/gql"
import { client_operation } from "~/lib/client"

import { route_media, route_user } from "~/lib/route"

// import * as R from '@remix-run/router'
// console.log(R)

import { serverOnly$ } from "vite-env-only"
// import {RouterProvider} from 'react-router-dom'
import type { VariablesOf } from "@graphql-typed-document-node/core"
import { useRawLoaderData } from "~/lib/data"

import { Parser } from "htmlparser2"
import sanitizeHtml_ from "sanitize-html"

function MediaLink({ mediaId, ...props }) {
	const data = useRawLoaderData<typeof loader>()

	return (
		<Link to={route_media({ id: mediaId })} {...props}>
			<Suspense fallback="Loading...">
				<Await errorElement={"Error..."} resolve={data.media}>
					{(data) => {
						const media = data[mediaId]
						return (
							media && (
								<>
									<Card
										className={`not-prose inline-flex overflow-hidden text-start force:p-0${media.coverImage?.color ? ` theme-[--theme]` : ""}`}
										style={{
											"--theme": media.coverImage?.color ?? ""
										}}
										render={<span />}
									>
										<List className="force:p-0" render={<span />}>
											<List.Item className="" render={<span />}>
												{media.coverImage?.extraLarge ? (
													<span className="col-start-1 flex h-10 w-10">
														<img
															src={media.coverImage.extraLarge}
															alt=""
															className="h-10 w-10 rounded-full bg-[image:--bg] bg-cover object-cover"
															style={{
																"--bg": `url(${media.coverImage.medium})`
															}}
															loading="lazy"
														/>
													</span>
												) : (
													<span className="col-start-1 flex h-10 w-10 items-center justify-center rounded-full bg-error">
														<span className="i text-on-error">error</span>
													</span>
												)}
												<span className="col-start-2 grid grid-cols-subgrid">
													<List.Item.Title render={<span />}>
														{media.title?.userPreferred}
													</List.Item.Title>
													<List.Item.Subtitle render={<span />}>
														{media.type}
													</List.Item.Subtitle>
												</span>
											</List.Item>
										</List>
									</Card>
								</>
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

async function indexLoader(args: LoaderFunctionArgs) {
	const data = await client_operation(
		graphql(`
			query IndexQuery {
				Page {
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
		`),
		{},
		args
	)

	const ids =
		data?.Page?.activities?.flatMap((activity) => {
			if (activity?.__typename === "TextActivity") {
				return activity.text ? matchMediaId(activity.text) : []
			}
			return []
		}) ?? []

	return defer(
		{
			page: data?.Page,
			media: ReadonlyArray.isNonEmptyArray(ids)
				? getMedia({ ids: ids }, args)
				: Promise.resolve<Awaited<ReturnType<typeof getMedia>>>({})
		},
		{
			headers: {
				"Cache-Control": "max-age=5, stale-while-revalidate=55, private"
			}
		}
	)
}

export const headers: HeadersFunction = () => {
	return { "Cache-Control": "max-age=5, stale-while-revalidate=55, private" }
}

const indexMediaQuery = serverOnly$(
	graphql(`
		query IndexMediaQuery($ids: [Int]) {
			Page {
				media(id_in: $ids) {
					id
					title {
						userPreferred
					}
					type
					coverImage {
						color
						extraLarge
						medium
					}
				}
			}
		}
	`)
)

async function getMedia(
	variables: VariablesOf<typeof indexMediaQuery>,
	args: LoaderFunctionArgs
) {
	const data = await client_operation(indexMediaQuery!, variables, args)

	return ReadonlyRecord.fromEntries(
		data?.Page?.media
			?.filter(Predicate.isNotNull)
			.map((media) => [String(media.id), media] as const) ?? []
	)
}

export const loader = ((args) => {
	return indexLoader(args)
}) satisfies LoaderFunction

// export const clientLoader = ((args) => {
// 	return indexLoader(args)
// }) satisfies LoaderFunction

export default function Index() {
	const data = useRawLoaderData<typeof loader>()

	return (
		<>
			<LayoutPane className="">
				<ul className="flex flex-col gap-2">
					{data.page?.activities
						?.filter(Predicate.isNotNull)
						.map((activity) => {
							if (activity.__typename === "TextActivity") {
								return (
									<li key={activity.id}>
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
												<List.Item className="hover:state-none">
													<div className="col-start-1 h-10 w-10">
														<img
															alt=""
															loading="lazy"
															src={activity.user?.avatar?.large || ""}
															className="h-10 w-10 rounded-full bg-[image:--bg] bg-cover object-cover"
															style={{
																"--bg": `url(${activity.user?.avatar?.medium})`
															}}
														/>
													</div>
													<div className="col-start-2">
														<List.Item.Title>
															{activity.user?.name}
														</List.Item.Title>
														<List.Item.Subtitle>
															{activity.createdAt}
														</List.Item.Subtitle>
													</div>
													{/* <List.Item.TrailingSupportingText></List.Item.TrailingSupportingText> */}
												</List.Item>
											</List>
											{activity.text && <Markdown>{activity.text}</Markdown>}
										</Card>
									</li>
								)
							}
							return null
						})}
				</ul>
			</LayoutPane>
			<LayoutPane variant="flexible" className="max-md:hidden"></LayoutPane>
		</>
	)
}

const options = {
	replace: {
		center(props) {
			return <div {...props} className="text-center"></div>
		},
		p(props) {
			return <div {...props} className=""></div>
		},
		a(props) {
			if (!props["href"]?.trim()) {
				return <span className="text-primary">{props.children}</span>
			}

			if (props["className"] === "media-link" && props["data-id"]) {
				return <MediaLink mediaId={props["data-id"]}></MediaLink>
			}

			if (props["className"] === "user-link" && props["data-user-name"]) {
				return (
					<Link to={route_user({ userName: props["data-user-name"] })}>
						{props.children}
					</Link>
				)
			}

			return (
				<a {...props} rel="noopener noreferrer" target="_blank">
					{props.children}
				</a>
			)
		}
	}
} satisfies {
	replace: {
		[K in keyof JSX.IntrinsicElements]: (
			props: ComponentPropsWithoutRef<K>
		) => ReactNode
	}
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
// 				<Link to={route_user({ userName: domNode.attribs["data-user-name"] })}>
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
			{parse2(markdownHtml(props.children), options)}
		</div>
	)
}

interface HtmlNode {
	node: ReactNode
}

class HtmlTag implements HtmlNode {
	constructor(
		private _name: Parameters<typeof createElement>[0],
		private _attributes?: {
			[s: string]: string
		},
		private options
	) {}

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

	get attributes() {
		const {
			class: className,
			allowfullscreen: allowFullScreen,
			frameborder: frameBorder,
			..._attributes
		} = this._attributes ?? {}
		return {
			..._attributes,
			...(className ? { className } : {}),
			...(allowFullScreen ? { allowFullScreen } : {}),
			...(frameBorder ? { frameBorder } : {})
		}
	}

	get node() {
		if (Predicate.isString(this._name) && this._name in this.options?.replace)
			return this.options.replace[this._name]({
				...this.attributes,
				children: this.children
			})

		return createElement(this._name, this.attributes, this.children)
	}

	appendNode(node: HtmlNode) {
		this._children.push(node)
	}
}

function parse2(html: string, options): ReactNode {
	const stack = [new HtmlTag(Fragment)]

	const log = {
		html,
		logs: []
	}

	const parser = new Parser({
		onopentag(name, attributes) {
			log.logs.push(["open", name])
			const node = new HtmlTag(name, attributes, options)
			stack.at(-1)?.appendNode(node)
			stack.push(node)
		},
		ontext(text) {
			stack.at(-1)?.appendNode({ node: text })
		},
		onclosetag(name) {
			log.logs.push(["close", name])
			stack.pop()
		}
	})
	parser.write(html)
	parser.end()

	return stack[0]?.node
}
const d = Date.now()

function sanitizeHtml(t: string) {
	const out: string = sanitizeHtml_(t, {
		allowedTags: [
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
			"ul"
		],
		allowedAttributes: {
			"*": ["align", "height", "href", "src", "target", "width", "rel"]
		}
	})
	// const domPurify = createDOMPurify(
	// 	serverOnly$(new JSDOM("").window) ?? globalThis.window
	// )

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
		smartypants: false
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
			marked(t, {
				renderer: d,
				lexer: u
			})
		)),
		(t = t.replace(/\+{3}([^]*?)\+{3}/gm, "<div class='text-center'>$1</div>")),
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
			/(?:<a href="https?:\/\/anilist.co\/(anime|manga)\/)([0-9]+).*?>(?:https?:\/\/anilist.co\/(?:anime|manga)\/[0-9]+).*?<\/a>/gm,
			(group, _, mediaId) => {
				return `<a class="media-link" href="${route_media({ id: mediaId })}" data-id="${mediaId}">Loading...</a>`
			}
		)),
		t
	)
}
