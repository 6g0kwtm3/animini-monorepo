import { numberToString } from "@animedes/components/numberToString"
import ReactRelay from "react-relay"

const { graphql } = ReactRelay

export function formatWatch(minutes: number): string {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return `${numberToString(Math.floor(minutes / 60))}h ${numberToString(minutes % 60)}min`
	}
	return `${numberToString(minutes)}min`
}
