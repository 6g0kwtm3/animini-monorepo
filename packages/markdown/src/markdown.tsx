import type { JSX, ReactNode } from "react"
import { useMemo } from "react"

import createDOMPurify from "dompurify"
import { markdownToHtml } from "./markdown-to-html"

export interface Options {
	replace: Partial<{
		[K in keyof JSX.IntrinsicElements]: (
			props: JSX.IntrinsicElements[K]
		) => ReactNode
	}>
}

export function Markdown(props: { children: string; options: Options }) {
	return useMemo(
		() => parse(markdownToHtml(props.children, sanitizeHtml), props.options),
		[props.children, props.options]
	)
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
