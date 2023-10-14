import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
  Link,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react"
import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"
import type { TypelistQueryQueryVariables } from "~/gql/graphql"
import { MediaStatus, MediaType } from "~/gql/graphql"

import { getClient, nonNull, useLoadedQuery } from "~/lib/urql"


import { Order, ReadonlyArray, ReadonlyRecord, pipe } from "effect"


import { Tonal } from "~/components/Button"
import { CardOutlined } from "~/components/Card"

const QUERY = graphql(`
  query TypelistQuery($userName: String!, $type: MediaType!) {
    User(name: $userName) {
      id
      mediaListOptions {
        animeList {
          sectionOrder
        }
      }
    }
    MediaListCollection(userName: $userName, type: $type) {
      lists {
        name
        ...List_mediaListGroup
      }
    }
  }
`)

function TypelistQueryVariables(
  params: Readonly<Params<string>>,
  search: URLSearchParams
): TypelistQueryQueryVariables {
  const type = {
    animelist: MediaType.Anime,
    mangalist: MediaType.Manga,
  }[String(params["typelist"])]

  if (!type) {
    throw redirect(`/${params["userName"]}/animelist`)
  }

  return {
    userName: params["userName"]!,
    type,
  }
}

export const loader = (({ params, request }) => {
  const url = new URL(request.url)
  return getClient(request)
    .query(QUERY, TypelistQueryVariables(params, url.searchParams))
    .toPromise()
}) satisfies LoaderFunction

const List_mediaListGroup = graphql(`
  fragment List_mediaListGroup on MediaListGroup {
    name
    entries {
      id
      media {
        id
        status
      }
      ...ToWatch_entry
      ...ListItem_entry
    }
  }
`)

const ToWatch_entry = graphql(`
  fragment ToWatch_entry on MediaList {
    id
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

function toWatch(data: FragmentType<typeof ToWatch_entry>) {
  const entry = readFragment(ToWatch_entry, data)

  // return Option.gen(function* (_) {
  //   const episodes = yield* _(
  //     Option.firstSomeOf([
  //       pipe(
  //         Option.fromNullable(entry.media?.episodes),
  //         Option.filter(() => entry.media?.status === MediaStatus.Finished)
  //       ),
  //       pipe(
  //         Option.fromNullable(entry.media?.nextAiringEpisode?.episode),
  //         Option.filter(() => entry.media?.status === MediaStatus.Releasing),
  //         Option.subtract(Option.some(1))
  //       ),
  //     ])
  //   )

  //   const progress = entry.progress ?? 0
  //   const duration = entry.media?.duration ?? 25

  //   return (episodes - progress) * duration
  // })

  return (
    ((entry.media?.nextAiringEpisode?.episode - 1 ||
      entry.media?.episodes ||
      Infinity) -
      (entry.progress ?? 0)) *
      ((entry.media?.duration ?? 25) - 3) || Infinity
  )
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

const MediaList = function (props: {
  item: FragmentType<typeof List_mediaListGroup>
}) {
  const list = readFragment(List_mediaListGroup, props.item)

  const entries = pipe(
    list.entries?.filter(nonNull) ?? [],
    ReadonlyArray.sortBy(
      Order.mapInput(
        Order.number,
        (entry: FragmentType<typeof ToWatch_entry>) => toWatch(entry)
      ),
      Order.mapInput(Order.number, (entry) =>
        [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
          readFragment(ToWatch_entry, entry)?.media?.status
        )
      )
    )
  )

  return (
    <div className={""}>
      <h2 className="text-display-md flex mx-4">
        <div>{list.name}</div>
        <div className="ml-auto">
          {formatWatch(
            entries
              ?.map(toWatch)

              .filter(isFinite)
              .reduce((a, b) => a + b, 0) ?? 0
          )}
        </div>
      </h2>
      <div className="py-2 overflow-auto">
        <ol className="">
          {entries?.map((entry) => {
            return (
              <li key={entry.id} className="">
                <Link className="" to={`/${entry.media?.id}`}>
                  <ListItem entry={entry}></ListItem>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

const ListItem_entry = graphql(`
  fragment ListItem_entry on MediaList {
    id
    score
    ...ToWatch_entry
    media {
      id
      title {
        userPreferred
      }
      coverImage {
        extraLarge
        medium
      }
    }
  }
`)

function ListItem(props: { entry: FragmentType<typeof ListItem_entry> }) {
  const entry = readFragment(ListItem_entry, props.entry)
  const watch = toWatch(entry)

  return (
    <div className="hover:state-hover surface state-on-surface rounded text-on-surface">
      <div className="px-4 flex items-center py-2 gap-4">
        <div className="shrink-0">
          <img
            src={entry.media?.coverImage?.extraLarge || ""}
            className="h-14 w-14 bg-[image:--bg] rounded-xl bg-cover object-cover"
            style={{
              "--bg": `url(${entry.media?.coverImage?.medium})`,
            }}
            loading="lazy"
            alt=""
          />
        </div>
        <span className="text-body-lg text-balance line-clamp-2">
          {entry.media?.title?.userPreferred}
        </span>
        <span className="ml-auto min-w-max text-on-surface-variant text-label-sm">
          {formatWatch(watch)}
        </span>
        <span className="w-[3ch] flex justify-center">{entry.score}</span>
      </div>
    </div>
  )
}

export default function Page() {
  const params = useParams()
  const [searchParams] = useSearchParams()

  const [{ data }] = useLoadedQuery(
    {
      query: QUERY,
      variables: TypelistQueryVariables(params, searchParams),
    },
    useLoaderData<typeof loader>()
  )

  const selected = searchParams.get("selected")

  let allLists = data.MediaListCollection?.lists
    ?.filter(nonNull)
    .sort(
      Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? ""))
    )

  let lists = allLists

  if (selected) {
    lists = lists?.filter((list) => list.name === selected)
  }

  const order = ReadonlyRecord.fromEntries(
    (data.User?.mediaListOptions?.animeList?.sectionOrder ?? [])
      .filter(nonNull)
      .map((key, i) => [key, i])
  )

  lists?.sort(
    Order.mapInput(Order.number, (list) => order[list.name ?? ""] ?? Infinity)
  )

  return (
    <>
      <div className="">
        <div className="flex flex-col ?max-h-screen overflow-hidden">
          <main className="grid grid-cols-12 md:gap-6">
            {/* <aside className="py-2">
          <Navigation>
            <ul className="grid">
              <li>
                <Link
                  to={{
                    search: ``,
                  }}
                >
                  <NavigationItem active={!selected}>
                    <NavigationItemIcon></NavigationItemIcon>
                    All
                  </NavigationItem>
                </Link>
              </li>
              {allLists?.map((list) => {
                return (
                  <li key={list.name}>
                    <Link
                      to={{
                        search: `?selected=${list.name}`,
                      }}
                    >
                      <NavigationItem active={selected === list.name}>
                        <NavigationItemIcon></NavigationItemIcon>
                        {list.name}
                      </NavigationItem>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </Navigation>
        </aside> */}
            <div
              className={`hidden last:block md:block max-md:last:flex-1 col-span-full md:col-span-4`}
            >
              <CardOutlined>
                <aside>
                  <nav>
                    <ul>
                      <li></li>
                    </ul>
                  </nav>
                </aside>
              </CardOutlined>
            </div>
            <div
              className={`hidden last:block md:block max-md:last:flex-1 col-span-full md:col-span-8`}
            >
              {/* <nav className="z-10">
            <Tabs>
              <ul className="grid grid-flow-col">
                {allLists?.map((list) => {
                  return (
                    <li className="first:ml-[3.25rem]" key={list.name}>
                      <TabsTab
                        active={selected === list.name}
                        to={{
                          search: `?selected=${list.name}`,
                        }}
                      >
                        {list.name}
                      </TabsTab>
                    </li>
                  )
                })}
              </ul>
              <hr className="border-surface-variant" />
            </Tabs>
          </nav> */}

              <ul className="flex gap-2 [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center overscroll-contain overflow-x-auto">
                {allLists?.map((list) => {
                  return (
                    <li className="min-w-max" key={list.name}>
                      <Link
                        to={{
                          search: `?selected=${list.name}`,
                        }}
                      >
                        <Tonal
                          className={`${
                            selected === list.name
                              ? `!bg-tertiary-container `
                              : ``
                          }!rounded capitalize`}
                        >
                          {list.name}
                        </Tonal>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {lists?.map((list) => {
                return <MediaList item={list} key={list.name}></MediaList>
              })}
            </div>

            {/* {params["entryId"] && (
              <div className={`md:block flex-1 col-span-full md:col-span-8`}>
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                  {cloneElement(useOutlet(direction) ?? <></>, {
                    key: useLocation().pathname,
                  })}
                </AnimatePresence>
              </div>
            )} */}
          </main>
        </div>
      </div>
    </>
  )
}

enum Direction {
  BOTTOM_TO_TOP = 1,
  TOP_TO_BOTTOM = -1,
}
const direction = Direction.BOTTOM_TO_TOP
