import { useSearchParams } from "@remix-run/react"
// import type { FragmentType } from "~/gql"

import { MediaFormat, MediaStatus } from "~/gql/graphql"

import { Order, ReadonlyArray, pipe } from "effect"
import { type FragmentType } from "~/gql"
import { useFragment as readFragment } from "~/lib/graphql"

// import {} from 'glob'

import { Predicate } from "effect"
import List from "~/components/List"
import { ListItem } from "~/lib/entry/ListItem"
import { formatWatch, toWatch } from "~/lib/entry/toWatch"

import type { MediaList_group } from "./MediaList.server"

const STATUS_OPTIONS = {
	[MediaStatus.Finished]: "Finished",
	[MediaStatus.Releasing]: "Releasing",
	[MediaStatus.NotYetReleased]: "Not Yet Released",
	[MediaStatus.Cancelled]: "Cancelled"
}

const FORMAT_OPTIONS = {
	[MediaFormat.Tv]: "TV",
	[MediaFormat.TvShort]: "TV Short",
	[MediaFormat.Movie]: "Movie",
	[MediaFormat.Special]: "Special",
	[MediaFormat.Ova]: "OVA",
	[MediaFormat.Ona]: "ONA",
	[MediaFormat.Music]: "Music"
}

export function MediaList(props: {
	item: FragmentType<typeof MediaList_group>
}) {
	const page = readFragment<typeof MediaList_group>(props.item)

	const [searchParams] = useSearchParams()

	const status = searchParams
		.getAll("status")
		.flatMap((status) => (status in STATUS_OPTIONS ? [status] : []))

	const format = searchParams
		.getAll("format")
		.flatMap((format) => (format in FORMAT_OPTIONS ? [format] : []))

	let entries = pipe(
		page.entries?.filter(Predicate.isNotNull) ?? [],
		ReadonlyArray.sortBy(
			// Order.mapInput(Order.number, (entry) => behind(entry)),
			Order.mapInput(
				Order.number,
				(entry) => toWatch(entry) || Number.POSITIVE_INFINITY
			),
			Order.mapInput(Order.number, (entry) => {
				return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
					entry.media?.status
				)
			})
		)
	)

	if (status.length) {
		entries = entries.filter((entry) =>
			status.includes(entry.media?.status ?? "")
		)
	}

	if (format.length) {
		entries = entries.filter((entry) =>
			format.includes(entry.media?.format ?? "")
		)
	}

	return (
		<>
			<div className={""}>
				<h2 className="mx-4 flex flex-wrap justify-between text-balance text-display-md">
					<div>{page.name}</div>
					<div className="">
						{formatWatch(
							entries
								.map(toWatch)
								.filter(Number.isFinite)
								.reduce((a, b) => a + b, 0)
						)}
					</div>
				</h2>
				<List className="py-2">
					{entries.map((entry) => {
						return <ListItem key={entry.id} entry={entry}></ListItem>
					})}
				</List>
				{/* <ol className="flex justify-center gap-2"> <li> <Link   to={     pageNumber > 1       ? `?page=${pageNumber - 1}&${deleteSearchParam( searchParams, "page",         )}`       : `?${searchParams}`   }   className={btn()}   aria-disabled={!(pageNumber > 1)} >   <div>Prev</div> </Link> </li> <li> <Form action="get">   <input     type="hidden"     name="selected"     defaultValue={searchParams.get("selected") ?? undefined}   />   <label htmlFor="" className="p-1">     <input       name="page"       type="text"       className="box-content h-[2ch] w-[2ch]"       defaultValue={pageNumber}     />   </label> </Form> </li> <li> <Link   to={     page?.pageInfo?.hasNextPage       ? `?page=${Number(pageNumber) + 1}&${deleteSearchParam( searchParams, "page",         )}`       : `?${searchParams}`   }   className={btn()}   aria-disabled={!page?.pageInfo?.hasNextPage} >   <div>Next</div> </Link> </li>         </ol> */}
			</div>
		</>
	)
}
