import { isbot } from 'isbot'
import ReactDOMServer from 'react-dom/server'
const { renderToReadableStream } = ReactDOMServer
import type { EntryContext } from 'react-router'
import { ServerRouter } from 'react-router'

export default async function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	routerContext: EntryContext
) {
	const body = await renderToReadableStream(
		<ServerRouter context={routerContext} url={request.url} />,
		{
			signal: request.signal,
			onError(error: unknown) {
				// Log streaming rendering errors from inside the shell
				console.error(error)
				responseStatusCode = 500
			},
		}
	)

	const userAgent = request.headers.get('user-agent')
	if (userAgent && isbot(userAgent)) {
		await body.allReady
	}

	responseHeaders.set('Content-Type', 'text/html')
	return new Response(body, {
		headers: responseHeaders,
		status: responseStatusCode,
	})
}
