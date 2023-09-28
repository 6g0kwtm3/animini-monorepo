import { useLoaderData } from "@remix-run/react";
import { devtoolsExchange } from "@urql/devtools";
import {
  Data,
  DataField,
  offlineExchange as cacheExchange,
} from "@urql/exchange-graphcache";
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage";
import {
  AnyVariables,
  Client,
  UseQueryArgs,
  fetchExchange,
  useQuery,
} from "urql";
import { graphql } from "~/gql";
import { GraphCacheConfig } from "../gql/graphql";

const exchanges = [devtoolsExchange];

function isData(field: DataField | undefined): field is Data {
  return (
    field === null ||
    typeof field === "string" ||
    (typeof field === "object" && !Array.isArray(field) && field.__typename)
  );
}

if (typeof document !== "undefined") {
  const storage = makeDefaultStorage();

  exchanges.push(
    cacheExchange<GraphCacheConfig>({
      storage,
      updates: {
        Mutation: {
          ToggleFavourite(result, args, cache) {
            if (!args.animeId || !result.ToggleFavourite?.anime?.nodes) {
              return;
            }

            const isFavourite = result.ToggleFavourite.anime.nodes.some(
              (anime) => anime?.id === args.animeId
            );

            cache.writeFragment(
              graphql(/* GraphQL */ `
                fragment cache_updates_Mutation_ToggleFavourite on Media {
                  id
                  isFavourite
                }
              `),
              {
                id: args.animeId,
                isFavourite,
              }
            );
          },
        },
      },
      optimistic: {
        ToggleFavourite(args, cache, info) {
          const isFavourite = info.variables.isFavourite;

          return {
            __typename: "Favourites",
            ...(args.animeId && {
              anime: {
                __typename: "MediaConnection",
                nodes: !isFavourite
                  ? [
                      {
                        id: args.animeId,
                        __typename: "Media",
                        isFavourite: true,
                        isFavouriteBlocked: false,
                      },
                    ]
                  : [],
              },
            }),
          };
        },
      },
      keys: {
        MediaTitle: () => null,
        MediaCoverImage: () => null,
        PageInfo: () => null,
        // Page: (data) => Object.keys(data).join(':'),
        Page: () => null,
        FuzzyDate: () => null,
        MediaListTypeOptions: () => null,
        MediaListOptions: () => null,
        UserAvatar: () => null,
        MediaListGroup: () => null,
        MediaListCollection: (collection) =>
          collection.user?.id
            ? "id" + collection.user.id
            : collection.user?.name
            ? "name" + collection.user.name
            : null,
      },
    })
  );
  exchanges.push(fetchExchange);
}

export const urql = new Client({
  url: "https://graphql.anilist.co",
  exchanges: exchanges,
});

export function useLoadedQuery<V extends AnyVariables, D>(
  args: UseQueryArgs<V, D>
) {
  const initial = useLoaderData() as D;
  const [state, execute] = useQuery({
    ...args,
    pause: typeof document === "undefined" || args.pause,
  });

  return [{ ...state, data: state.data ?? initial }, execute] as const;
}
