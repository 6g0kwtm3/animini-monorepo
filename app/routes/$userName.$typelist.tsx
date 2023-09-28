import { LoaderFunction, redirect } from "@remix-run/node";
import { Link, Params, useParams, useSearchParams } from "@remix-run/react";
import { Filled } from "~/components/Card";
import { FragmentType, graphql, useFragment } from "~/gql";
import { MediaType, TypelistQueryQueryVariables } from "~/gql/graphql";
import { client } from "~/lib/client.server";
import { useLoadedQuery } from "~/lib/urql";

const QUERY = graphql(`
  query TypelistQuery(
    $userName: String!
    $type: MediaType!
    $chunk: Int
    $perChunk: Int
  ) {
    MediaListCollection(
      userName: $userName
      type: $type
      chunk: $chunk
      perChunk: $perChunk
    ) {
      lists {
        name
        ...List_mediaListGroup
      }
    }
  }
`);

 

function TypelistQueryVariables(
  params: Readonly<Params<string>>,
  search: URLSearchParams
): TypelistQueryQueryVariables {
  const type = {
    animelist: MediaType.Anime,
    mangalist: MediaType.Manga,
  }[String(params.typelist)];

  if (!type) {
    throw redirect(`/${params.userName}/animelist`);
  }

  return {
    userName: params.userName!,
    type,
    perChunk: Number(search.get("perChunk")) || 50,
    chunk: Number(search.get("chunk")) || undefined,
  };
}

export const loader = (({ params, request }) => {
  const url = new URL(request.url);
  return client.request(
    QUERY,
    TypelistQueryVariables(params, url.searchParams)
  );
}) satisfies LoaderFunction;

function nonNull<T>(value: T): value is NonNullable<T> {
  return value !== undefined && value !== null;
}

import {
  ComponentPropsWithoutRef,
  PropsWithChildren,
  createContext,
  forwardRef,
} from "react";
import { Components } from "react-virtuoso";

const List: Components["List"] = forwardRef(function (props, ref) {
  return (
    <div {...props} ref={ref}>
      <ul className="grid ">{props.children}</ul>;
    </div>
  );
});

const FRAGMENT = graphql(`
  fragment List_mediaListGroup on MediaListGroup {
    name
    entries {
      id
      media {
        id
        coverImage {
          extraLarge
          medium
        }
        title {
          userPreferred
        }
      }
    }
  }
`);

const Item = function (props: { item: FragmentType<typeof FRAGMENT> }) {
  const list = useFragment(FRAGMENT, props.item);

  const entries = list.entries?.filter(nonNull);

  return (
    <Filled className={"flex flex-col"}>
      <h1 className="text-display-lg mx-4">{list.name}</h1>
      <ol className="grid py-2 flex-1">
        {entries?.map((entry) => {
          return (
            <li
              key={entry.id}
              className="hover:bg-primary hover:text-on-primary -mx-4 px-4"
            >
              <div className="px-4 flex items-center py-2 gap-4">
                <div className="w-14 h-14 shrink-0">
                  <img
                    src={entry.media?.coverImage?.extraLarge!}
                    className="aspect-square bg-[image:--bg] rounded-xl bg-cover object-cover"
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
              </div>
            </li>
          );
        })}
      </ol>
    </Filled>
  );
};

function NavigationItem(props: PropsWithChildren<{ active: boolean }>) {
  const layoutId = React.useContext(NavigationContext);
  return (
    <div
      className={`${
        props.active ? "text-on-secondary-container" : "text-on-surface-variant"
      } text-label-lg px-4 relative h-14 items-center flex gap-3`}
    >
      {props.active && (
        <motion.div
          layoutId={layoutId}
          className="bg-secondary-container inset-0 absolute -z-10 rounded-xl"
        ></motion.div>
      )}
      {props.children}
    </div>
  );
}

function NavigationItemIcon() {
  return (
    <div className="w-6 h-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className=""
      >
        <line x1="8" x2="21" y1="6" y2="6" />
        <line x1="8" x2="21" y1="12" y2="12" />
        <line x1="8" x2="21" y1="18" y2="18" />
        <line x1="3" x2="3.01" y1="6" y2="6" />
        <line x1="3" x2="3.01" y1="12" y2="12" />
        <line x1="3" x2="3.01" y1="18" y2="18" />
      </svg>
    </div>
  );
}

// export const shouldRevalidate: ShouldRevalidateFunction = ({
//   currentParams,
//   nextParams,
//   formMethod,
//   defaultShouldRevalidate,
// }) => {
//   if (
//     formMethod === "GET" &&
//     currentParams.userName === nextParams.userName &&
//     currentParams.typelist === nextParams.typelist
//   ) {
//     return false;
//   }

//   return defaultShouldRevalidate;
// };

const NavigationContext = createContext<string | undefined>(undefined);
const TabsContext = createContext<string | undefined>(undefined);

function Navigation(props: ComponentPropsWithoutRef<"div">) {
  return (
    <NavigationContext.Provider value={React.useId()}>
      <div className="w-[22.5rem] px-3" {...props}></div>;
    </NavigationContext.Provider>
  );
}

const Tabs = (props: PropsWithChildren<{}>) => {
  return (
    <TabsContext.Provider value={React.useId()}>
      <div className="bg-surface overflow-x-auto">{props.children}</div>;
    </TabsContext.Provider>
  );
};

const TabsTab = (
  props: PropsWithChildren<{
    active: boolean;
    to: ComponentPropsWithoutRef<typeof Link>["to"];
  }>
) => {
  const layoutId = React.useContext(TabsContext);
  return (
    <Link
      to={props.to}
      className={`${
        props.active
          ? "state-primary text-primary"
          : "hover:text-on-surface focus:text-on-surface text-on-surface-variant state-on-surface"
      } px-4 surface text-title-sm focus:state-focus hover:state-hover justify-center flex`}
    >
      <div
        className={`${
          props.active ? "" : ""
        } h-12 whitespace-nowrap relative flex items-center`}
      >
        {props.children}
        {props.active && (
          <motion.div
            layoutId={layoutId}
            className="h-[0.1875rem] absolute bottom-0 left-0 right-0 bg-primary rounded-t-[0.1875rem]"
          ></motion.div>
        )}
      </div>
    </Link>
  );
};

import { motion } from "framer-motion";
import React from "react";
export default function Page() {
  const params = useParams();
  const [searchParams] = useSearchParams();

  const [{ data }] = useLoadedQuery({
    query: QUERY,
    variables: TypelistQueryVariables(params, searchParams),
  });

  const selected = searchParams.get("selected");

  let allLists = data.MediaListCollection?.lists?.filter(nonNull);
  let lists = allLists;

  if (selected) {
    lists = lists?.filter((list) => list.name === selected);
  }

  return (
    <>
      <div>
        <nav className="w-full">
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
                );
              })}
            </ul>
            <hr className="border-surface-variant" />
          </Tabs>
        </nav>
        <div className="flex min-h-screen">
          <aside className="py-2">
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
                  );
                })}
              </ul>
            </Navigation>
          </aside>
          <main className="p-2 flex-1">
            <ul className="grid gap-4">
              {lists?.map((list) => {
                return (
                  <li key={list.name}>
                    <Item item={list}></Item>
                  </li>
                );
              })}
            </ul>
          </main>
          <main className="p-2 flex-1">
            <ul className="grid gap-4">
              {lists?.map((list) => {
                return (
                  <li key={list.name}>
                    <Item item={list}></Item>
                  </li>
                );
              })}
            </ul>
          </main>
        </div>
      </div>
    </>
  );
}
