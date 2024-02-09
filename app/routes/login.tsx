import type { ActionFunction } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import { useFetcher } from "@remix-run/react"
import {
	TextFieldOutlined as Outlined,
	TextFieldOutlinedInput
} from "~/components/TextField"

import * as Ariakit from "@ariakit/react"
import { Schema } from "@effect/schema"
import cookie from "cookie"
import { Effect, pipe } from "effect"
import { Remix } from "~/lib/Remix/index.server"
import { button as btn, button } from "~/lib/button"
import { graphql } from "~/lib/graphql"
import {
	ClientArgs,
	LoaderArgs,
	LoaderLive,
	operation
} from "~/lib/urql.server"
import { JsonToToken } from "~/lib/viewer"
import { ButtonTextIcon } from "~/components/Button"

const ANILIST_CLIENT_ID = 3455

// import {  request} from "@effect/platform/HttpClient";
// request.jsonBody()

export const action = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const formData = yield* _(Remix.formData)
			const { searchParams } = yield* _(ClientArgs)

			const token = formData.get("token")

			if (typeof token !== "string") {
				return {}
			}

			const data = yield* _(
				operation(
					graphql(`
						query LoginQuery {
							Viewer {
								id
								name
							}
						}
					`),
					{},
					{ headers: new Headers({ Authorization: `Bearer ${token.trim()}` }) }
				)
			)

			if (!data?.Viewer) {
				return {}
			}

			const encoded = yield* _(
				Schema.encodeOption(JsonToToken)({
					token: token,
					viewer: data.Viewer
				})
			)

			return redirect(
				searchParams.get("redirect") ?? `/${data.Viewer.name}/animelist/`,
				{
					headers: {
						"Set-Cookie": cookie.serialize(`anilist-token`, encoded, {
							sameSite: "lax",
							maxAge: 8 * 7 * 24 * 60 * 60, // 8 weeks
							path: "/"
						})
					}
				}
			)
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies ActionFunction

// export const clientAction = (async ({ request }) => {
// 	const formData = await request.formData()

// 	const token = formData.get("token")

// 	if (typeof token !== "string") {
// 		return {}
// 	}

// 	return redirect("/Hoodboi/animelist/?selected=Watching", {
// 		headers: {
// 			"Set-Cookie": cookie.serialize(`anilist-token`, token, {
// 				sameSite: "lax",
// 				maxAge: 604_800,
// 				path: "/",
// 			}),
// 		},
// 	})
// }) satisfies ClientActionFunction

export default function Login() {
	const fetcher = useFetcher()
	const store = Ariakit.useFormStore({ defaultValues: { token: "" } })

	store.onSubmit((state) => {
		fetcher.submit(state.values, {
			method: "post"
		})
	})

	return (
		<main>
			<Ariakit.Form store={store} method="post" className="grid gap-2">
				<Outlined>
					<TextFieldOutlinedInput
						name={store.names.token}
						required
						render={<textarea />}
					/>
					<Outlined.Label name={store.names.token}>Token</Outlined.Label>
				</Outlined>

				<footer className="flex justify-end gap-2">
					<a
						target="_blank"
						href={`https://anilist.co/api/v2/oauth/authorize/?${new URLSearchParams(
							{
								client_id: String(ANILIST_CLIENT_ID),
								response_type: "token"
							}
						)}`}
						rel="noreferrer"
						className={btn({})}
					>
						<ButtonTextIcon>
							<img
								loading="lazy"
								src="https://anilist.co/img/icons/icon.svg"
								alt=""
							/>
						</ButtonTextIcon>
						<span>Get token</span>
					</a>

					<Ariakit.FormSubmit className={button({ variant: "filled" })}>
						Login
					</Ariakit.FormSubmit>
				</footer>
			</Ariakit.Form>
		</main>
	)
}
