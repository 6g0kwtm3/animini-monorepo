
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

import styles from "./tailwind.css?url"

export const links: LinksFunction = () => [
  { href: styles, rel: "stylesheet" },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]

export default function App() {
  

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-surface container mx-auto text-on-surface surface elevation-1">
        <Provider value={urql}>
          <Outlet />
        </Provider>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  )
}
