import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams
} from "@remix-run/react"
// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"
import { MediaStatus, MediaType } from "~/gql/graphql"

import {
  ClientArgs,
  ClientLoaderLive,
  EffectUrql,
  LoaderArgs,
  LoaderLive,
  nonNull,
  useLoader,
  type InferVariables
} from "~/lib/urql"

import {
  Effect,
  Order,
  ReadonlyArray,
  ReadonlyRecord,
  Sink,
  Stream,
  pipe,
} from "effect"

import { BaseButton, ButtonText, ButtonTonal } from "~/components/Button"
import { CardOutlined } from "~/components/Card"
import { graphql, useFragment as readFragment, type FragmentType } from "~/gql"

import { type ComponentPropsWithoutRef, type PropsWithChildren } from "react"
import type { VariantProps } from "tailwind-variants"
import { } from "~/components/Dialog"
import { PaneFlexible } from "~/components/Pane"
import { Select } from "~/components/Select"
import { btnIcon } from "~/lib/button"

const ToWatch_entry = graphql(`
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

const ListItem_entry = graphql(`
  fragment ListItem_entry on MediaList {
    ...ToWatch_entry

    score
    progress
    media {
      id
      title {
        userPreferred
      }
      coverImage {
        extraLarge
        medium
      }
      episodes
    }
  }
`)

const MediaList_group = graphql(`
  fragment MediaList_group on MediaListGroup {
    name
    entries {
      id
      ...ToWatch_entry
      ...ListItem_entry
      media {
        id
        status
      }
    }
  }
`)

const TypelistQuery = graphql(`
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
        ...MediaList_group
        entries {
          id
          media {
            id
            status
          }
        }
      }
    }
  }
`)

function TypelistQueryVariables(
  params: Readonly<Params<string>>,
): InferVariables<typeof TypelistQuery> {
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

const _loader = pipe(
  Stream.Do,
  Stream.bind("args", () => ClientArgs),
  Stream.bind("client", () => EffectUrql),
  Stream.flatMap(({ client, args }) =>
    client.query(TypelistQuery, TypelistQueryVariables(args.params)),
  ),
)

export const loader = (async (args) => {
  return pipe(
    _loader,
    Stream.run(Sink.head()),
    Effect.flatten,
    Effect.provide(LoaderLive),
    Effect.provideService(LoaderArgs, args),
    Effect.runPromise,
  )
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
  return pipe(
    _loader,
    Stream.run(Sink.head()),
    Effect.flatten,
    Effect.provide(ClientLoaderLive), 
    Effect.provideService(LoaderArgs, args),
    Effect.runPromise,
  )
}) satisfies LoaderFunction

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

  return behind(entry) * ((entry.media?.duration ?? 25) - 3) || Infinity
}

function behind(entry: any) {
  return (
    (entry.media?.nextAiringEpisode?.episode - 1 ||
      entry.media?.episodes ||
      Number.POSITIVE_INFINITY) -
      (entry.progress ?? 0)) *
      ((entry.media?.duration ?? 25) - 3) || Number.POSITIVE_INFINITY
  
}

function formatWatch(minutes: number) {
  if (!Number.isFinite(minutes)) {
    return ""
  }
  if (minutes > 60) {
    return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
  }
  return minutes + "min"
}

declare global {
  interface Array<T> {
    indexOf(searchElement: unknown, fromIndex?: number): number
  }
}

function MediaList(props: { item: FragmentType<typeof MediaList_group> }) {
  const page = readFragment(MediaList_group, props.item)

  const [searchParams] = useSearchParams()

  const status = Object.entries(OPTIONS).find(
    ([, value]) => value === searchParams.get("status"),
  )?.[0]

  let entries = pipe(
    page?.entries?.filter(nonNull) ?? [],
    ReadonlyArray.sortBy(
      // Order.mapInput(Order.number, (entry) => behind(entry)),
      Order.mapInput(
        Order.number,
        (entry: FragmentType<typeof ToWatch_entry>) => toWatch(entry),
      ),
      Order.mapInput(Order.number, (entry) => {
        const status = readFragment(ToWatch_entry, entry)?.media?.status

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
                ?.map(toWatch)
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
                  <ListItem entry={entry}></ListItem>
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



function ListItem(props: { entry: FragmentType<typeof ListItem_entry> }) {
  const entry = readFragment(ListItem_entry, props.entry)
  const watch = toWatch(entry)

  return (
    <div className="group flex grid-flow-col items-start gap-4 px-4 py-3 text-on-surface surface state-on-surface hover:state-hover">
      <>
        <div className="h-14 w-14 shrink-0">
          <img
            src={entry.media?.coverImage?.extraLarge || ""}
            className="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
            style={{
              "--bg": `url(${entry.media?.coverImage?.medium})`,
            }}
            loading="lazy"
            alt=""
          />
          <div className="i hidden p-1 i-12 group-hover:block">more_horiz</div>
        </div>
        <Link to={`/${entry.media?.id}`}>
          <span className="line-clamp-1 text-body-lg text-balance">
            {entry.media?.title?.userPreferred}
          </span>
          <div className="gap-2 text-body-md text-on-surface-variant">
            <div>Score: {entry.score}</div>
            <div>To watch: {formatWatch(watch)}</div>
            <div>Behind: {behind(entry)}</div>
          </div>
        </Link>
        <div className="ms-auto shrink-0 text-label-sm text-on-surface-variant">
          <span className="group-hover:hidden">
            {entry.progress}/{entry.media?.episodes}
          </span>
          <Form method="post" className="hidden group-hover:inline">
            <input type="hidden" name="mediaId" value={entry.media?.id} />
            <input
              type="hidden"
              name="progress"
              value={(entry.progress ?? 0) + 1}
            />
            <ButtonIcon type="submit" className="-m-3">
              add
            </ButtonIcon>
          </Form>
        </div>
      </>
    </div>
  )
}

function ButtonIcon({
  children,
  variant,
  className,
  ...properties
}: PropsWithChildren<
  VariantProps<typeof btnIcon> &
    Omit<ComponentPropsWithoutRef<typeof BaseButton>, "children">
>) {
  const styles = btnIcon()

  return (
    <BaseButton
      {...properties}
      className={styles.root({ variant, className })}
    >
      <div className={styles.content()}>{children}</div>
    </BaseButton>
  )
}

export default function Page() {
  const [searchParams] = useSearchParams()

  const data = useLoader(_loader, useLoaderData<typeof loader>())

  const selected = searchParams.get("selected")

  let allLists = data?.MediaListCollection?.lists
    ?.filter(nonNull)
    .sort(
      Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
    )

  let lists = allLists

  if (selected) {
    lists = lists?.filter((list) => list.name === selected)
  }

  const order = ReadonlyRecord.fromEntries(
    (data?.User?.mediaListOptions?.animeList?.sectionOrder ?? [])
      .filter(nonNull)
      .map((key, index) => [key, index]),
  )

  lists?.sort(
    Order.mapInput(
      Order.number,
      (list) => order[list.name ?? ""] ?? Number.POSITIVE_INFINITY,
    ),
  )

  return (
    <>
      <>
        <PaneFlexible className="?max-h-screen flex flex-col overflow-hidden">
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
              className={`col-span-full hidden last:block max-md:last:flex-1 md:col-span-4 md:block`}
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
              className={`col-span-full hidden last:block max-md:last:flex-1 md:col-span-8 md:block`}
            >
              {/* <nav className="z-10">
            <Tabs>
              <ul className="grid grid-flow-col">
                {allLists?.map((list) => {
                  return (
                    <li className="first:ms-[3.25rem]" key={list.name}>
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

              <StatusFilter></StatusFilter>

              <ul className="flex gap-2 overflow-x-auto overscroll-contain [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center">
                {allLists?.map((list) => {
                  return (
                    <li className="min-w-max" key={list.name}>
                      <Link
                        to={{
                          search: `?selected=${list.name}`,
                        }}
                      >
                        <ButtonTonal
                          className={`${
                            selected === list.name
                              ? `!bg-tertiary-container `
                              : ``
                          }!rounded capitalize`}
                        >
                          {list.name}
                        </ButtonTonal>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* <Dialog id="show-dialog">
                <DialogIcon>
                  <Activity></Activity>
                </DialogIcon>
                <DialogHeadline>Delete selected images?</DialogHeadline>
                <DialogBody>
                  <span className="text-balance">
                    Images will be permanently removed from you account and all
                    synced devices.
                  </span>
                </DialogBody>
                <DialogActions>
                  <ButtonText>Cancel</ButtonText>
                  <ButtonText>Delete</ButtonText>
                </DialogActions>
              </Dialog> */}

              {lists?.map((list) => {
                return <MediaList key={list.name} item={list}></MediaList>
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
        </PaneFlexible>
      </>
    </>
  )
}

const OPTIONS = {
  [MediaStatus.Finished]: "Finished",
  [MediaStatus.Releasing]: "Releasing",
  [MediaStatus.NotYetReleased]: "Not Yet Released",
  [MediaStatus.Cancelled]: "Cancelled",
}

function StatusFilter() {
  const [searchParams] = useSearchParams()

  return (
    <Form>
      <input
        type="hidden"
        name="selected"
        value={searchParams.get("selected") ?? undefined}
      />
      <Select
        name="status"
        defaultValue={searchParams.get("status") ?? "Any"}
        options={["Any", ...Object.values(OPTIONS)]}
      >
        Status
      </Select>
      <ButtonText type="submit">Filter</ButtonText>
    </Form>
  )
}
