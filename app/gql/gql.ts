/* eslint-disable */
import * as types from './graphql.js';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n                fragment cache_updates_Mutation_ToggleFavourite on Media {\n                  id\n                  isFavourite\n                }\n              ": types.Cache_Updates_Mutation_ToggleFavouriteFragmentDoc,
    "\n  query TypelistQuery(\n    $userName: String!\n    $type: MediaType!\n    $chunk: Int\n    $perChunk: Int\n  ) {\n    MediaListCollection(\n      userName: $userName\n      type: $type\n      chunk: $chunk\n      perChunk: $perChunk\n    ) {\n      lists {\n        name\n        ...List_mediaListGroup\n      }\n    }\n  }\n": types.TypelistQueryDocument,
    "\n  fragment List_mediaListGroup on MediaListGroup {\n    name\n    entries {\n      id\n      media {\n        id\n        coverImage {\n          extraLarge\n          medium\n        }\n        title {\n          userPreferred\n        }\n      }\n    }\n  }\n": types.List_MediaListGroupFragmentDoc,
    "\n  query HomeQuery {\n    Media(id: 1) {\n      id\n      title {\n        userPreferred\n      }\n      isFavourite\n    }\n  }\n": types.HomeQueryDocument,
    "\n  mutation HomeMutation($animeId: Int) {\n    ToggleFavourite(animeId: $animeId) {\n      __typename\n    }\n  }\n": types.HomeMutationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n                fragment cache_updates_Mutation_ToggleFavourite on Media {\n                  id\n                  isFavourite\n                }\n              "): (typeof documents)["\n                fragment cache_updates_Mutation_ToggleFavourite on Media {\n                  id\n                  isFavourite\n                }\n              "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TypelistQuery(\n    $userName: String!\n    $type: MediaType!\n    $chunk: Int\n    $perChunk: Int\n  ) {\n    MediaListCollection(\n      userName: $userName\n      type: $type\n      chunk: $chunk\n      perChunk: $perChunk\n    ) {\n      lists {\n        name\n        ...List_mediaListGroup\n      }\n    }\n  }\n"): (typeof documents)["\n  query TypelistQuery(\n    $userName: String!\n    $type: MediaType!\n    $chunk: Int\n    $perChunk: Int\n  ) {\n    MediaListCollection(\n      userName: $userName\n      type: $type\n      chunk: $chunk\n      perChunk: $perChunk\n    ) {\n      lists {\n        name\n        ...List_mediaListGroup\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment List_mediaListGroup on MediaListGroup {\n    name\n    entries {\n      id\n      media {\n        id\n        coverImage {\n          extraLarge\n          medium\n        }\n        title {\n          userPreferred\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment List_mediaListGroup on MediaListGroup {\n    name\n    entries {\n      id\n      media {\n        id\n        coverImage {\n          extraLarge\n          medium\n        }\n        title {\n          userPreferred\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query HomeQuery {\n    Media(id: 1) {\n      id\n      title {\n        userPreferred\n      }\n      isFavourite\n    }\n  }\n"): (typeof documents)["\n  query HomeQuery {\n    Media(id: 1) {\n      id\n      title {\n        userPreferred\n      }\n      isFavourite\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation HomeMutation($animeId: Int) {\n    ToggleFavourite(animeId: $animeId) {\n      __typename\n    }\n  }\n"): (typeof documents)["\n  mutation HomeMutation($animeId: Int) {\n    ToggleFavourite(animeId: $animeId) {\n      __typename\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;