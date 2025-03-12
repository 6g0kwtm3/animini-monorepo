import { createCookie } from "react-router"

export const tokenCookie = createCookie("anilist-token", {
	maxAge: 604_800, // one week
})

export async function getToken(request: Request): Promise<string | null> {
	const cookieHeader = request.headers.get("Cookie")

	const token = await tokenCookie.parse(cookieHeader)
	if (typeof token === "string") {
		return token
	}
	return null
}

export async function getHeaders(request: Request): Promise<Headers> {
	const token = await getToken(request)
	const headers = new Headers()
	if (token) {
		headers.append("Authorization", `Bearer ${token}`)
	}
	return headers
}
