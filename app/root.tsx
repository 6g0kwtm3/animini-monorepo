import { useSWEffect } from "@remix-pwa/sw"
import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import { Provider } from "urql"
import { urql } from "./lib/urql"

import { SnackbarQueue } from "./components/Snackbar"

import tailwind from "./tailwind.css"

export const links: LinksFunction = () => [
  { href: tailwind, rel: "stylesheet" },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export default function App() {
  useSWEffect()

  return (
    <html lang="en" className="bg-surface text-on-surface">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body>
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
