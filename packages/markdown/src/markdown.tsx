import { use, useMemo } from "react"
import { browser } from "react-dom"

import { markdownToHtml, type Html } from "./markdown-to-html"

import type { Stable } from "@animedes/react-stable"
import type { JSX, ReactNode } from "react"

export interface Options {
	replace: Partial<{
		[K in keyof JSX.IntrinsicElements]: (
			props: JSX.IntrinsicElements[K]
		) => ReactNode
	}>
}

export interface MarkdownProps {
	children: Stable<string>
	options: Stable<Options>
	sanitizeHTML: Stable<(html: Html) => Html>
}

export function Markdown(props: MarkdownProps): ReactNode {
	void use(browser("Markdown is not supported on the server"))

	return useMemo(
		() =>
			parse(markdownToHtml(props.children, props.sanitizeHTML), props.options),
		[props.children, props.options, props.sanitizeHTML]
	)
}

function parse(html: string, options: Options): ReactNode {
	const subdocument = new DOMParser().parseFromString(html, "text/html")

	return traverseCollection(subdocument.body.childNodes, options)
}

function getAttributes(attributes: Record<string, string>) {
	const {
		class: className,
		allowfullscreen: allowFullScreen,
		frameborder: frameBorder,
		...otherAttributes
	} = attributes

	return {
		...otherAttributes,
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
