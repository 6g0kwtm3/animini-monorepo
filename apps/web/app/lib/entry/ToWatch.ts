import { numberToString } from "@animedes/components/numberToString"

export function formatWatch(minutes: number): string {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return `${numberToString(Math.floor(minutes / 60))}h ${numberToString(minutes % 60)}min`
	}
	return `${numberToString(minutes)}min`
}
