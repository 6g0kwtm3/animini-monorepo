import ReactRelay from "react-relay"
import type { date_date$key } from "~/gql/date_date.graphql"
import { readFragment } from "../Network"

const { graphql } = ReactRelay

const date_date = graphql`
	fragment date_date on FuzzyDate {
		day
		month @required(action: LOG)
		year @required(action: LOG)
	}
`

/**
 * @RelayResolver FuzzyDate.date: RelayResolverValue
 * @rootFragment date_date*/
export function date(key: date_date$key): Date | null {
	const data = readFragment(date_date, key)
	if (!data) {
		return null
	}

	return new Date(data.year, data.month - 1, data.day ?? undefined)
}
