import ReactRelay from "react-relay"
import type { userProfileThemeResolver_userOptions$key } from "~/gql/userProfileThemeResolver_userOptions.graphql"
import { readFragment } from "~/lib/Network"
import { getThemeFromHex, type Theme } from "~/lib/theme"
const { graphql } = ReactRelay

/**
 * @RelayResolver UserOptions.profileTheme: RelayResolverValue
 * @rootFragment userProfileThemeResolver_userOptions*/
export function profileTheme(
	key: userProfileThemeResolver_userOptions$key
): null | Theme {
	const options = readFragment(
		graphql`
			fragment userProfileThemeResolver_userOptions on UserOptions {
				profileColor
			}
		`,
		key
	)

	const color = options.profileColor
		? {
				blue: "#3db4f2",
				gray: "#677b94",
				green: "#4cca51",
				orange: "#ef881a",
				pink: "#fc9dd6",
				purple: "#c063ff",
				red: "#e13333",
			}[options.profileColor]
		: null

	return color ? getThemeFromHex(color) : null
}
