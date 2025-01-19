import {
	index,
	layout,
	route,
	type RouteConfig,
} from "@react-router/dev/routes"

export default [
	layout("./routes/Nav/route.tsx", [
		index("./routes/Index/route.tsx"),
		route("feed", "./routes/Home/route.tsx"),
		route("login", "./routes/Login/route.tsx"),
		route("media/:mediaId", "./routes/Media/route.tsx", [
			route("edit", "./routes/MediaEdit/route.tsx"),
		]),
		route("notifications", "./routes/Notifications/route.tsx"),
		route("search", "./routes/Search/route.tsx"),
		route("user/:userName", "./routes/User/route.tsx", [
			index("./routes/UserIndex/route.tsx"),
			route(":typelist", "./routes/UserList/route.tsx", [
				route(":selected?", "./routes/UserListSelected/route.tsx"),
			]),
		]),
	]),
	route("logout", "./routes/logout/route.tsx"),
	route("user/:userId/follow", "./routes/UserFollow/route.tsx"),
	route("user/:userId/info", "./routes/UserInfo/route.ts"),
] satisfies RouteConfig
