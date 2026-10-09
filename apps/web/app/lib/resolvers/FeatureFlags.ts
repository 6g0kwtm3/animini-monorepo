import {
	ClientProviderEvents,
	ClientProviderStatus,
} from "@openfeature/web-sdk"
import { suspenseSentinel, type LiveState } from "relay-runtime"

import { client, liveStateFromBooleanFlag } from "../feature-flags"

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

			return () => {
				controller.abort()
			}
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
