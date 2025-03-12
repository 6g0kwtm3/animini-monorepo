import { fetchQuery, mutation } from "./Network"

class Client {
	query = fetchQuery

	mutation = mutation
}

export function client_get_client(): Client {
	return new Client()
}

export const client_operation = fetchQuery
