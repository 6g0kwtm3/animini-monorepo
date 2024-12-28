export interface Path {
	pathname: Pathname
	hash: Hash
	search: SearchParams
}

type SearchParams = `?${string}`
type Hash = `#${string}`

type Typelist = string;

type Pathname =
	| `/`
	| `/media/${string}/`
	| `/media/${string}/edit/`
	| `/user/${string}/`
	| `/user/${string}/${Typelist}/`
	| `/user/${string}/${Typelist}/${string}/`
	| `/login/`

export type Route = `${Pathname | ""}${SearchParams | ""}${Hash | ""}`

export function route_media({ id }: { id: number }): `/media/${number}/` {
	return `/media/${id}/` satisfies Route
}

export function route_media_edit(params: {
	id: number
}): `/media/${number}/edit/` {
	return `${route_media(params)}edit/` satisfies Route
}

export function route_user({
	userName,
}: {
	userName: string
}): `/user/${string}/` {
	return `/user/${userName}/` satisfies Route
}

export function route_user_list(params: {
	userName: string
	typelist: Typelist
}): `/user/${string}/${Typelist}/` {
	return `${route_user(params)}${params.typelist}/` satisfies Route
}

export function route_user_list_selected(params: {
	userName: string
	typelist: Typelist
	selected: string
}):
	| `/user/${string}/${Typelist}/${string}/`
  {
	return `${route_user_list(params)}${params.selected}/` satisfies Route
}

export function route_login({
	redirect,
}: {
	redirect: string
}): `/login/?${string}` {
	return `/login/?${new URLSearchParams({ redirect })}` satisfies Route
}

export * as Routes from "./route"

