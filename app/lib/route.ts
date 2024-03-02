export const route_media = ({ id }: { id: number }) => {
	return `/media/${id}/`
}

export const route_media_edit = (params: { id: number }) => {
	return `${route_media(params)}edit/`
}

export const route_user = ({ userName }: { userName: string }) => {
	return `/user/${userName}/`
}

export const route_user_list = (params: {
	userName: string
	typelist: "animelist" | "mangalist"
}) => {
	return `${route_user(params)}${params.typelist}/`
}

export const route_user_list_selected = (params: {
	userName: string
	typelist: "animelist" | "mangalist"
	selected: string
}) => {
	return `${route_user_list(params)}${params.selected}/`
}

export const route_login = ({ redirect }: { redirect: string }) => {
	return `/login/?${new URLSearchParams({ redirect })}`
}
