import { matchPath, generatePath } from "react-router"
export function scrubPathname(pathname: string): string {
	const matchUserName = matchPath(
		{ path: `/:locale?/user/:userName/:typelist/:selected?`, end: false },
		pathname
	)

	if (matchUserName != null) {
		pathname = generatePath(matchUserName.pattern.path, {
			...matchUserName.params,
			userName: `[Filtered]`,
		})
	}

	const matchLocale = matchPath({ path: `/:locale?`, end: false }, pathname)

	if (matchLocale != null) {
		pathname = generatePath(matchLocale.pattern.path, {
			...matchLocale.params,
			locale: `[Filtered]`,
		})
	}
	return pathname
}
