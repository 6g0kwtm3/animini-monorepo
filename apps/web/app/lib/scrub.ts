import { matchPath, generatePath } from "react-router"
export function scrubPathname(pathname: string): string {
	const matchTypelist = matchPath(
		{ path: `/:locale?/user/:userName/:typelist/:selected?`, end: false },
		pathname
	)

	if (matchTypelist != null) {
		return generatePath(matchTypelist.pattern.path, {
			...matchTypelist.params,
			userName: `:Filtered:`,
			selected:
				matchTypelist.params.selected !== undefined ? `:Filtered:` : undefined,
		})
	}

	const matchUserName = matchPath(
		{ path: `/:locale?/user/:userName`, end: false },
		pathname
	)

	if (matchUserName != null) {
		return generatePath(matchUserName.pattern.path, {
			...matchUserName.params,
			userName: `:Filtered:`,
		})
	}

	return pathname
}
