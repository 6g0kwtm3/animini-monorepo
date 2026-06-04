import { Kind, TypedQueryDocumentNode, type SelectionSetNode } from "graphql"
import { useOptimistic, useState, type ReactNode } from "react"

type TypeName = string
type Id = string
type RecordKey = `${TypeName}:${Id}`

interface Data {}

interface Record {
	data: Data
	selection: SelectionSetNode
	parent: Record | null
}

const ROOT_QUERY_KEY = "ROOT_QUERY" as const

interface Index {
	[key: RecordKey]: Record
	[ROOT_QUERY_KEY]: Record
}

interface LinkedRecord {
	[key: string]:
		| LinkedRecord
		| null
		| readonly (LinkedRecord | null)[]
		| readonly LinkedRecord[]
}

function indexData(query: TypedQueryDocumentNode, data: LinkedRecord): Index {
	const [operation] = query.definitions.flatMap((definition) =>
		definition.kind === Kind.OPERATION_DEFINITION ? [definition] : []
	)

	if (operation == null) throw new Error()

	const root = { data, parent: null, selection: operation.selectionSet }
	const index: Index = { [ROOT_QUERY_KEY]: root }

	indexRecord(operation.selectionSet, data, index, root)

	return index
}

function indexRecord(
	selectionSet: SelectionSetNode,
	record: LinkedRecord,
	index: Index,
	parent: Record
) {
	for (const field of selectionSet.selections) {
		switch (field.kind) {
			case Kind.FIELD: {
				if (!field.selectionSet) {
					// ignore scalar
					continue
				}

				let value = record[field.alias?.value ?? field.name.value]

				if ("id" in record && "__typename" in record) {
					parent = index[`${record.__typename}:${record.id}`] = {
						data: record,
						selection: selectionSet,
						parent,
					}
				}

				continue
			}
			case Kind.FRAGMENT_SPREAD: {
				// TODO: implement fragments

				continue
			}
			case Kind.INLINE_FRAGMENT: {
				indexRecord(field.selectionSet, record, index, parent)
			}
		}
	}
}

export function useClient() {}

function createCache() {}

export function CacheProvider(props: { children: ReactNode }) {
	const [cache, updateCache] = useState(createCache)
	const [optimisticCache, optimisticUpdateCache] = useOptimistic(cache)

	return <>{props.children}</>
}
