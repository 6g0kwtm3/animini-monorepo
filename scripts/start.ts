import { serveStatic } from "hono/bun"

import { Hono } from "hono"
const app = new Hono()

app.use("*", serveStatic({ root: "./build/client" }))

const server = Bun.serve({
	port: 3000,
	fetch: app.fetch,
})

console.log(`Listening on ${server.url}`)
