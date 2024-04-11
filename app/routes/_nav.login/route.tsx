import type { ActionFunction, MetaFunction } from "@remix-run/cloudflare"
import { redirect } from "@remix-run/cloudflare"
import { useFetcher, type ClientActionFunction } from "@remix-run/react"
import {
	TextFieldOutlined as Outlined,
	TextFieldOutlinedInput
} from "~/components/TextField"

import * as Ariakit from "@ariakit/react"
import { Schema } from "@effect/schema"
import cookie from "cookie"
import { Effect, pipe } from "effect"
import type { ReactNode } from "react"
import { ButtonIcon as ButtonTextIcon } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { Remix } from "~/lib/Remix/index.server"
import { button } from "~/lib/button"
import { graphql } from "~/lib/graphql"
import { route_user_list } from "~/lib/route"
import {
	ClientArgs,
	LoaderArgs,
	LoaderLive,
	operation
} from "~/lib/urql.server"
import { JsonToToken } from "~/lib/viewer"
import { client } from "~/lib/cache.client"

export const meta = (() => {
	return [{ title: "Login" }]
}) satisfies MetaFunction

const ANILIST_CLIENT_ID = 3455

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
				searchParams.get("redirect") ??
					route_user_list({
						typelist: "animelist",
						userName: data.Viewer.name
					}),
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

export const clientAction: ClientActionFunction = async ({ serverAction }) => {
	const result = await serverAction<typeof action>()
	await client.invalidateQueries()
	return result
}

export default function Login(): ReactNode {
	const fetcher = useFetcher()
	const store = Ariakit.useFormStore({ defaultValues: { token: "" } })

	store.onSubmit((state) => {
		fetcher.submit(state.values, {
			method: "post"
		})
	})

	return (
		<LayoutBody>
			<LayoutPane>
				<Ariakit.Form store={store} method="post" className="grid gap-2">
					<Outlined>
						<TextFieldOutlinedInput
							name={store.names.token}
							required
							type="password"
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
							className={button({})}
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
			</LayoutPane>
		</LayoutBody>
	)
}
