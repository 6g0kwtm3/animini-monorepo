import { numberToString } from "utilities"

let i = 0

export class Marker {
	/** @internal */ public readonly id: number = ++i
	/** @internal */ readonly kind = "Marker" as const
}

/** @internal */
export function markerToSelector(marker: Marker): string {
	return `marker-${numberToString(marker.id)}`
}

export function ancestor(selector: string, marker: Marker) {
	return `&:is(:where(${selector.replaceAll("&", markerToSelector(marker))}) *)`
}

export function descendant(selector: string, marker: Marker) {
	return `&:has(${selector.replaceAll("&", markerToSelector(marker))})`
}
