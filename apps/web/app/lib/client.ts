import { fetchQuery, mutation } from "./Network"

class Client {
	mutation = mutation

	query = fetchQuery
}

export function client_get_client(): Client {
	return new Client()
}

const client_operation = fetchQuery
