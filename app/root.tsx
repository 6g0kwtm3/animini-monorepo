import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { Provider } from "urql"
import { ssr, urql } from "./lib/urql"

import { SnackbarQueue } from "./components/Snackbar"

import type { LoaderFunction } from "@remix-run/node"
import { IS_SERVER } from "./lib/isClient"
import "./tailwind.css"

export const loader = (async () => {
  return null
}) satisfies LoaderFunction

export default function App() {
  const data = IS_SERVER ? ssr.extractData() : window.__URQL_DATA__

  return (
    <html lang="en" className="bg-surface text-on-surface">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,-25..0"
        />

        <Meta />
        <Links />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__URQL_DATA__ = (${JSON.stringify(data)});`,
          }}
        ></script>
        <Provider value={urql}>
          <SnackbarQueue>
            <Outlet />
          </SnackbarQueue>
        </Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
