import { GraphQL, graphql } from "$houdini"
import { nonNull } from "~/lib/urql"

interface Props {
  searchParams: URLSearchParams
  data: GraphQL<`
  {... on MediaListGroup
    @componentField(field: "MediaListGroup", prop: "data") {
      name
      entries {
        id
        ListItem
        ...ToWatch_entry @mask_disable
      }
    }}
`>
}

function formatWatch(minutes: number) {
  if (!isFinite(minutes)) {
    return ""
  }
  if (minutes > 60) {
    return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
  }
  return minutes + "min"
}

graphql(`
  fragment ToWatch_entry on MediaList {
    progress
    media {
      episodes
      nextAiringEpisode {
        id
        episode
      }
      duration
      status
      id
    }
  }
`)

function toWatch(data: any) {
  const entry = data

  return (
    ((entry.media?.nextAiringEpisode?.episode - 1 ||
      entry.media?.episodes ||
      Infinity) -
      (entry.progress ?? 0)) *
      ((entry.media?.duration ?? 25) - 3) || Infinity
  )
}

export default function MediaListGroup({ data, searchParams }: Props) {
  return (
    <div className={""}>
      <h2 className="mx-4 flex text-display-md">
        <div>{data.name}</div>
        <div className="ms-auto">
          {formatWatch(
            data.entries
              ?.map(toWatch)
              .filter(isFinite)
              .reduce((a, b) => a + b, 0) ?? 0,
          )}
        </div>
      </h2>
      <div className="py-2">
        <ol className="">
          {data.entries?.filter(nonNull).map((entry) => {
            return (
              <li key={entry.id} className="">
                <entry.ListItem />
              </li>
            )
          })}
        </ol>
      </div>
      <ol className="flex justify-center gap-2">
        <li>
          <a
            href={`?page=${searchParams.get("page") ?? 1}&${deleteSearchParam(
              searchParams,
              "page",
            )}`}
            className="box-content h-[2ch] w-[2ch] p-1"
          >
            {searchParams.get("page") ?? 1}
          </a>
        </li>
        <li>
          <form action="get">
            <input
              type="hidden"
              name="selected"
              defaultValue={searchParams.get("selected") ?? undefined}
            />
            <input
              name="page"
              type="text"
              className="box-content h-[2ch] w-[2ch] p-1"
              defaultValue={searchParams.get("page") ?? 1}
            />
          </form>
        </li>
        <li>
          <a
            href={`?page=${searchParams.get("page") ?? 1}&${deleteSearchParam(
              searchParams,
              "page",
            )}`}
            className="box-content h-[2ch] w-[2ch] p-1"
          >
            {searchParams.get("page") ?? 1}
          </a>
        </li>
      </ol>
    </div>
  )
}

function deleteSearchParam(searchParams: URLSearchParams, param: string) {
  const copy = new URLSearchParams(searchParams)
  copy.delete(param)
  return copy
}
