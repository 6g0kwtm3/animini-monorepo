import ReactRelay from "react-relay"
import type { Theme_userOptions$key } from "~/gql/Theme_userOptions.graphql"
import { readFragment } from "../Network"
import { getThemeFromHex, type Theme } from "../theme"
const { graphql } = ReactRelay

const Theme_userOptions = graphql`
	fragment Theme_userOptions on UserOptions {
		profileColor
	}
`

/**
 * @RelayResolver UserOptions.profileTheme: RelayResolverValue
 * @rootFragment Theme_userOptions*/
export function profileTheme(key: Theme_userOptions$key): Theme | null {
	const options = readFragment(Theme_userOptions, key)

	console.log(options)

	const color = options.profileColor
		? {
				blue: "#3db4f2",
				purple: "#c063ff",
				green: "#4cca51",
				orange: "#ef881a",
				red: "#e13333",
				pink: "#fc9dd6",
				gray: "#677b94",
			}[options.profileColor]
		: null

	return color ? getThemeFromHex(color) : null
}
