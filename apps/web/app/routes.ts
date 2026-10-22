import {
	index,
	layout,
	prefix,
	route,
	type RouteConfig,
} from "@react-router/dev/routes"

export default prefix(":locale?", [
	layout("./routes/Nav/route.tsx", [
		index("./routes/Home/route.tsx"),
		route("login", "./routes/Login/route.tsx"),
		route("media/:mediaId", "./routes/Media/route.tsx", [
			route("edit", "./routes/MediaEdit/route.tsx"),
		]),
		route("notifications", "./routes/Notifications/route.tsx"),
		route("search", "./routes/Search/route.tsx"),
		route("user/:userName", "./routes/User/route.tsx", [
			index("./routes/UserOverview/route.tsx"),
			route(":typelist", "./routes/UserList/route.tsx", [
				route(":selected?", "./routes/UserListSelected/route.tsx"),
			]),
		]),
		route("*", "./routes/404/route.tsx"),
	]),
	route("logout", "./routes/logout/route.tsx"),
	route("follow/:userId", "./routes/UserFollow/route.tsx"),
]) satisfies RouteConfig
