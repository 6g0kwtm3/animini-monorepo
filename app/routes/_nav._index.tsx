import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/cloudflare"
import { Await, defer, Link, useLoaderData } from "@remix-run/react"

import { Predicate, ReadonlyArray, ReadonlyRecord } from "effect"
import { Suspense } from "react"

import marked from "marked"
import { Card } from "~/components/Card"
import { LayoutPane } from "~/components/Layout"
import List from "~/components/List"
import { graphql } from "~/gql"
import { client_operation } from "~/lib/client"

import createDOMPurify from "dompurify"
import { route_media } from "~/lib/route"

// import * as R from '@remix-run/router'
// console.log(R)

import { JSDOM } from "jsdom"
import { serverOnly$ } from "vite-env-only"
// import {RouterProvider} from 'react-router-dom'
import type { VariablesOf } from "@graphql-typed-document-node/core"
import parse, {
	domToReact,
	Element,
	type HTMLReactParserOptions
} from "html-react-parser"

function MediaLink({ mediaId, ...props }) {
	const data = useLoaderData<typeof loader>()

	return (
		<Link to={route_media({ id: mediaId })} {...props}>
			<Suspense fallback="Loading...">
				<Await errorElement={"Error..."} resolve={data.Media}>
					{(data) => {
						const media = data[mediaId]
						return (
							media && (
								<>
									<Card
										className="not-prose inline-flex overflow-hidden text-start theme-[--theme] force:p-0"
										style={{
											"--theme": media.coverImage?.color
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
		{ signal: args.request.signal }
	)

	const id_in =
		data?.Page?.activities?.flatMap((activity) => {
			if (activity?.__typename === "TextActivity") {
				return activity.text ? matchMediaId(activity.text) : []
			}
			return []
		}) ?? []

	return defer({
		Page: data?.Page,
		Media: ReadonlyArray.isNonEmptyArray(id_in)
			? getMedia({ id_in }, args)
			: Promise.resolve<Awaited<ReturnType<typeof getMedia>>>({})
	})
}

const IndexMediaQuery = graphql(`
	query IndexMediaQuery($id_in: [Int]) {
		Page {
			media(id_in: $id_in) {
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

async function getMedia(
	variables: VariablesOf<typeof IndexMediaQuery>,
	args: LoaderFunctionArgs
) {
	const data = await client_operation(IndexMediaQuery, variables, {
		signal: args.request.signal
	})

	return ReadonlyRecord.fromEntries(
		data?.Page?.media
			?.filter(Predicate.isNotNull)
			.map((media) => [String(media.id), media] as const) ?? []
	)
}

export const loader = ((args) => {
	return indexLoader(args)
}) satisfies LoaderFunction

export const clientLoader = ((args) => {
	return indexLoader(args)
}) satisfies LoaderFunction

export default function Index() {
	const data = useLoaderData<typeof loader>()

	return (
		<>
			<LayoutPane className="">
				<ul className="flex flex-col gap-2">
					{data.Page?.activities
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

const options: HTMLReactParserOptions = {
	replace(domNode) {
		if (
			domNode instanceof Element &&
			domNode.name === "a" &&
			!domNode.attribs["href"]?.trim()
		) {
			return (
				<span className="text-primary">
					{domToReact(domNode.children, options)}
				</span>
			)
		}

		if (
			domNode instanceof Element &&
			domNode.attribs["class"] === "media-link" &&
			domNode.attribs["data-id"] &&
			domNode.name === "a"
		) {
			return <MediaLink mediaId={domNode.attribs["data-id"]}></MediaLink>
		}
	}
}

function Markdown(props: { children: string }) {
	return (
		<div className="prose max-w-full overflow-x-auto md:prose-lg lg:prose-xl dark:prose-invert prose-img:rounded-md prose-video:rounded-md">
			{parse(markdownHtml(props.children), options)}
		</div>
	)
}

function _sanitize(t: string) {
	const DOMPurify = createDOMPurify(
		serverOnly$(new JSDOM("").window) ?? globalThis.window
	)

	return (
		DOMPurify.addHook("afterSanitizeAttributes", (t) => {
			if ("target" in t) {
				t.setAttribute("target", "_blank")
				t.setAttribute("rel", "noopener noreferrer")
			}
		}),
		DOMPurify.sanitize(t, {
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
				"ul"
			],
			ALLOWED_ATTR: ["align", "height", "href", "src", "target", "width", "rel"]
		})
	)
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

	d.link = (t, e, a) => {
		return `<a target="_blank" rel="noopener noreferrer" href="${t}" title="${e}">${a}</a>`
	}

	u.rules.heading = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/

	return (
		(t = t.replace(
			/(http)(:([/|.|\w|\s|-])*\.(?:jpg|.jpeg|gif|png|mp4|webm))/gi,
			"$1s$2"
		)),
		(t = t.replace(
			/img\s?(\d+%?)?\s?\((.[\S]+)\)/gi,
			"<img width='$1' src='$2'>"
		)),
		(t = t.replace(
			/(^|>| )@([A-Za-z0-9]+)/gm,
			"$1<a target='_blank' href='/user/$2'>@$2</a>"
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
		(t = _sanitize(
			marked(t, {
				renderer: d,
				lexer: u
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
			/(?:<a href="https?:\/\/anilist.co\/(anime|manga)\/)([0-9]+).*?>(?:https?:\/\/anilist.co\/(?:anime|manga)\/[0-9]+).*?<\/a>/gm,
			(group, _, mediaId) => {
				return `<a class="media-link" href="${route_media({ id: mediaId })}" data-id="${mediaId}">Loading...</a>`
			}
		)),
		(serverOnly$(normalizeHtml) ?? clientNormalizeHtml)(t)
	)
}

function clientNormalizeHtml(t: string) {
	const div = document.createElement("div")
	div.innerHTML = t
	return div.innerHTML
}

function normalizeHtml(t: string) {
	const dom = new JSDOM(t)
	return dom.window.document.documentElement.innerHTML
}
