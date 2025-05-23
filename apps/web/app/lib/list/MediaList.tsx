import { Await, type AwaitProps } from "react-router"

// import {} from 'glob'

import { Library } from "~/lib/entry/Library"
import { formatWatch } from "~/lib/entry/ToWatch"

import type { AnitomyResult } from "anitomy"

import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import type { MediaListHeaderToWatch_entries$key } from "~/gql/MediaListHeaderToWatch_entries.graphql"
import { useFragment } from "../Network"

const { graphql } = ReactRelay

interface AwaitLibraryProps
	extends AwaitProps<
		Promise<Record<string, [AnitomyResult, ...AnitomyResult[]]>>
	> {
	children: ReactNode
}

export function AwaitLibrary({
	children,
	...props
}: AwaitLibraryProps): ReactNode {
	return (
		<Await {...props}>
			{(library) => (
				<Library.Provider value={library}>{children}</Library.Provider>
			)}
		</Await>
	)
}

const MediaListHeaderToWatch_entries = graphql`
	fragment MediaListHeaderToWatch_entries on MediaList @relay(plural: true) {
		id
		toWatch
	}
`

export function MediaListHeaderToWatch(props: {
	entries: MediaListHeaderToWatch_entries$key
}): string {
	const entries = useFragment(MediaListHeaderToWatch_entries, props.entries)

	return formatWatch(
		entries
			.map((entry) => entry.toWatch)
			.filter((n) => typeof n === "number")
			.reduce((a, b) => a + b, 0)
	)
}
export function MediaListHeader(props: { children: ReactNode }): ReactNode {
	return (
		<div className="grid grid-flow-col items-center gap-4 [grid-auto-columns:minmax(0,1fr)]">
			{props.children}
		</div>
	)
}
export function MediaListHeaderItem(props: {
	children: ReactNode
	subtitle: ReactNode
}): ReactNode {
	return (
		<div className="flex flex-col text-center">
			<div className="text-headline-lg">{props.children}</div>
			<div className="text-body-lg">{props.subtitle}</div>
		</div>
	)
}
