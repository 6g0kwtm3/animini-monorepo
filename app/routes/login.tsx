import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import { ButtonText } from "~/components/Button"
import {
	TextFieldOutlined as Outlined,
	TextFieldOutlinedInput
} from "~/components/TextField"

import * as Ariakit from "@ariakit/react"
import cookie from "cookie"
import { button as btn, button } from "~/lib/button"

const ANILIST_CLIENT_ID = 3455

export const action = (async ({ context, params, request }) => {
	const formData = await request.formData()

	const token = formData.get("token")

	if (typeof token !== "string") {
		return {}
	}

	const url = new URL(request.url)

	return redirect(url.searchParams.get("redirect") ?? "/Hoodboi/animelist/", {
		headers: {
			"Set-Cookie": cookie.serialize(`anilist-token`, token, {
				sameSite: "lax",
				maxAge: 8 * 7 * 24 * 60 * 60, // 8 weeks
				path: "/"
			})
		}
	})
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
		console.log(state)
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
						<ButtonText.Icon>
							<img
								loading="lazy"
								src="https://anilist.co/img/icons/icon.svg"
								alt=""
							/>
						</ButtonText.Icon>
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
