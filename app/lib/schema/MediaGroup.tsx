import { useSearchParams } from "@remix-run/react"
import { Order, ReadonlyArray, pipe } from "effect"

import type { FragmentType } from "~/gql"
import { graphql, useFragment } from "~/gql"
import { nonNull } from "../urql"
import { formatWatch } from "./toWatch"

import { MediaStatus } from "~/gql/graphql"

const OPTIONS = {
	[MediaStatus.Finished]: "Finished",
	[MediaStatus.Releasing]: "Releasing",
	[MediaStatus.NotYetReleased]: "Not Yet Released",
	[MediaStatus.Cancelled]: "Cancelled",
}

export default function MediaListData(
	data: FragmentType<typeof MediaGroup_data>,
) {
	return function MediaGroup(props: {}) {
		const page = useFragment(MediaGroup_data, data)

;		(page.entries)

		const [searchParams] = useSearchParams()

		const status = Object.entries(OPTIONS).find(
			([, value]) => value === searchParams.get("status"),
		)?.[0]

		let entries = pipe(
			page?.entries?.filter(nonNull) ?? [],
			ReadonlyArray.sortBy(
				// Order.mapInput(Order.number, (entry) => behind(entry)),
				Order.mapInput(Order.number, (entry) => entry.toWatch.raw),
				Order.mapInput(Order.number, (entry) => {
					const status = entry?.media?.status

					return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
						status,
					)
				}),
			),
		)

		if (status) {
			entries = entries.filter((entry) => entry?.media?.status === status)
		}

		return (
			<>
				<div className={""}>
					<h2 className="mx-4 flex flex-wrap justify-between text-display-md">
						<div>{searchParams.get("selected")}</div>
						<div className="">
							{formatWatch(
								entries
									?.map((entry) => entry.toWatch.raw)
									.filter(Number.isFinite)
									.reduce((a, b) => a + b, 0) ?? 0,
							)}
						</div>
					</h2>
					<div className="py-2">
						<ol>
							{entries?.map((entry) => {
								return (
									<li key={entry.id}>
										<entry.ListItem></entry.ListItem>
									</li>
								)
							})}
						</ol>
					</div>
					{/* <ol className="flex justify-center gap-2">
      <li>
        <Link
          to={
            pageNumber > 1
              ? `?page=${pageNumber - 1}&${deleteSearchParam(
                  searchParams,
                  "page",
                )}`
              : `?${searchParams}`
          }
          className={btn()}
          aria-disabled={!(pageNumber > 1)}
        >
          <div>Prev</div>
        </Link>
      </li>
      <li>
        <Form action="get">
          <input
            type="hidden"
            name="selected"
            defaultValue={searchParams.get("selected") ?? undefined}
          />
          <label htmlFor="" className="p-1">
            <input
              name="page"
              type="text"
              className="box-content h-[2ch] w-[2ch]"
              defaultValue={pageNumber}
            />
          </label>
        </Form>
      </li>
      <li>
        <Link
          to={
            page?.pageInfo?.hasNextPage
              ? `?page=${Number(pageNumber) + 1}&${deleteSearchParam(
                  searchParams,
                  "page",
                )}`
              : `?${searchParams}`
          }
          className={btn()}
          aria-disabled={!page?.pageInfo?.hasNextPage}
        >
          <div>Next</div>
        </Link>
      </li>
    </ol> */}
				</div>
			</>
		)
	}
}

const MediaGroup_data = graphql(`
	fragment MediaGroup on MediaListGroup @component {
		name
		entries {
			id
			toWatch
			ListItem
			media {
				id
				status
			}
		}
	}
`)
