import type { MetaFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form, unstable_defineClientAction, useFetcher } from "@remix-run/react"
import {
	TextFieldOutlined as Outlined,
	TextFieldOutlinedInput,
} from "~/components/TextField"

import cookie from "cookie"

import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { ButtonIcon as ButtonTextIcon } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { button } from "~/lib/button"

import type { routeNavLoginQuery as NavLoginQuery } from "~/gql/routeNavLoginQuery.graphql"
import { client_get_client } from "~/lib/client"
import { route_user_list } from "~/lib/route"
import { type Token } from "~/lib/viewer"
const { graphql } = ReactRelay

export const meta = (() => {
	return [{ title: "Login" }]
}) satisfies MetaFunction

const ANILIST_CLIENT_ID = 3455

export const clientAction = unstable_defineClientAction(async (args) => {
	const formData = await args.request.formData()
	const { searchParams } = new URL(args.request.url)

	const token = formData.get("token")

	if (typeof token !== "string") {
		return {}
	}

	const client = await client_get_client()

	const data = await client.query<NavLoginQuery>(
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

	const encoded = JSON.stringify({
		token: token,
		viewer: data.Viewer,
	} satisfies typeof Token.infer)

	const setCookie = cookie.serialize(`anilist-token`, encoded, {
		sameSite: "lax",
		maxAge: 8 * 7 * 24 * 60 * 60, // 8 weeks
		path: "/",
	})

	document.cookie = setCookie

	return redirect(
		searchParams.get("redirect") ??
			route_user_list({
				typelist: "animelist",
				userName: data.Viewer.name,
			}),
		{
			headers: {
				"Set-Cookie": setCookie,
			},
		}
	)
})

export default function Login(): ReactNode {
	const fetcher = useFetcher<typeof clientAction>()

	return (
		<LayoutBody>
			<LayoutPane>
				<Form method="post" className="grid gap-2">
					<Outlined>
						<TextFieldOutlinedInput
							name="token"
							required
							type="password"
							autoComplete="current-password"
						/>
						<Outlined.Label htmlFor="token">Token</Outlined.Label>
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

						<button type="submit" className={button({ variant: "filled" })}>
							Login
						</button>
					</footer>
				</Form>
			</LayoutPane>
		</LayoutBody>
	)
}
