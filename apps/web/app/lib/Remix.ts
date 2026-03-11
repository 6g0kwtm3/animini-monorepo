import { ArkErrors } from "arktype"
import * as cookie from "cookie"
import { JsonToToken } from "./viewer"

export function Viewer(): null | {
	readonly id: number
	readonly name: string
} {
	const cookies = cookie.parse(document.cookie)

	const token = cookies["anilist-token"]
	if (!token) return null

	const result = JsonToToken(token)
	return result instanceof ArkErrors ? null : (result?.viewer ?? null)
}
