import type { MetaFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { unstable_defineClientAction, useFetcher } from "@remix-run/react"
import {
	TextFieldOutlined as Outlined,
	TextFieldOutlinedInput,
} from "~/components/TextField"

import * as Ariakit from "@ariakit/react"

import { Effect, pipe } from "effect"
import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { ButtonIcon as ButtonTextIcon } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { Remix } from "~/lib/Remix"
import { button } from "~/lib/button"

import type { routeNavLoginQuery as NavLoginQuery } from "~/gql/routeNavLoginQuery.graphql"
import environment, { commitLocalUpdate } from "~/lib/Network"
import { route_user_list } from "~/lib/route"
import { EffectUrql } from "~/lib/urql"

const { graphql } = ReactRelay

export const meta = (() => {
	return [{ title: "Login" }]
}) satisfies MetaFunction

const ANILIST_CLIENT_ID = 3455

export const clientAction = unstable_defineClientAction(async (args) => {
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

			const data = yield* client.query<NavLoginQuery>(
				graphql`
					query routeNavLoginQuery {
						Viewer {
							id
							name
						}
					}
				`,
				{},
				{
					fetchPolicy: "network-only",
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

			commitLocalUpdate(environment, (store) => {
				store.invalidateStore()
			})

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
})

export default function Login(): ReactNode {
	const fetcher = useFetcher<typeof clientAction>()
	const store = Ariakit.useFormStore({ defaultValues: { token: "" } })

	store.onSubmit((state) => {
		fetcher.submit(state.values, {
			method: "post",
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
							autoComplete="current-password"
						/>
						<Outlined.Label name={store.names.token}>Token</Outlined.Label>
					</Outlined>

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
