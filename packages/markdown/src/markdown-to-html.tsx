import marked from "marked"

export function markdownToHtml(
	markdown: string,
	sanitizeHtml: (html: string) => string
): string {
	void marked.setOptions({
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
	u.rules.heading = /^ \*(#{1,6}) \*([^\n]+?) \*#\* \*(?:\n+|$)/

	const parseSpoilers = (
		source: string,
		start = 0,
		nested = false
	): {
		text: string
		index: number
		closed: boolean
		spoilers: {
			token: string
			label: string
			content: string
			inline: boolean
			spoilers: any[]
		}[]
	} => {
		let text = "",
			i = start
		const spoilers: any[] = []

		while (i < source.length) {
			if (source.slice(i, i + 2) === "!~" && nested) {
				return { text, index: i + 2, closed: true, spoilers }
			}

			if (source.slice(i, i + 2) === "~!") {
				const opening = i
				let label = "",
					contentStart = i + 2

				const labelMatch = source.slice(contentStart).match(/^\{([^{}<>\n]+)\}/)

				if (labelMatch) {
					label = labelMatch[1]
					contentStart += labelMatch[0].length
				}

				const inner = parseSpoilers(source, contentStart, true)

				if (inner.closed) {
					const token = `SPOILER${Math.random().toString(36).slice(2, 8)}${spoilers.length}END`

					spoilers.push({
						token,
						label,
						content: inner.text,
						inline: !source.slice(opening, inner.index).includes("\n"),
						spoilers: inner.spoilers,
					})

					text += token
					i = inner.index
					continue
				}
			}

			text += source[i]
			i++
		}

		return { text, index: i, closed: false, spoilers }
	}

	const replaceSpoilerDivs = (html: string): string => {
		const opening = '<div rel="spoiler">'
		const start = html.indexOf(opening)

		if (start === -1) return html

		let depth = 0,
			end = -1
		const tags = /<\/?div\b[^>]*>/gi
		tags.lastIndex = start

		let match: RegExpExecArray | null

		while ((match = tags.exec(html))) {
			if (/^<div\b/i.test(match[0])) depth++
			else depth--

			if (depth === 0) {
				end = tags.lastIndex
				break
			}
		}

		if (end === -1) return html

		const inner = html.slice(start + opening.length, end - 6)
		const summary = inner.match(/^<summary>([\s\S]*?)<\/summary>/)
		const label = summary ? summary[1] : "Show spoiler"
		const content = summary ? inner.slice(summary[0].length) : inner

		return replaceSpoilerDivs(
			html.slice(0, start)
				+ `<details><summary>${label}</summary>${replaceSpoilerDivs(content)}</details>`
				+ html.slice(end)
		)
	}

	const renderSpoilers = (source: string, spoilers: any[] = []): string => {
		const parsed = spoilers.length
			? { text: source, spoilers }
			: parseSpoilers(source)

		let html = sanitizeHtml(
			// @ts-expect-error marked error types are not correct
			marked(parsed.text, { renderer: d, lexer: u })
		)

		for (const spoiler of parsed.spoilers) {
			const content = renderSpoilers(spoiler.content, spoiler.spoilers)
			const label = spoiler.label || "Show spoiler"
			const replacement = `<div rel="spoiler"><summary>${label}</summary>${content}</div>`

			html = html.replace(
				new RegExp(`<p>\\s*${spoiler.token}\\s*</p>`, "g"),
				replacement
			)
			html = html.replaceAll(spoiler.token, replacement)
		}

		return html
	}

	return (
		(markdown = markdown.replace(
			/(http)(:([/|.|\w|\s|-])*\.(?:jpg|.jpeg|gif|png|mp4|webm))/gi,
			"$1s$2"
		)),
		(markdown = markdown.replaceAll(
			/(^|>| )@([A-Za-z0-9]+)/gm,
			(group, one: string, userName: string) => {
				return `${one}<a class='user-link' data-user-name='${userName}' href='${route_user({ userName: userName })}'>@${userName}</a>`
			}
		)),
		(markdown = markdown.replace(
			/img\s?(\d+%?)?\s?\((.[\S]+)\)/gi,
			"<img width='$1' src='$2'>"
		)),
		(markdown = markdown.replace(
			/youtube\s?\([^]*?([-_0-9A-Za-z]{10,15})[^]*?\)/gi,
			"youtube ($1)"
		)),
		(markdown = markdown.replace(
			/webm\s?\(h?([A-Za-z0-9-._~:/?#[\]@!$&()*+,;=%]+)\)/gi,
			"webmv(`$1`)"
		)),
		(markdown = markdown.replace(/~{3}([^]*?)~{3}/gm, "+++$1+++")),
		(markdown = renderSpoilers(markdown)),
		(markdown = markdown.replace(/\+{3}([^]*?)\+{3}/gm, "<center>$1</center>")),
		(markdown = replaceSpoilerDivs(markdown)),
		(markdown = markdown.replace(
			/youtube\s?\(([-_0-9A-Za-z]{10,15})\)/gi,
			"<iframe width='450' height='315' src='https://www.youtube.com/embed/$1/' title='YouTube video player' frameBorder='0' name='1' class='rounded-md' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;' allowfullscreen loading='lazy'>Your browser does not support iframes</iframe>"
		)),
		(markdown = markdown.replace(
			/webmv\s?\(<code>([A-Za-z0-9-._~:/?#[\]@!$&()*+,;=%]+)<\/code>\)/gi,
			"<video muted loop controls><source src='h$1' type='video/webm'>Your browser does not support the video tag.</video>"
		)),
		(markdown = markdown.replace(
			/(?:<a href="https?:\/\/anilist.co\/(anime|manga)\/)([0-9]+)(\/\w+)?.*>(?:https?:\/\/anilist.co\/(?:anime|manga)\/[0-9]+).*<\/a>/gm,
			(group, type: string, mediaId: string, slug: string) => {
				return `<a class="media-link" href="${route_media({ id: Number(mediaId) })}" data-type="${type}" data-slug="${slug}" data-id="${mediaId}">${route_media({ id: Number(mediaId) })}${slug}</a>`
			}
		)),
		markdown
	)
}

function numberToString(n: number) {
	return String(n)
}

function route_media(props: { id: number }) {
	return `/media/${numberToString(props.id)}`
}

function route_user(props: { userName: string }) {
	return `/user/${props.userName}`
}
