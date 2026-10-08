import { matchPath, generatePath } from "react-router"
export function scrubPathname(pathname: string): string {
	const matchTypelist = matchPath(
		{ path: `/:locale?/user/:userName/:typelist/:selected?`, end: false },
		pathname
	)

	if (matchTypelist != null) {
		return generatePath(matchTypelist.pattern.path, {
			...matchTypelist.params,
			locale:
				matchTypelist.params.locale !== undefined ? `:Filtered:` : undefined,
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
			locale:
				matchUserName.params.locale !== undefined ? `:Filtered:` : undefined,
		})
	}

	const matchLocale = matchPath({ path: `/:locale?`, end: false }, pathname)

	if (matchLocale != null) {
		pathname = generatePath(matchLocale.pattern.path, {
			...matchLocale.params,
			locale:
				matchLocale.params.locale !== undefined ? `:Filtered:` : undefined,
		})
	}
	return pathname
}
