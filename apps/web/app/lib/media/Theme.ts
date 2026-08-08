import {
	argbFromHex,
	blueFromArgb,
	greenFromArgb,
	redFromArgb,
} from "@material/material-color-utilities"
import ReactRelay from "react-relay"
import type { Theme_mediaCover$key } from "~/gql/Theme_mediaCover.graphql"
import { readFragment } from "../Network"
import { type Theme } from "../theme"
import { themes } from "../theme/themes"
const { graphql } = ReactRelay

/**
 * @relayField MediaCoverImage.theme: RelayResolverValue
 * @rootFragment Theme_mediaCover
 */
export function theme(key: Theme_mediaCover$key): null | Theme {
	const media = readFragment(
		graphql`
			fragment Theme_mediaCover on MediaCoverImage {
				color
			}
		`,
		key
	)

	if (!media.color) {
		return null
	}

	const argb1 = argbFromHex(media.color)

	let closestTheme: Theme = DEFAULT_COLOR.theme
	let closestDistance = calculateDistance(argb1, DEFAULT_COLOR.argb)

	for (const { argb, theme } of Object.values(themes)) {
		const distance = calculateDistance(argb1, argb)
		if (distance < closestDistance) {
			closestTheme = theme
			closestDistance = distance
		}
	}

	return closestTheme
}

const DEFAULT_COLOR = themes.blue

function calculateDistance(argb1: number, argb2: number): number {
	return Math.sqrt(
		(redFromArgb(argb1) - redFromArgb(argb2)) ** 2 +
			(greenFromArgb(argb1) - greenFromArgb(argb2)) ** 2 +
			(blueFromArgb(argb1) - blueFromArgb(argb2)) ** 2
	)
}
