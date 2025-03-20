import { ArkErrors } from "arktype"

export function invariant<T>(condition: T | ArkErrors): T {
	if (condition instanceof ArkErrors) {
		throw new Error(condition.summary)
	}
	return condition
}
