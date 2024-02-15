import type {
	Token,
	TokenizerExtensionFunction,
	TokenizerStartFunction,
	Tokens,
	MarkedOptions as _MarkedOptions
} from "marked"
import { TextRenderer, Renderer as _Renderer, getDefaults } from "marked"
import { type ReactNode } from "react"

export interface RendererThis<T> {
	parser: _Parser<T>
}

export const JsxMonoid: Monoid<ReactNode> = {
	concat: (a, b) => (
		<>
			{a}
			{b}
		</>
	),
	empty: null
}

class TextMonoid implements Monoid<string> {
	concat(a: string, b: string): string {
		return a + b
	}
	empty: string = ""
}

class _TextRenderer extends TextRenderer {
	monoid = new TextMonoid()
}

export type RendererExtensionFunction<T> = (
	this: RendererThis<T>,
	token: Tokens.Generic
) => T | false | undefined

interface MarkedOptions<T>
	extends Omit<_MarkedOptions, "renderer" | "extensions"> {
	monoid: Monoid<T>

	renderer?: Renderer<T> | undefined | null
	extensions?: null | {
		renderers: {
			[name: string]: RendererExtensionFunction<T>
		}
		childTokens: {
			[name: string]: string[]
		}
		inline?: TokenizerExtensionFunction[]
		block?: TokenizerExtensionFunction[]
		startInline?: TokenizerStartFunction[]
		startBlock?: TokenizerStartFunction[]
	}
}

interface Monoid<T> {
	concat: (a: T, b: T) => T
	empty: T
}

interface Renderer<T> {
	options: MarkedOptions<T>

	monoid: Monoid<T>

	code: (code: string, infostring: string | undefined, escaped: boolean) => T
	blockquote: (quote: T) => T
	html: (html: string, block?: boolean) => T
	heading: (text: T, level: number, raw: string) => T
	hr: () => T
	list: (body: T, ordered: boolean, start: number | "") => T
	listitem: (text: T, task: boolean, checked: boolean) => T
	checkbox: (checked: boolean) => T
	paragraph: (text: T) => T
	table: (header: T, body: T) => T
	tablerow: (content: T) => T
	tablecell: (
		content: T,
		flags: {
			header: boolean
			align: "center" | "left" | "right" | null
		}
	) => T
	/**
	 * span level renderer
	 */
	strong: (text: T) => T
	em: (text: T) => T
	codespan: (text: string) => T
	br: () => T
	del: (text: T) => T
	link: (href: string, title: string | null | undefined, text: T) => T
	image: (href: string, title: string | null, text: string) => T
	text: (text: string) => T
}

const htmlUnescapes: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'"
}
const reEscapedHtml = /&(?:amp|lt|gt|quot|#(?:0+)?39);/g
const reHasEscapedHtml = RegExp(reEscapedHtml.source)
export const unescape = (str = "") => {
	return reHasEscapedHtml.test(str)
		? str.replace(reEscapedHtml, (entity) => htmlUnescapes[entity]! || "'")
		: str
}

export class _Parser<T> {
	options: MarkedOptions<T>
	renderer: Renderer<T>
	textRenderer: _TextRenderer

	constructor(options?: MarkedOptions<T>) {
		this.options = options || getDefaults()
		this.options.renderer = this.options.renderer || new _Renderer()
		this.renderer = this.options.renderer
		this.renderer.options = this.options
		this.textRenderer = new _TextRenderer()
	}

	/**
	 * Static Parse Method
	 */
	static parse<T>(tokens: Token[], options?: MarkedOptions<T>) {
		const parser = new this(options)
		return parser.parse(tokens)
	}

	/**
	 * Static Parse Inline Method
	 */
	static parseInline<T>(tokens: Token[], options?: MarkedOptions<T>) {
		const parser = new this(options)
		return parser.parseInline(tokens)
	}

	/**
	 * Parse Loop
	 */
	parse(tokens: Token[], top = true): T {
		let out = this.options.monoid.empty

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i]!

			// Run any renderer extensions
			if (
				this.options.extensions &&
				this.options.extensions.renderers &&
				this.options.extensions.renderers[token.type]!
			) {
				const genericToken = token as Tokens.Generic
				const ret = this.options.extensions.renderers[genericToken.type]!.call(
					{ parser: this },
					genericToken
				)
				if (
					ret !== false ||
					![
						"space",
						"hr",
						"heading",
						"code",
						"table",
						"blockquote",
						"list",
						"html",
						"paragraph",
						"text"
					]!.includes(genericToken.type)
				) {
					out = this.options.monoid.concat(
						out,
						ret || this.options.monoid.empty
					)
					continue
				}
			}

			switch (token.type) {
				case "space": {
					continue
				}
				case "hr": {
					out = this.options.monoid.concat(out, this.renderer.hr())
					continue
				}
				case "heading": {
					const headingToken = token as Tokens.Heading

					out = this.options.monoid.concat(
						out,
						this.renderer.heading(
							this.parseInline(headingToken.tokens),
							headingToken.depth,
							unescape(
								this.parseInline(
									headingToken.tokens,
									this.textRenderer,
									new TextMonoid()
								)
							)
						)
					)
					continue
				}
				case "code": {
					const codeToken = token as Tokens.Code

					out = this.options.monoid.concat(
						out,
						this.renderer.code(
							codeToken.text,
							codeToken.lang,
							!!codeToken.escaped
						)
					)
					continue
				}
				case "table": {
					const tableToken = token as Tokens.Table
					let header = this.options.monoid.empty

					// header
					let cell = this.options.monoid.empty
					for (let j = 0; j < tableToken.header.length; j++) {
						cell = this.options.monoid.concat(
							cell,
							this.renderer.tablecell(
								this.parseInline(tableToken.header[j]!.tokens),
								{ header: true, align: tableToken.align[j]! }
							)
						)
					}
					header = this.options.monoid.concat(
						header,
						this.renderer.tablerow(cell)
					)

					let body = this.options.monoid.empty
					for (let j = 0; j < tableToken.rows.length; j++) {
						const row = tableToken.rows[j]!

						cell = this.options.monoid.empty
						for (let k = 0; k < row.length; k++) {
							cell = this.options.monoid.concat(
								cell,
								this.renderer.tablecell(this.parseInline(row[k]!.tokens), {
									header: false,
									align: tableToken.align[k]!
								})
							)
						}

						body = this.options.monoid.concat(
							body,
							this.renderer.tablerow(cell)
						)
					}

					out = this.options.monoid.concat(
						out,
						this.renderer.table(header, body)
					)
					continue
				}
				case "blockquote": {
					const blockquoteToken = token as Tokens.Blockquote
					const body = this.parse(blockquoteToken.tokens)

					out = this.options.monoid.concat(out, this.renderer.blockquote(body))
					continue
				}
				case "list": {
					const listToken = token as Tokens.List
					const ordered = listToken.ordered
					const start = listToken.start
					const loose = listToken.loose

					let body = this.options.monoid.empty
					for (let j = 0; j < listToken.items.length; j++) {
						const item = listToken.items[j]!
						const checked = item.checked
						const task = item.task

						let itemBody = this.options.monoid.empty
						if (item.task) {
							const checkbox = this.renderer.checkbox(!!checked)
							if (loose) {
								if (
									item.tokens.length > 0 &&
									item.tokens[0]!.type === "paragraph"
								) {
									item.tokens[0]!.text = checkbox + " " + item.tokens[0]!.text
									if (
										item.tokens[0]!.tokens &&
										item.tokens[0]!.tokens.length > 0 &&
										item.tokens[0]!.tokens[0]!.type === "text"
									) {
										item.tokens[0]!.tokens[0]!.text =
											checkbox + " " + item.tokens[0]!.tokens[0]!.text
									}
								} else {
									item.tokens.unshift({
										type: "text",
										text: checkbox + " "
									} as Tokens.Text)
								}
							} else {
								itemBody = this.options.monoid.concat(itemBody, checkbox + " ")
							}
						}

						itemBody = this.options.monoid.concat(
							itemBody,
							this.parse(item.tokens, loose)
						)
						body = this.options.monoid.concat(
							body,
							this.renderer.listitem(itemBody, task, !!checked)
						)
					}

					out = this.options.monoid.concat(
						out,
						this.renderer.list(body, ordered, start)
					)
					continue
				}
				case "html": {
					const htmlToken = token as Tokens.HTML

					out = this.options.monoid.concat(
						out,
						this.renderer.html(htmlToken.text, htmlToken.block)
					)
					continue
				}
				case "paragraph": {
					const paragraphToken = token as Tokens.Paragraph

					out = this.options.monoid.concat(
						out,
						this.renderer.paragraph(this.parseInline(paragraphToken.tokens))
					)
					continue
				}
				case "text": {
					let textToken = token as Tokens.Text
					let body = textToken.tokens
						? this.parseInline(textToken.tokens)
						: textToken.text
					while (i + 1 < tokens.length && tokens[i + 1]!.type === "text") {
						textToken = tokens[++i]! as Tokens.Text
						body +=
							"\n" +
							(textToken.tokens
								? this.parseInline(textToken.tokens)
								: textToken.text)
					}

					out = this.options.monoid.concat(
						out,
						top ? this.renderer.paragraph(body) : body
					)
					continue
				}

				default: {
					const errMsg = 'Token with "' + token.type + '" type was not found.'
					if (this.options.silent) {
						console.error(errMsg)
						return this.options.monoid.empty
					} else {
						throw new Error(errMsg)
					}
				}
			}
		}

		return out
	}

	/**
	 * Parse Inline Tokens
	 */
	parseInline(tokens: Token[], renderer?: Renderer<T>, monoid?: Monoid<T>): T
	parseInline(
		tokens: Token[],
		renderer: _TextRenderer,
		monoid: Monoid<string>
	): string
	parseInline(
		tokens: Token[],
		renderer?: Renderer<T> | _TextRenderer,
		monoid?: Monoid<T> | Monoid<string>
	): T | string {
		renderer = renderer || this.renderer
		monoid = monoid || this.options.monoid
		let out = monoid.empty

		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i]!

			// Run any renderer extensions
			if (
				this.options.extensions &&
				this.options.extensions.renderers &&
				this.options.extensions.renderers[token.type]!
			) {
				const ret = this.options.extensions.renderers[token.type]!.call(
					{ parser: this },
					token
				)
				if (
					ret !== false ||
					![
						"escape",
						"html",
						"link",
						"image",
						"strong",
						"em",
						"codespan",
						"br",
						"del",
						"text"
					]!.includes(token.type)
				) {
					out = monoid.concat(out, ret || monoid.empty)
					continue
				}
			}

			switch (token.type) {
				case "escape": {
					const escapeToken = token as Tokens.Escape

					out = monoid.concat(out, renderer.text(escapeToken.text))
					break
				}
				case "html": {
					const tagToken = token as Tokens.Tag

					out = monoid.concat(out, renderer.html(tagToken.text))
					break
				}
				case "link": {
					const linkToken = token as Tokens.Link

					out = monoid.concat(
						out,
						renderer.link(
							linkToken.href,
							linkToken.title,
							this.parseInline(linkToken.tokens, renderer, monoid)
						)
					)
					break
				}
				case "image": {
					const imageToken = token as Tokens.Image

					out = monoid.concat(
						out,
						renderer.image(imageToken.href, imageToken.title, imageToken.text)
					)
					break
				}
				case "strong": {
					const strongToken = token as Tokens.Strong

					out = monoid.concat(
						out,
						renderer.strong(
							this.parseInline(strongToken.tokens, renderer, monoid)
						)
					)
					break
				}
				case "em": {
					const emToken = token as Tokens.Em

					out = monoid.concat(
						out,
						renderer.em(this.parseInline(emToken.tokens, renderer, monoid))
					)
					break
				}
				case "codespan": {
					const codespanToken = token as Tokens.Codespan

					out = monoid.concat(out, renderer.codespan(codespanToken.text))
					break
				}
				case "br": {
					out = monoid.concat(out, renderer.br())
					break
				}
				case "del": {
					const delToken = token as Tokens.Del

					out = monoid.concat(
						out,
						renderer.del(this.parseInline(delToken.tokens, renderer, monoid))
					)
					break
				}
				case "text": {
					const textToken = token as Tokens.Text

					out = monoid.concat(out, renderer.text(textToken.text))
					break
				}
				default: {
					const errMsg = 'Token with "' + token.type + '" type was not found.'
					if (this.options.silent) {
						console.error(errMsg)
						return monoid.empty
					} else {
						throw new Error(errMsg)
					}
				}
			}
		}
		return out
	}
}

const escapeTest = /[&<>"']/
const escapeReplace = new RegExp(escapeTest.source, "g")
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g")
const escapeReplacements: { [index: string]: string } = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;"
}
const getEscapeReplacement = (ch: string) => escapeReplacements[ch]!

export function escape(html: string, encode?: boolean) {
	if (encode) {
		if (escapeTest.test(html)) {
			return html.replace(escapeReplace, getEscapeReplacement)
		}
	} else {
		if (escapeTestNoEncode.test(html)) {
			return html.replace(escapeReplaceNoEncode, getEscapeReplacement)
		}
	}

	return html
}

export class JsxRenderer implements Renderer<ReactNode> {
	options: MarkedOptions<ReactNode> = {}

	code = (code: string, infostring: string | undefined, escaped: boolean) => {
		return (
			<pre>
				<code>{escaped ? code : escape(code, true)}</code>
			</pre>
		)
	}

	blockquote = (quote: ReactNode) => <blockquote>{quote}</blockquote>

	html = (html: string, block?: boolean | undefined) => {
		return null
	}

	heading = (text: ReactNode, level: number, raw: string) => {
		const Tag = `h${level}`
		return <Tag>{text}</Tag>
	}
	hr = () => <hr></hr>

	list = (body: ReactNode, ordered: boolean, start: number | "") => {
		const Tag = ordered ? "ol" : "ul"

		return (
			<Tag start={ordered && start !== 1 ? start || undefined : undefined}>
				{body}
			</Tag>
		)
	}

	listitem = (text: ReactNode, task: boolean, checked: boolean) => (
		<li>{text}</li>
	)
	checkbox = (checked: boolean) => (
		<input type="checkbox" disabled checked={checked} />
	)
	paragraph = (text: ReactNode) => <p>{text}</p>
	table = (header: ReactNode, body: ReactNode) => (
		<table>
			<thead>{header}</thead>
			{body}
		</table>
	)
	tablerow = (content: ReactNode) => <tr>{content}</tr>

	tablecell = (
		content: ReactNode,
		flags: { header: boolean; align: "center" | "left" | "right" | null }
	) => {
		const Tag = flags.header ? "th" : "td"
		return <Tag align={flags.align || undefined}>{content}</Tag>
	}

	strong = (text: ReactNode) => <strong>{text}</strong>
	em = (text: ReactNode) => <em>{text}</em>
	codespan = (text: string) => <code>{text}</code>
	br = () => <br />
	del = (text: ReactNode) => <del>{text}</del>
	link = (href: string, title: string | null | undefined, text: ReactNode) => {
		return (
			<a
				target="_blank"
				rel="noopener noreferrer"
				href={href}
				title={title || undefined}
			>
				{text}
			</a>
		)
	}
	image = (href: string, title: string | null, text: string) => (
		<img src={href} loading="lazy" title={title || undefined} alt={text} />
	)
	text = (text: string) => (
		<span
			dangerouslySetInnerHTML={{
				__html: text
			}}
		></span>
	)
}
