import { Await } from "@remix-run/react"
// import type { FragmentType } from "~/lib/graphql"

import { useFragment as readFragment, type FragmentType } from "~/lib/graphql"

// import {} from 'glob'

import { Library } from "~/lib/entry/ListItem"
import { formatWatch, toWatch } from "~/lib/entry/toWatch"

import type { AnitomyResult } from "anitomy"
import type { NonEmptyArray } from "effect/ReadonlyArray"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { serverOnly$ } from "vite-env-only"
import { graphql } from "~/lib/graphql"

export function AwaitLibrary({
	children,
	...props
}: ComponentPropsWithoutRef<typeof Await> & {
	children: ReactNode
	resolve: Promise<Record<string, NonEmptyArray<AnitomyResult>>>
}): ReactNode {
	return (
		<Await {...props}>
			{(library) => (
				<Library.Provider value={library}>{children}</Library.Provider>
			)}
		</Await>
	)
}

const MediaListHeaderToWatch_entries = serverOnly$(
	graphql(`
		fragment MediaListHeaderToWatch_entries on MediaList {
			id
			...ToWatch_entry
		}
	`)
)

export type MediaListHeaderToWatch_entries =
	typeof MediaListHeaderToWatch_entries
export function MediaListHeaderToWatch(props: {
	entries: readonly FragmentType<typeof MediaListHeaderToWatch_entries>[]
}): string {
	let entries = readFragment<typeof MediaListHeaderToWatch_entries>(
		props.entries
	)

	return formatWatch(
		entries
			.map(toWatch)
			.filter(Number.isFinite)
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
