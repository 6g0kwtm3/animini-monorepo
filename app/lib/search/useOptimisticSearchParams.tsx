import type { Location } from "react-router"
import { useLocation, useNavigation } from "react-router"

export class ReadonlyURLSearchParams extends URLSearchParams {
	delete(name: string, value?: string): ReadonlyURLSearchParams {
		return new ReadonlyURLSearchParams(
			this.entries()
				.filter((entry) => name !== entry[0] && value !== entry[1])
				.toArray()
		)
	}

	set(name: string, value: string): ReadonlyURLSearchParams {
		return new ReadonlyURLSearchParams([
			...this.entries().filter((entry) => name !== entry[0]),
			[name, value],
		])
	}
	append(name: string, value: string): ReadonlyURLSearchParams {
		return new ReadonlyURLSearchParams([...this.entries(), [name, value]])
	}
	sort(): ReadonlyURLSearchParams {
		return new ReadonlyURLSearchParams(
			this.entries()
				.toArray()
				.sort(([a], [b]) => a.localeCompare(b))
		)
	}
}

export function useOptimisticSearchParams(): ReadonlyURLSearchParams {
	const { search } = useOptimisticLocation()

	return new ReadonlyURLSearchParams(search)
}

export function useOptimisticLocation(): Location<unknown> {
	let location = useLocation()
	const navigation = useNavigation()

	// if (navigation.location?.pathname === location.pathname) {
	location = navigation.location ?? location
	// }
	return location
}
