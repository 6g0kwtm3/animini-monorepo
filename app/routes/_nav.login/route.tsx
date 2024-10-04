import {
	Form,
	type ClientActionFunction,
	type ClientLoaderFunction,
	redirect,
	type MetaFunction,
} from "react-router"

import { Effect, pipe } from "effect"
import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { Button, ButtonIcon as ButtonTextIcon } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { Remix } from "~/lib/Remix"
import { button } from "~/lib/button"

import type { routeNavLoginQuery as NavLoginQuery } from "~/gql/routeNavLoginQuery.graphql"
import { commitLocalUpdate } from "~/lib/Network"
import { M3 } from "~/lib/components"
import { route_user_list } from "~/lib/route"
import { EffectUrql } from "~/lib/urql"

const { graphql } = ReactRelay

export const meta = (() => {
	return [{ title: "Login" }]
}) satisfies MetaFunction

const ANILIST_CLIENT_ID = 3455

export const clientAction = (async (args) => {
	return pipe(
		Effect.gen(function* () {
			const formData = yield* Effect.promise(async () =>
				args.request.formData()
			)
			const { searchParams } = new URL(args.request.url)

			const token = formData.get("token")

			if (typeof token !== "string") {
				return {}
			}

			const client = yield* EffectUrql

			commitLocalUpdate((store) => {
				store.invalidateStore()
			})

			const data = yield* client.query<NavLoginQuery>(
				graphql`
					query routeNavLoginQuery @raw_response_type {
						Viewer {
							id
							name
						}
					}
				`,
				{},
				{
					networkCacheConfig: {
						metadata: {
							headers: new Headers({ Authorization: `Bearer ${token.trim()}` }),
						},
					},
				}
			)

			if (!data?.Viewer) {
				return {}
			}

			sessionStorage.setItem("anilist-token", token.trim())

			return redirect(
				searchParams.get("redirect") ??
					route_user_list({
						typelist: "animelist",
						userName: data.Viewer.name,
					})
			)
		}),
		Effect.provide(EffectUrql.Live),
		Remix.runLoader
	)
}) satisfies ClientActionFunction

export const clientLoader = (() => {
	const token = sessionStorage.getItem("anilist-token")

	if (token) {
		return redirect("/")
	}

	return null
}) satisfies ClientLoaderFunction

export default function Login(): ReactNode {
	return (
		<LayoutBody>
			<LayoutPane>
				<Form method="post" className="grid gap-2">
					<M3.Field>
						<M3.FieldText
							name="token"
							required
							type="password"
							autoComplete="current-password"
							label="Token"
							defaultValue={import.meta.env.VITE_TEST_TOKEN}
						/>
					</M3.Field>

					<footer className="flex justify-end gap-2">
						<a
							target="_blank"
							href={`https://anilist.co/api/v2/oauth/authorize/?${new URLSearchParams(
								{
									client_id: String(ANILIST_CLIENT_ID),
									response_type: "token",
								}
							)}`}
							rel="noreferrer"
							defaultValue={import.meta.env.VITE_TEST_TOKEN}
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

						<Button variant="filled" type="submit">
							Login
						</Button>
					</footer>
				</Form>
			</LayoutPane>
		</LayoutBody>
	)
}
