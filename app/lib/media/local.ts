import ReactRelay from "react-relay"
import type { local_date$key } from "~/gql/local_date.graphql"
import { readFragment } from "../Network"

const { graphql } = ReactRelay

const local_date = graphql`
	fragment local_date on FuzzyDate {
		day
		month @required(action: LOG)
		year @required(action: LOG)
	}
`

/**
 * @RelayResolver FuzzyDate.local: String
 * @rootFragment local_date*/
export function local(key: local_date$key): string | null {
	const data = readFragment(local_date, key)
	if (!data) {
		return null
	}
	const fmt = new Intl.DateTimeFormat()

	return fmt.format(new Date(data.year, data.month - 1, data.day ?? undefined))
}
