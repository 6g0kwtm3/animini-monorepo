declare module "relay-runtime/lib/store/experimental-live-resolvers/LiveResolverStore" {
	import { Store } from "relay-runtime"

	export = Store
}

declare module "relay-runtime/store/ResolverFragments" {
	import type { useFragment } from "react-relay"
	const ResolverFragments: {
		readFragment: typeof useFragment
	}
	export = ResolverFragments
}

// export {}
