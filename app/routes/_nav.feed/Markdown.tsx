import createDOMPurify from "dompurify"

import marked from "marked"
import {
	useMemo,
	type ComponentProps,
	type JSX,
	type ReactNode
} from "react"
import { route_media, route_user } from "~/lib/route"

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

function traverse(element: ChildNode, options: any): ReactNode {
	if (element.nodeType === Node.TEXT_NODE) {
		return element.textContent
	} else if (element instanceof HTMLElement) {
		const Name = element.tagName.toLowerCase()
		const attributes: Record<string, string> = {}
		for (const attribute of element.attributes) {
			attributes[attribute.name] = attribute.value
		}

		const fullProps = {
			...getAttributes(attributes),
			children: traverseCollection(element.childNodes, options),
		}

		if (Name in options.replace) {
			return options.replace[Name](fullProps)
		}

		return <Name {...fullProps} />
	}
}

function traverseCollection(
	children: NodeListOf<ChildNode>,
	options: any
): ReactNode {
	return Array.from(children).reduce<ReactNode>(
		(acc, node, i) => (
			<>
				{acc}
				{traverse(node, options)}
			</>
		),
		null
	)
}

function parse(html: string, options: any): ReactNode {
	const subdocument = new DOMParser().parseFromString(html, "text/html")

	return traverseCollection(subdocument.body.childNodes, options)
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
			// @ts-expect-error marked types are not correct
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
export interface Options {
	replace: Partial<{
		[K in keyof JSX.IntrinsicElements]: (props: ComponentProps<K>) => ReactNode
	}>
}

export function Markdown(props: {
	children: string
	options: Options
	className?: string
}): ReactNode {
	return (
		<div className={props.className}>
			{useMemo(
				() => parse(markdownHtml(props.children), props.options),
				[props.children]
			)}
		</div>
	)
}
