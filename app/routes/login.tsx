import type { WorkerActionFunction } from "@remix-pwa/sw"
import type { ActionFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { Form } from "@remix-run/react"
import { ButtonFilled, ButtonText } from "~/components/Button"
import Outlined, { TextFieldOutlinedInput } from "~/components/TextField"

import cookie from "cookie"
import { btn } from "~/lib/button"

const ANILIST_CLIENT_ID = 3455

export const action = (async ({ context, params, request }) => {
  const formData = await request.formData()

  const token = formData.get("token")

  if (typeof token !== "string") {
    return {}
  }

  // const cookie = await tokenCookie.serialize(token)

  return redirect("/Hoodboi/animelist/294670397?selected=Watching", {
    headers: {
      "Set-Cookie": cookie.serialize(`anilist-token`, token, {
        sameSite: "lax",
        maxAge: 604800,
        path: "/",
      }),
    },
  })
}) satisfies ActionFunction

 const workerAction = (async ({ request }) => {
  const formData = await request.formData()

  const token = formData.get("token")

  if (typeof token !== "string") {
    return {}
  }

  return redirect("/Hoodboi/animelist/294670397?selected=Watching", {
    headers: {
      "Set-Cookie": cookie.serialize(`anilist-token`, token, {
        sameSite: "lax",
        maxAge: 604800,
        path: "/",
      }),
    },
  })
}) satisfies WorkerActionFunction

export default function Login() {
  return (
    <main>
      <Form action="" method="post" className="grid gap-2">
        <Outlined>
          <TextFieldOutlinedInput
            name="token"
            
            render={<textarea />}
          />
          <Outlined.Label>Token</Outlined.Label>
        </Outlined>

        <footer className="flex justify-end gap-2">
         
            <a
              target="_blank"
              href={`https://anilist.co/api/v2/oauth/authorize?${new URLSearchParams(
                {
                  client_id: String(ANILIST_CLIENT_ID),
                  response_type: "token",
                },
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
        
          <ButtonFilled type="submit">Login</ButtonFilled>
        </footer>
      </Form>
    </main>
  )
}
