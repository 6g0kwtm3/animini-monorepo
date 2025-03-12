declare module "relay-runtime/lib/store/ResolverFragments" {
	import type { useFragment } from "react-relay"
	const ResolverFragments: {
		readFragment: typeof useFragment
	}
	export = ResolverFragments
}
