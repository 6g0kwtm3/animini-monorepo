import ReactRelay from "react-relay"
import type { userProfileThemeResolver_userOptions$key } from "~/gql/userProfileThemeResolver_userOptions.graphql"
import { readFragment } from "~/lib/Network"
import { getThemeFromHex, type Theme } from "~/lib/theme"
const { graphql } = ReactRelay

const userProfileThemeResolver_userOptions = graphql`
	fragment userProfileThemeResolver_userOptions on UserOptions {
		profileColor
	}
`

/**
 * @RelayResolver UserOptions.profileTheme: RelayResolverValue
 * @rootFragment userProfileThemeResolver_userOptions*/
export function profileTheme(
	key: userProfileThemeResolver_userOptions$key
): Theme | null {
	const options = readFragment(userProfileThemeResolver_userOptions, key)

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
