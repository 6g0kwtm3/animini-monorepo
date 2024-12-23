import cookie from "cookie"
import ReactRelay from "react-relay"
import {
	Environment,
	Network,
	RecordSource,
	type FetchFunction,
} from "relay-runtime"

import RelayRuntime from "relay-runtime"

import { JsonToToken } from "../viewer"

import { GraphQLResponse } from "./schema"

import { ArkErrors, type } from "arktype"
import LiveResolverStore from "relay-runtime/lib/store/experimental-live-resolvers/LiveResolverStore"
import ResolverFragments from "relay-runtime/store/ResolverFragments"
import { invariant } from "../invariant"
import { isString } from "../Predicate"

const { RelayFeatureFlags } = RelayRuntime

RelayFeatureFlags.ENABLE_RELAY_RESOLVERS = true

const API_URL = "https://graphql.anilist.co"
const fetchQuery_: FetchFunction = async function (
	operation,
	variables,
	cacheConfig,
	uploadables
) {
	const cookies = cookie.parse(document.cookie)

	let token = cookies["anilist-token"]

	if (isString(token)) {
		const parsedToken = JsonToToken(token)
		token = parsedToken instanceof ArkErrors ? undefined : parsedToken.token
	}

	const body = JSON.stringify({
		query: operation.text,
		variables: variables,
	})

	let headers = type(["instanceof", Headers])(cacheConfig.metadata?.headers)
	if (headers instanceof ArkErrors) {
		headers = new Headers()
	}
	headers.set("Content-Type", "application/json")
	headers.set("Accept", "application/json")

	if (token) {
		headers.set("Authorization", `Bearer ${token}`)
	}

	const request = await fetch(API_URL, {
		body: body,
		method: "POST",
		headers,
	})

	const response = invariant(GraphQLResponse(await request.json()))

	return response
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery_)
const store = new LiveResolverStore(new RecordSource())

const environment = new Environment({
	network,
	store,
	requiredFieldLogger(event) {
		if (event.kind === "relay_resolver.error") {
			// Log this somewhere!
			console.warn(
				`Resolver error encountered in ${event.owner}.${event.fieldPath}`
			)
			console.warn(event.error)
		}
	},
	getDataID: (data, typeName) =>
		data.id != null ? `${typeName}:${data.id}` : null,
	// ... other options
})

export const { readFragment } = ResolverFragments

export const {
	commitMutation,
	fetchQuery,
	RelayEnvironmentProvider,
	useFragment,
	readInlineData,
} = ReactRelay

export default environment
