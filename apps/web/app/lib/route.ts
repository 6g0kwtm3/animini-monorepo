import { numberToString } from "./numberToString"

interface Path {
	pathname: Pathname
	hash: Hash
	search: SearchParams
}

type SearchParams = `?${string}`
type Hash = `#${string}`

type Pathname =
	| `/`
	| `/media/${string}`
	| `/media/${string}/edit`
	| `/user/${string}`
	| `/user/${string}/${"animelist" | "mangalist"}`
	| `/user/${string}/${"animelist" | "mangalist"}/${string}`
	| `/login`

type Route = `${Pathname | ""}${SearchParams | ""}${Hash | ""}`

export function route_media({ id }: { id: number }): `/media/${string}` {
	return `/media/${numberToString(id)}` satisfies Route
}

export function route_media_edit(params: {
	id: number
}): `/media/${string}/edit` {
	return `${route_media(params)}/edit` satisfies Route
}

export function route_user({
	userName,
}: {
	userName: string
}): `/user/${string}` {
	return `/user/${userName}` satisfies Route
}

export function route_user_list(params: {
	userName: string
	typelist: "animelist" | "mangalist"
}): `/user/${string}/animelist` | `/user/${string}/mangalist` {
	return `${route_user(params)}/${params.typelist}` satisfies Route
}

function route_user_list_selected(params: {
	userName: string
	typelist: "animelist" | "mangalist"
	selected: string
}):
	| `/user/${string}/animelist/${string}`
	| `/user/${string}/mangalist/${string}` {
	return `${route_user_list(params)}/${params.selected}` satisfies Route
}

export function route_login({
	redirect,
}: {
	redirect: string
}): `/login?${string}` {
	const query = new URLSearchParams({ redirect })
	return `/login?${query}` satisfies Route
}
