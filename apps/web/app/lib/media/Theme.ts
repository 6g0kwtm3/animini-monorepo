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

	const argb = argbFromHex(media.color)

	const closestColor = themes.blue
	let closestTheme: Theme = closestColor.theme
	let closestDistance = distance(argb, closestColor.argb)

	for (const [name, { argb, theme }] of Object.entries(themes)) {
		if (distance(argb, argb) < closestDistance) {
			closestTheme = theme
			closestDistance = distance(argb, argb)
		}
	}

	return closestTheme
}

function distance(argb1: number, argb2: number): number {
	return Math.sqrt(
		(redFromArgb(argb1) - redFromArgb(argb2)) ** 2
			+ (greenFromArgb(argb1) - greenFromArgb(argb2)) ** 2
			+ (blueFromArgb(argb1) - blueFromArgb(argb2)) ** 2
	)
}
