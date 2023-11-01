import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react"
// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"
import { MediaStatus, MediaType } from "~/gql/graphql"

import {
  ClientArgs,
  EffectUrql,
  LoaderArgs,
  ServerLive,
  nonNull,
  useLoader,
  type InferVariables,
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

import {
  BaseButton,
  ButtonText,
  ButtonTonal,

} from "~/components/Button"
import { CardOutlined } from "~/components/Card"
import { useFragment as readFragment, type FragmentType } from "~/gql"
import { fragment, query } from "~/gql/sizzle"

import * as S from "@effect/schema/Schema"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import type { VariantProps } from "tailwind-variants"
import { } from "~/components/Dialog"
import { PaneFlexible } from "~/components/Pane"
import { btnIcon } from "~/lib/button"
function MoreHorizontal() {
  return null
}
function Plus() {
  return null
}

const ToWatch_entry = fragment("ToWatch_entry", "MediaList", {
  progress: 1,
  media: {
    episodes: 1,
    nextAiringEpisode: {
      id: 1,
      episode: 1,
    },
    duration: 1,
    status: 1,
    id: 1,
  },
})

const ListItem_entry = fragment("ListItem_entry", "MediaList", {
  ...ToWatch_entry,

  score: 1,
  progress: 1,
  media: {
    id: 1,
    title: {
      userPreferred: 1,
    },

    coverImage: {
      extraLarge: 1,
      medium: 1,
    },
    episodes: 1,
  },
})

const ListItem_page = fragment(
  "ListItem_page",
  "Page",
  ($: { mediaId_in: (number | null)[]; userName: string }) => ({
    pageInfo: { hasNextPage: 1 },
    mediaList: [
      { mediaId_in: $.mediaId_in, userName: $.userName },
      {
        id: 1,
        ...ToWatch_entry,
        ...ListItem_entry,
        media: { id: 1, status: 1 },
      },
    ],
  }),
)

const MediaListPageQuery = query(
  "MediaListPageQuery",
  { mediaId_in: "[Int]!", perPage: "Int", page: "Int", userName: "String!" },
  ($) => ({
    Page: [
      { page: $.page, perPage: $.perPage },
      {
        ...ListItem_page($),
      },
    ],
  }),
)

const TypelistQuery = query(
  "TypelistQuery",
  { userName: "String!", type: "MediaType!" },
  ($) => ({
    User: [
      { name: $.userName },
      {
        id: 1,
        mediaListOptions: {
          animeList: { sectionOrder: 1 },
        },
      },
    ],
    MediaListCollection: [
      $,
      {
        lists: {
          name: 1,
          entries: {
            id: 1,
            media: {
              id: 1,
            },
          },
        },
      },
    ],
  }),
)

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
  Stream.bind("TypelistQuery", ({ client, args }) =>
    client.query(TypelistQuery, TypelistQueryVariables(args.params)),
  ),
  Stream.let(
    "SelectedList",
    ({ TypelistQuery, args }) =>
      TypelistQuery?.MediaListCollection?.lists
        ?.filter(nonNull)
        .find((list) => list.name === args.searchParams.get("selected")),
  ),
  Stream.bind("MediaListPageQuery", ({ client, SelectedList, args }) =>
    client.query(MediaListPageQuery, {
      mediaId_in:
        SelectedList?.entries
          ?.map((entry) => entry?.media?.id)
          .filter(nonNull) ?? [],
      userName: args.params["userName"]!,
      page: S.parseSync(S.nullable(S.NumberFromString))(
        args.searchParams.get("page"),
      ),
      perPage:
        S.parseSync(S.nullable(S.NumberFromString))(
          args.searchParams.get("perPage"),
        ) ?? 50,
    }),
  ),
  Stream.map(({ MediaListPageQuery, TypelistQuery }) => ({
    ...MediaListPageQuery,
    ...TypelistQuery,
  })),
)

export const loader = (async (args) => {
  return pipe(
    _loader,
    Stream.run(Sink.head()),
    Effect.flatten,
    Effect.provide(ServerLive),
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
  item: FragmentType<ReturnType<typeof ListItem_page>>
}) {
  const page = readFragment(
    ListItem_page({ mediaId_in: [], userName: "" }),
    props.item,
  )

  const entries = pipe(
    page.mediaList?.filter(nonNull) ?? [],
    ReadonlyArray.sortBy(
      Order.mapInput(
        Order.number,
        (entry: FragmentType<typeof ToWatch_entry>) => toWatch(entry),
      ),
      Order.mapInput(Order.number, (entry) =>
        [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
          readFragment(ToWatch_entry, entry)?.media?.status,
        ),
      ),
    ),
  )

  const [searchParams] = useSearchParams()

  return (
    <>
      <div className={""}>
        <h2 className="mx-4 flex text-display-md">
          <div>{searchParams.get("selected")}</div>
          <div className="ms-auto">
            {formatWatch(
              entries
                ?.map(toWatch)
                .filter(isFinite)
                .reduce((a, b) => a + b, 0) ?? 0,
            )}
          </div>
        </h2>
        <div className="py-2">
          <ol className="">
            {entries?.map((entry) => {
              return (
                <li key={entry.id} className="">
                  <ListItem entry={entry}></ListItem>
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
            <Form action="get">
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
            </Form>
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
    </>
  )
}

function deleteSearchParam(searchParams: URLSearchParams, param: string) {
  const copy = new URLSearchParams(searchParams)
  copy.delete(param)
  return copy
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
          <div className="hidden group-hover:block">
            <MoreHorizontal size={56}></MoreHorizontal>
          </div>
        </div>
        <Link to={`/${entry.media?.id}`} className="">
          <span className="line-clamp-1 text-body-lg text-balance">
            {entry.media?.title?.userPreferred}
          </span>
          <div className="gap-2 text-body-md text-on-surface-variant">
            <div>Score: {entry.score}</div>
            <div className="">To watch: {formatWatch(watch)}</div>
          </div>
        </Link>
        <div className="ms-auto w-6 shrink-0 text-label-sm text-on-surface-variant">
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
  ...props
}: PropsWithChildren<
  VariantProps<typeof btnIcon> &
    Omit<ComponentPropsWithoutRef<typeof BaseButton>, "children">
>) {
  const styles = btnIcon()

  return (
    <BaseButton {...props} className={styles.root({ variant, className })}>
      <div className={styles.content()}>{children}</div>
    </BaseButton>
  )
}

export default function Page() {
  const [searchParams] = useSearchParams()

  const data = useLoader(_loader, useLoaderData<typeof loader>())

  const selected = searchParams.get("selected")

  let allLists = data.MediaListCollection?.lists
    ?.filter(nonNull)
    .sort(
      Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
    )

  let lists = allLists

  if (selected) {
    lists = lists?.filter((list) => list.name === selected)
  }

  const order = ReadonlyRecord.fromEntries(
    (data.User?.mediaListOptions?.animeList?.sectionOrder ?? [])
      .filter(nonNull)
      .map((key, i) => [key, i]),
  )

  lists?.sort(
    Order.mapInput(Order.number, (list) => order[list.name ?? ""] ?? Infinity),
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

              <ButtonText invoketarget="show-dialog" type="button">
                Show
              </ButtonText>

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

              <MediaList item={data.Page}></MediaList>
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

enum Direction {
  BOTTOM_TO_TOP = 1,
  TOP_TO_BOTTOM = -1,
}
const direction = Direction.BOTTOM_TO_TOP
