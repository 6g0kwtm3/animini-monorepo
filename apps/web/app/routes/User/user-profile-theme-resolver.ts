import type { OutStyles } from "@anitrove/unstyled"
import ReactRelay from "react-relay"
import type { userProfileThemeResolver_userOptions$key } from "~/gql/userProfileThemeResolver_userOptions.graphql"
import { readFragment } from "~/lib/Network"
import { type Theme } from "~/lib/theme"
import { themes } from "~/lib/theme/themes"
const { graphql } = ReactRelay

/**
 * @relayField UserOptions.profileTheme: RelayResolverValue
 * @rootFragment userProfileThemeResolver_userOptions
 */
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

	const newLocal: Record<string, { theme: OutStyles }> = { ...themes }
	return options.profileColor
		? (newLocal[options.profileColor]?.theme ?? null)
		: null
}
