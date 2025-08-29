import { numberToString } from "./numberToString"

type Hash = `#${string}`

interface Path {
	hash: Hash
	pathname: Pathname
	search: SearchParams
}
type Pathname =
	| `/`
	| `/login`
	| `/media/${string}/edit`
	| `/media/${string}`
	| `/user/${string}/${"animelist" | "mangalist"}/${string}`
	| `/user/${string}/${"animelist" | "mangalist"}`
	| `/user/${string}`

type Route = `${"" | Pathname}${"" | SearchParams}${"" | Hash}`

type SearchParams = `?${string}`

export function route_login({
	redirect,
}: {
	redirect: string
}): `/login?${string}` {
	const query = new URLSearchParams({ redirect })
	return `/login?${query}` satisfies Route
}

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
	typelist: "animelist" | "mangalist"
	userName: string
}): `/user/${string}/animelist` | `/user/${string}/mangalist` {
	return `${route_user(params)}/${params.typelist}` satisfies Route
}

function route_user_list_selected(params: {
	selected: string
	typelist: "animelist" | "mangalist"
	userName: string
}):
	| `/user/${string}/animelist/${string}`
	| `/user/${string}/mangalist/${string}` {
	return `${route_user_list(params)}/${params.selected}` satisfies Route
}
