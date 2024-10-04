import type { Location } from "react-router"
import { useLocation, useNavigation } from "react-router"

export function useOptimisticSearchParams(): URLSearchParams {
	const { search } = useOptimisticLocation()

	return new URLSearchParams(search)
}

export function useOptimisticLocation(): Location<unknown> {
	let location = useLocation()
	const navigation = useNavigation()

	// if (navigation.location?.pathname === location.pathname) {
	location = navigation.location ?? location
	// }
	return location
}
