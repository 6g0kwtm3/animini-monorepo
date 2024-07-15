import { useLocation, useNavigation } from "@remix-run/react"

export function useOptimisticSearchParams(): URLSearchParams {
	const { search } = useOptimisticLocation()

	return new URLSearchParams(search)
}
function useOptimisticLocation() {
	let location = useLocation()
	const navigation = useNavigation()

	// if (navigation.location?.pathname === location.pathname) {
	location = navigation.location ?? location
	// }
	return location
}
