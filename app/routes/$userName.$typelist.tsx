import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { ClientLoaderFunction, Params } from "@remix-run/react"
import { Form, Link, useLoaderData, useSearchParams } from "@remix-run/react"
// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"
import { MediaStatus, MediaType } from "~/gql/graphql"

import {
	ClientArgs,
	ClientLoaderLive,
	LoaderArgs,
	LoaderLive,
	nonNull,
	type InferVariables
} from "~/lib/urql"

import { Effect, Order, ReadonlyRecord, Sink, Stream, pipe } from "effect"

import { ButtonText, ButtonTonal } from "~/components/Button"
import { CardOutlined } from "~/components/Card"
import { graphql } from "~/gql"

import { } from "~/components/Dialog"
import { PaneFlexible } from "~/components/Pane"
import { Select } from "~/components/Select"
import { loadQuery, useQuery } from "~/schema/resolvers"

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
				MediaGroup
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
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.flatMap(({ args }) =>
		Effect.tryPromise(() =>
			loadQuery(TypelistQuery, TypelistQueryVariables(args.params)),
		),
	),
	Effect.map((ref) => ({ ref })),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.onError((cause) => Effect.sync(() => console.error(cause))),
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
}) satisfies ClientLoaderFunction

export default function Page() {
	const [searchParams] = useSearchParams()

	const { ref } = useLoaderData<typeof loader>()
	const { data } = useQuery(ref)

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
								return <list.MediaGroup key={list.name}></list.MediaGroup>
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
