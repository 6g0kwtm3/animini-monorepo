import { hash32, hex } from "@animedes/hash"
import { matchPath, generatePath } from "react-router"
export function scrubPathname(pathname: string): string {
	const matchTypelist = matchPath(
		{ path: `/:locale?/user/:userName/:typelist/:selected?`, end: false },
		pathname
	)

	if (matchTypelist != null) {
		return generatePath(matchTypelist.pattern.path, {
			...matchTypelist.params,
			userName:
				matchTypelist.params.userName !== undefined
					? hex(hash32(matchTypelist.params.userName))
					: undefined,
			selected:
				matchTypelist.params.selected !== undefined
					? hex(hash32(matchTypelist.params.selected))
					: undefined,
		})
	}

	const matchUserName = matchPath(
		{ path: `/:locale?/user/:userName`, end: false },
		pathname
	)

	if (matchUserName != null) {
		return generatePath(matchUserName.pattern.path, {
			...matchUserName.params,
			userName:
				matchUserName.params.userName !== undefined
					? hex(hash32(matchUserName.params.userName))
					: undefined,
		})
	}

	return pathname
}
