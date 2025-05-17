import marked from "marked"

export function markdownToHtml(
	markdown: string,
	sanitizeHtml: (html: string) => string
) {
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
		(markdown = markdown.replace(
			/~!([^]*?)!~/gm,
			'<div rel="spoiler">$1</div>'
		)),
		(markdown = sanitizeHtml(
			// @ts-expect-error marked error types are not correct
			marked(markdown, { renderer: d, lexer: u })
		)),
		(markdown = markdown.replace(/\+{3}([^]*?)\+{3}/gm, "<center>$1</center>")),
		(markdown = markdown.replace(
			/<div rel="spoiler">([\s\S]*?)<\/div>/gm,
			"<details><summary>Show spoiler</summary>$1</details>"
		)),
		(markdown = markdown.replace(
			/youtube\s?\(([-_0-9A-Za-z]{10,15})\)/gi,
			"<iframe width='450' height='315' src='https://www.youtube.com/embed/$1/' title='YouTube video player' frameBorder='0' name='1' class='rounded-md' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;' allowfullscreen loading='lazy'>Your browser does not support iframes</iframe>"
		)),
		(markdown = markdown.replace(
			/webmv\s?\(<code>([A-Za-z0-9-._~:/?#[\]@!$&()*+,;=%]+)<\/code>\)/gi,
			"<video muted loop controls><source src='h$1' type='video/webm'>Your browser does not support the video tag.</video>"
		)),
		(markdown = markdown.replace(
			/(?:<a href="https?:\/\/anilist.co\/(anime|manga)\/)([0-9]+)(\/\w+)?.*?>(?:https?:\/\/anilist.co\/(?:anime|manga)\/[0-9]+).*?<\/a>/gm,
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
