import type { LoaderFunction } from "@remix-run/cloudflare"
import { Await, Link, defer, useLoaderData } from "@remix-run/react"
import { Effect, Predicate, ReadonlyRecord, pipe } from "effect"
import markdownit from "markdown-it"
import type { Token } from "marked"
import { Marked } from "marked"
import { Suspense, isValidElement, type ReactNode } from "react"

import { Card } from "~/components/Card"
import { LayoutPane } from "~/components/Layout"
import List from "~/components/List"
import { graphql } from "~/gql"
import { JsxMonoid, JsxRenderer, _Parser } from "~/lib/Parser"
import { Remix } from "~/lib/Remix/index.server"
import { route_media, route_user } from "~/lib/route"
import { getThemeFromHex } from "~/lib/theme"
import { ThemeProvider } from "~/lib/theme/Theme"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"

function MediaLink({ mediaId, ...props }) {
	const data = useLoaderData<typeof loader>()

	return (
		<Link to={route_media({ id: mediaId })} {...props}>
			<Suspense fallback="Loading...">
				<Await errorElement={props.children} resolve={data.Media}>
					{(data) => {
						const media = data[mediaId]
						return (
							media && (
								<ThemeProvider theme={getThemeFromHex(media.coverImage?.color)}>
									<Card className="not-prose inline-flex overflow-hidden text-start force:p-0">
										<List className="force:p-0">
											<List.Item className="">
												{media.coverImage?.extraLarge ? (
													<div className="col-start-1 flex h-10 w-10">
														<img
															src={media.coverImage.extraLarge}
															alt=""
															className="h-10 w-10 rounded-full bg-[image:--bg] bg-cover object-cover"
															style={{
																"--bg": `url(${media.coverImage.medium})`
															}}
															loading="lazy"
														/>
													</div>
												) : (
													<div className="col-start-1 flex h-10 w-10 items-center justify-center rounded-full bg-error">
														<div className="i text-on-error">error</div>
													</div>
												)}
												<div className="col-start-2 grid grid-cols-subgrid">
													<List.Item.Title>
														{media.title?.userPreferred}
													</List.Item.Title>
													<List.Item.Subtitle>{media.type}</List.Item.Subtitle>
												</div>
											</List.Item>
										</List>
									</Card>
								</ThemeProvider>
							)
						)
					}}
				</Await>
			</Suspense>
		</Link>
	)
}

function getText(node: ReactNode): string {
	if (Array.isArray(node)) {
		return node.map(getText).join("")
	}
	if (node === null || node === false || node === undefined) {
		return ""
	}
	if (isValidElement<any>(node)) {
		return getText(
			node.props?.children ?? node.props?.dangerouslySetInnerHTML?.__html
		)
	}

	if (typeof node === "string" || typeof node === "number" || node === true) {
		return String(node)
	}

	if (Predicate.isIterable(node)) {
		return getText([...node])
	}

	node satisfies never

	return ""
}

class MyJsxRenderer extends JsxRenderer {
	link = (href: string, title: string | null | undefined, text: ReactNode) => {
		if (getText(text) === href) {
			return matchMediaId(href).map((mediaId, i) => {
				return (
					<MediaLink key={i} mediaId={mediaId} title={title || undefined}>
						{text}
					</MediaLink>
				)
			})
		}

		if (href.match(/https:\/\/anilist.co\/(anime|manga)\/(\d+)/))
			return matchMediaId(href).map((mediaId, i) => {
				return (
					<Link
						key={i}
						to={route_media({ id: mediaId })}
						title={title || undefined}
					>
						{text}
					</Link>
				)
			})

		return new JsxRenderer().link(href, title, text)
	}
}

const instance = new Marked().use({
	// gfm: true,
	// pedantic: false,
	// breaks: true,
	renderer: new MyJsxRenderer(),
	monoid: JsxMonoid,
	silent: true,
	tokenizer: {
		heading(src) {
			const match = src.match(/^(#+)([^\n]*)/)
			if (match) {
				const tokens: Token[] = []
				const token = {
					type: "heading",
					raw: match[0],
					text: match[2]?.trim() ?? "",
					depth: match[1]?.length,
					tokens
				}
				this.lexer.inline(token.text, token.tokens)
				return token
			}

			return false
		}
	},
	extensions: [
		{
			name: "youtube",
			start(src) {
				return src.match(/youtube\(/i)?.index
			},
			level: "inline",
			tokenizer(src, tokens) {
				const match = src.match(/^youtube\(([^)]*)\)/i)

				if (match) {
					try {
						const src = new URL(match[1])

						return {
							type: "youtube",
							raw: match[0],
							src: `https://www.youtube.com/embed/${src.searchParams.get("v") ?? src.pathname.split("/").at(-1)}/?${src.searchParams}`
						}
					} catch {}
				}
			},
			renderer(token) {
				return (
					<iframe
						width="560"
						height="315"
						src={token.src}
						title="YouTube video player"
						frameBorder="0"
						name="1"
						className="rounded-md"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
						dangerouslySetInnerHTML={{
							__html: "Your browser doesn't support iframes"
						}}
						loading="lazy"
					></iframe>
				)
			}
		},
		{
			name: "webm",
			start(src) {
				return src.match(/webm\(/i)?.index
			},
			level: "inline",
			tokenizer(src, tokens) {
				const match = src.match(/^webm\(([^)]*)\)/i)
				if (match) {
					return {
						type: "webm",
						raw: match[0],
						src: match[1]
					}
				}
			},
			renderer(token) {
				return (
					<video
						controls
						src={token.src}
						dangerouslySetInnerHTML={{
							__html: "Your browser doesn't support the video tag."
						}}
					></video>
				)
			}
		},
		{
			name: "image",
			start(src) {
				return src.match(/img([\d]*%?)\(/i)?.index
			},
			level: "inline",
			tokenizer(src, tokens) {
				const match = src.match(/^img([\d]*%?)\(([^)]*)\)/i)
				if (match) {
					return {
						type: "image",
						raw: match[0],
						width: match[1],
						src: match[2]?.trim()
					}
				}
			},
			renderer(token) {
				return <img src={token.src} width={token.width} loading="lazy" alt="" />
			}
		},
		{
			name: "centerinline",
			start(src) {
				return src.match(/~~~[^\n]*?~~~/)?.index
			},
			level: "inline",
			tokenizer(src, tokens) {
				const match = src.match(/^~~~([\s\S]*?)~~~/)
				if (match) {
					const tokens: Token[] = []
					const token = {
						type: "centerinline",
						raw: match[0],
						text: match[1]?.trim() ?? "",
						tokens
					}
					this.lexer.inline(token.text, token.tokens)
					return token
				}
			},
			renderer(token) {
				return <center>{this.parser.parseInline(token.tokens!)}</center>
			}
		},
		{
			name: "user",
			start(src) {
				return src.match(/@\S*/)?.index
			},
			level: "inline",
			tokenizer(src, tokens) {
				const match = src.match(/^@(\S*)/)
				if (match) {
					const token = {
						type: "user",
						raw: match[0],
						name: match[1]
					}

					return token
				}
			},
			renderer(token) {
				return (
					<Link to={route_user({ userName: token.name })}>@{token.name}</Link>
				)
			}
		},
		{
			name: "center",
			start(src) {
				return src.match(/~~~/)?.index
			},
			level: "block",
			tokenizer(src, tokens) {
				const match = src.match(/^~~~([\s\S]*?)~~~/)
				if (match) {
					const tokens: Token[] = []
					const token = {
						type: "center",
						raw: match[0],
						text: match[1]?.trim() ?? "",
						tokens
					}
					this.lexer.blockTokens(token.text, token.tokens)
					return token
				}
			},
			renderer(token) {
				return <center>{this.parser.parse(token.tokens!)}</center>
			}
		},
		{
			name: "spoiler",
			start(src) {
				return src.match(/~!/)?.index
			},
			level: "block",
			tokenizer(src, tokens) {
				const match = src.match(/^~!([\s\S]*?)!~/)
				if (match) {
					const tokens: Token[] = []
					const token = {
						type: "spoiler",
						raw: match[0],
						text: match[1]?.trim() ?? "",
						tokens
					}
					this.lexer.blockTokens(token.text, token.tokens)
					return token
				}
			},
			renderer(token) {
				return (
					<details>
						<summary>Show spoiler</summary>
						{this.parser.parse(token.tokens!)}
					</details>
				)
			}
		}
	]
})

function matchMediaId(s: string) {
	return [...s.matchAll(/https:\/\/anilist.co\/(anime|manga)\/(\d+)/g)]
		.map((group) => Number(group[2]))
		.filter(isFinite)
}

export const loader = (async (args) => {
	const Page = await pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)

			const data = yield* _(
				client.query(
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
					{}
				)
			)

			return data?.Page
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)

	return defer({
		Page: Page,
		Media: pipe(
			Effect.gen(function* (_) {
				const client = yield* _(EffectUrql)

				const id_in = Page?.activities?.flatMap((activity) => {
					if (activity?.__typename === "TextActivity") {
						return activity.text ? matchMediaId(activity.text) : []
					}
					return []
				})

				const data = yield* _(
					client.query(
						graphql(`
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
						`),
						{ id_in }
					)
				)

				return ReadonlyRecord.fromEntries(
					data?.Page?.media
						?.filter(Predicate.isNotNull)
						.map((media) => [String(media.id), media] as const) ?? []
				)
			}),
			Effect.provide(LoaderLive),
			Effect.provideService(LoaderArgs, args),
			Remix.runLoader
		)
	})
}) satisfies LoaderFunction

const md = markdownit({
	html: true,
	breaks: true,
	linkify: true,
	typographer: true
})

// md.use(()=>{

// })

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
											{activity.text && (
												<div className="prose max-w-full overflow-x-auto md:prose-lg lg:prose-xl dark:prose-invert prose-img:rounded-md prose-video:rounded-md">
													{_Parser.parse(
														instance.lexer(activity.text),
														instance.defaults
													)}
													{/* <pre>{activity.text}</pre> */}
												</div>
											)}
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
