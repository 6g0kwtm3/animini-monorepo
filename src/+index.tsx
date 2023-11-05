import { PropsWithChildren } from "react"

import "./tailwind.css"
// import tailwindcss from './tailwind.css?url'

export default function Index({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-surface text-on-surface">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        {/* <link rel="stylesheet"  href={tailwindcss} /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
