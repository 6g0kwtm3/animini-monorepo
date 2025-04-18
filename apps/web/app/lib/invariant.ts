import { ArkErrors } from "arktype"

export function invariant<T>(condition: T | ArkErrors): T {
	if (condition instanceof ArkErrors) {
		throw new Response(condition.summary, { status: 400 })
	}
	return condition
}
