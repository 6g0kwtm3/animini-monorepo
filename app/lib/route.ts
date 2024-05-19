export const route_media = ({ id }: { id: number }): string => {
	return `/media/${id}/`
}

export const route_media_edit = (params: { id: number }): string => {
	return `${route_media(params)}edit/`
}

export const route_user = ({ userName }: { userName: string }): string => {
	return `/user/${userName}/`
}

export const route_user_list = (params: {
	userName: string
	typelist: "animelist" | "mangalist"
}): string => {
	return `${route_user(params)}${params.typelist}/`
}

export const route_user_list_selected = (params: {
	userName: string
	typelist: "animelist" | "mangalist"
	selected: string
}): string => {
	return `${route_user_list(params)}${params.selected}/`
}

export const route_login = ({ redirect }: { redirect: string }): string => {
	return `/login/?${new URLSearchParams({ redirect })}`
}

export * as Routes from './route'

