import marked from "marked"
import type { JSX, ReactNode } from "react"
import { useMemo } from "react"
import ReactRelay from "react-relay"

import { route_media, route_user } from "../../lib/route"

// console.log(R)

import createDOMPurify from "dompurify"

const { graphql } = ReactRelay

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
export function Markdown(props: { children: string; options: Options }) {
	return (
		<div className="prose md:prose-lg lg:prose-xl dark:prose-invert prose-img:rounded-md prose-video:rounded-md max-w-full overflow-x-auto">
			{useMemo(
				() => parse(markdownHtml(props.children), props.options),
				[props.children, props.options]
			)}
			{/* {import.meta.env.DEV && (
				<div className="not-prose">
					{props.children}
				</div>
			)} */}
		</div>
	)
}

export interface Options {
	replace: Partial<{
		[K in keyof JSX.IntrinsicElements]: (
			props: JSX.IntrinsicElements[K]
		) => ReactNode
	}>
}

function parse(html: string, options: Options): ReactNode {
	const subdocument = new DOMParser().parseFromString(html, "text/html")

	return traverseCollection(subdocument.body.childNodes, options)
}

function sanitizeHtml(t: string) {
	const DOMPurify = createDOMPurify(window)

	DOMPurify.addHook("afterSanitizeAttributes", (node) => {
		if ("target" in node) {
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

	d.link = (t: string, e: string, a: string) => {
		return `<a target="_blank" rel="noopener noreferrer" href="${t}" title="${e}">${a}</a>`
	}
	u.rules.heading = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/

	return (
		(t = t.replace(
			/(http)(:([/|.|\w|\s|-])*\.(?:jpg|.jpeg|gif|png|mp4|webm))/gi,
			"$1s$2"
		)),
		(t = t.replaceAll(
			/(^|>| )@([A-Za-z0-9]+)/gm,
			(group, one: string, userName: string) => {
				return `${one}<a class='user-link' data-user-name='${userName}' href='${route_user({ userName: userName })}'>@${userName}</a>`
			}
		)),
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
			// @ts-expect-error marked error types are not correct
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
			/(?:<a href="https?:\/\/anilist.co\/(anime|manga)\/)([0-9]+)(\/\w+)?.*?>(?:https?:\/\/anilist.co\/(?:anime|manga)\/[0-9]+).*?<\/a>/gm,
			(group, type: string, mediaId: string, slug: string) => {
				return `<a class="media-link" href="${route_media({ id: Number(mediaId) })}" data-type="${type}" data-slug="${slug}" data-id="${mediaId}">${route_media({ id: Number(mediaId) })}${slug}</a>`
			}
		)),
		t
	)
}

function getAttributes(attributes: Record<string, string>) {
	const {
		class: className,
		allowfullscreen: allowFullScreen,
		frameborder: frameBorder,
		..._attributes
	} = attributes

	return {
		..._attributes,
		...(className ? { className } : {}),
		...(allowFullScreen ? { allowFullScreen } : {}),
		...(frameBorder ? { frameBorder } : {}),
	}
}

function traverse(element: ChildNode, options: Options): ReactNode {
	if (element.nodeType === Node.TEXT_NODE) {
		return element.textContent
	} else if (element instanceof HTMLElement) {
		const Name =
			element.tagName.toLowerCase() as unknown as keyof JSX.IntrinsicElements
		const attributes: Record<string, string> = {}
		for (const attribute of element.attributes) {
			attributes[attribute.name] = attribute.value
		}

		const fullProps: object = {
			...getAttributes(attributes),
			children: traverseCollection(element.childNodes, options),
		}

		if (typeof options.replace[Name] === "function") {
			return options.replace[Name](fullProps)
		}

		return <Name {...fullProps} />
	}
}

function traverseCollection(
	children: NodeListOf<ChildNode>,
	options: Options
): ReactNode {
	return Array.from(children).reduce<ReactNode>(
		(acc, node) => (
			<>
				{acc}
				{traverse(node, options)}
			</>
		),
		null
	)
}
