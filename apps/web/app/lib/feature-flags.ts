import { FlaghoistWebProvider } from "@flaghoist/provider-web"
import {
	ClientProviderEvents,
	FirstMatchStrategy,
	MultiProvider,
	OpenFeature,
	TypedInMemoryProvider,
} from "@openfeature/web-sdk"
import { OpenFeatureIntegrationHook } from "@sentry/react"
import { type LiveState } from "relay-runtime"

import type {
	BooleanFlagKey,
	Client,
	Provider,
	ProviderEntryInput,
} from "@openfeature/web-sdk"

export function liveStateFromBooleanFlag(
	flag: BooleanFlagKey
): LiveState<boolean> {
	return liveStateFromFlag(
		flag,
		(client) => client.getBooleanValue.bind(client),
		false
	)
}

function liveStateFromFlag<K extends string, T>(
	flag: K,
	resolver: (client: Client) => (flag: K, defaultValue: T) => T,
	defaultValue: T
): LiveState<T> {
	let value = resolver(client)(flag, defaultValue)
	return {
		read: () => {
			return value
		},
		subscribe: (onChange) => {
			const controller = new AbortController()

			function callback() {
				const nextValue = resolver(client).call(client, flag, defaultValue)
				if (nextValue !== value) {
					value = nextValue
					onChange()
				}
			}

			client.addHandler(
				ClientProviderEvents.ConfigurationChanged,
				(event) => {
					if (event?.flagsChanged?.includes(flag)) {
						callback()
					}
				},
				{ signal: controller.signal }
			)
			client.addHandler(ClientProviderEvents.ContextChanged, callback, {
				signal: controller.signal,
			})

			return () => {
				controller.abort()
			}
		},
	}
}

const apiKey =
	import.meta.env.VITE_FLAGS_KEY
	?? "c857c1300615b6bf15b127547fc3b57eccc5a21573066e50d102708e8dad273e"

const FEATURE_FLAGS_URL = `https://web-flags.black-grass-3db8.workers.dev`
const providers: ProviderEntryInput<Provider>[] = [
	{ provider: new FlaghoistWebProvider({ url: FEATURE_FLAGS_URL, apiKey }) },
	{ provider: new TypedInMemoryProvider({} as const) },
]

void OpenFeature.setProvider(
	new MultiProvider(providers, new FirstMatchStrategy()),
	{
		environment:
			import.meta.env.VITE_SENTRY_MODE === "production"
			|| import.meta.env.VITE_SENTRY_MODE === "preview"
			|| import.meta.env.VITE_SENTRY_MODE === "e2e"
				? import.meta.env.VITE_SENTRY_MODE
				: "development",
	}
)
void OpenFeature.addHooks(new OpenFeatureIntegrationHook())

export const client = OpenFeature.getClient()
import { ClientProviderStatus } from "@openfeature/web-sdk"

function waitForClient(opts: { signal: AbortSignal }): Promise<void> | void {
	if (
		client.providerStatus !== ClientProviderStatus.RECONCILING
		&& client.providerStatus !== ClientProviderStatus.NOT_READY
	) {
		return
	}

	return new Promise((resolve) => {
		const controller = new AbortController()
		const signal = AbortSignal.any([controller.signal, opts.signal])

		function callback() {
			if (
				client.providerStatus !== ClientProviderStatus.RECONCILING
				&& client.providerStatus !== ClientProviderStatus.NOT_READY
			) {
				controller.abort()
				resolve()
			}
		}

		client.addHandler(ClientProviderEvents.ConfigurationChanged, callback, {
			signal,
		})
		client.addHandler(ClientProviderEvents.ContextChanged, callback, { signal })
		client.addHandler(ClientProviderEvents.Error, callback, { signal })
		client.addHandler(ClientProviderEvents.Ready, callback, { signal })
		client.addHandler(ClientProviderEvents.Stale, callback, { signal })
		client.addHandler(ClientProviderEvents.Reconciling, callback, { signal })
	})
}

import { onAbortNavigationSignal } from "./abort-signal-middleware"

import type { Route } from "../+types/root"
export const waitForClientMiddleware: Route.MiddlewareFunction = async (
	{ context },
	next
) => {
	const signal = context.get(onAbortNavigationSignal)
	await waitForClient({ signal })
	return next()
}
