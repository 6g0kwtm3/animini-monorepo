import { Await, useParams } from "@remix-run/react"
// import type { FragmentType } from "~/lib/graphql"

import { useFragment as readFragment, type FragmentType } from "~/lib/graphql"

// import {} from 'glob'

import { Library, ListItem } from "~/lib/entry/ListItem"
import { formatWatch, toWatch } from "~/lib/entry/toWatch"

import { AnitomyResult } from "anitomy"
import { NonEmptyArray } from "effect/ReadonlyArray"
import { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from "react"
import { graphql } from "~/lib/graphql"

function MediaListHeaderToWatch_entries() {
	return graphql(`
		fragment MediaListHeaderToWatch_entries on MediaList {
			id
			...ToWatch_entry
		}
	`)
}

function MediaList_group() {
	return graphql(`
		fragment MediaList_group on MediaListGroup {
			entries {
				id
				...ListItem_entry
			}
		}
	`)
}

export function MediaList(props) {
	return (
		<>
			{props.entries.map((entry) => (
				<ListItem key={entry.id} entry={entry}></ListItem>
			))}
		</>
	)
}

export function AwaitLibrary({
	children,
	...props
}: ComponentPropsWithoutRef<typeof Await> & {
	children: ReactNode
	resolve: Promise<Record<string, NonEmptyArray<AnitomyResult>>>
}) {
	return (
		<Await {...props}>
			{(library) => (
				<Library.Provider value={library}>{children}</Library.Provider>
			)}
		</Await>
	)
}

export function MediaListHeaderToWatch(props: {
	entries: FragmentType<typeof MediaListHeaderToWatch_entries>[]
}) {
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

export function MediaListRoot(props: { children: ReactNode }) {
	return <div className={""}>{props.children}</div>
}

export function MediaListHeader(props: { children: ReactNode }) {
	const params = useParams()

	return (
		<h2 className="mx-4 flex flex-wrap justify-between text-balance text-display-md">
			<div>{params["selected"]}</div>
			<div className="">{props.children}</div>
		</h2>
	)
}
