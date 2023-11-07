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

import "./tailwind.css"

export default function App() {
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
        <Provider value={urql}>
          <SnackbarQueue>
            <Outlet />
          </SnackbarQueue>
        </Provider>
        <ScrollRestoration />
        <LiveReload />
        <Scripts />
      </body>
    </html>
  )
}
