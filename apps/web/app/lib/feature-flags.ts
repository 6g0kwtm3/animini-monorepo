import { FlaghoistWebProvider } from "@flaghoist/provider-web"
import {
	ClientProviderEvents,
	ClientProviderStatus,
	FirstMatchStrategy,
	MultiProvider,
	OpenFeature,
	TypedInMemoryProvider,
} from "@openfeature/web-sdk"
import { OpenFeatureIntegrationHook } from "@sentry/react"
import { suspenseSentinel, type LiveState } from "relay-runtime"

import type {
	BooleanFlagKey,
	Client,
	Provider,
	ProviderEntryInput,
} from "@openfeature/web-sdk"

/**
 * @relayType FeatureFlags
 * @weak
 */
export interface FeatureFlags {}

/**
 * @relayField Query.featureFlags: FeatureFlags @semanticNonNull
 * @live
 */
export function featureFlags(): LiveState<FeatureFlags> {
	let status: "LOADING" | "READY" =
		client.providerStatus === ClientProviderStatus.RECONCILING
		|| client.providerStatus === ClientProviderStatus.NOT_READY
			? "LOADING"
			: "READY"

	const obj = {}

	return {
		read: () => {
			switch (status) {
				case "LOADING":
					return suspenseSentinel()
				case "READY":
					return obj
			}
		},
		subscribe: (onChange) => {
			const controller = new AbortController()

			function callback() {
				const nextStatus =
					client.providerStatus === ClientProviderStatus.RECONCILING
					|| client.providerStatus === ClientProviderStatus.NOT_READY
						? "LOADING"
						: "READY"

				if (nextStatus !== status) {
					status = nextStatus
					onChange()
				}
			}

			client.addHandler(ClientProviderEvents.ConfigurationChanged, callback, {
				signal: controller.signal,
			})
			client.addHandler(ClientProviderEvents.ContextChanged, callback, {
				signal: controller.signal,
			})
			client.addHandler(ClientProviderEvents.Error, callback, {
				signal: controller.signal,
			})
			client.addHandler(ClientProviderEvents.Ready, callback, {
				signal: controller.signal,
			})
			client.addHandler(ClientProviderEvents.Stale, callback, {
				signal: controller.signal,
			})
			client.addHandler(ClientProviderEvents.Reconciling, callback, {
				signal: controller.signal,
			})

			return () => controller.abort()
		},
	}
}

/**
 * @relayField FeatureFlags.enableSanitizerWebAPI: Boolean @semanticNonNull
 * @live
 */
export function enableSanitizerWebAPI() {
	return liveStateFromBooleanFlag("enable_sanitizer_web_api")
}

function liveStateFromBooleanFlag(flag: BooleanFlagKey): LiveState<boolean> {
	return liveStateFromFlag(flag, (client) => client.getBooleanValue, false)
}

function liveStateFromFlag<K extends string, T>(
	flag: K,
	resolver: (client: Client) => (flag: K, defaultValue: T) => T,
	defaultValue: T
): LiveState<T> {
	let value = resolver(client).call(client, flag, defaultValue)
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

			return () => controller.abort()
		},
	}
}

const apiKey =
	import.meta.env.VITE_FLAGS_KEY
	?? "c857c1300615b6bf15b127547fc3b57eccc5a21573066e50d102708e8dad273e"

const providers: ProviderEntryInput<Provider>[] = [
	{
		provider: new FlaghoistWebProvider({
			url: `https://web-flags.black-grass-3db8.workers.dev`,
			apiKey,
		}),
	},
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
