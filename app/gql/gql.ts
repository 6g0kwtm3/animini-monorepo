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
    "\n            fragment cache_updates_Mutation_ToggleFavourite on Media {\n              id\n              isFavourite\n            }\n          ": types.Cache_Updates_Mutation_ToggleFavouriteFragmentDoc,
    "\n  mutation Save(\n    $mediaId: Int\n    $advancedScores: [Float]\n    $completedAt: FuzzyDateInput\n    $startedAt: FuzzyDateInput\n    $notes: String\n    $progress: Int\n    $repeat: Int\n    $score: Float\n    $status: MediaListStatus\n    $customLists: [String]\n  ) {\n    SaveMediaListEntry(\n      advancedScores: $advancedScores\n      completedAt: $completedAt\n      startedAt: $startedAt\n      notes: $notes\n      mediaId: $mediaId\n      progress: $progress\n      repeat: $repeat\n      score: $score\n      status: $status\n      customLists: $customLists\n    ) {\n      id\n    }\n  }\n": types.SaveDocument,
    "\n  query EditPageViewer {\n    Viewer {\n      id\n      mediaListOptions {\n        animeList {\n          advancedScoringEnabled\n          advancedScoring\n          ...AdvancedScores_mediaListTypeOptions\n          ...CustomLists_mediaListTypeOptions\n        }\n        scoreFormat\n      }\n    }\n  }\n": types.EditPageViewerDocument,
    "\n  query EditPageMedia($id: Int!, $format: ScoreFormat) {\n    Media(id: $id) {\n      id\n      episodes\n      mediaListEntry {\n        status\n        id\n        advancedScores\n        customLists\n        notes\n        score(format: $format)\n        repeat\n        progress\n        startedAt {\n          day\n          month\n          year\n        }\n        completedAt {\n          day\n          month\n          year\n        }\n      }\n    }\n  }\n": types.EditPageMediaDocument,
    "\n  fragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {\n    advancedScoring\n  }\n": types.AdvancedScores_MediaListTypeOptionsFragmentDoc,
    "\n  fragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n    customLists\n  }\n": types.CustomLists_MediaListTypeOptionsFragmentDoc,
    "\n  query EntryPage($id: Int!) {\n    Media(id: $id) {\n      id\n      coverImage {\n        extraLarge\n        medium\n        color\n      }\n      bannerImage\n      title {\n        userPreferred\n      }\n      description\n    }\n  }\n": types.EntryPageDocument,
    "\n  fragment ToWatch_entry on MediaList {\n    progress\n    media {\n      episodes\n      nextAiringEpisode {\n        id\n        episode\n      }\n      duration\n      status\n      id\n    }\n  }\n": types.ToWatch_EntryFragmentDoc,
    "\n  fragment ListItem_entry on MediaList {\n    ...ToWatch_entry\n\n    score\n    progress\n    media {\n      id\n      title {\n        userPreferred\n      }\n      coverImage {\n        extraLarge\n        medium\n      }\n      episodes\n    }\n  }\n": types.ListItem_EntryFragmentDoc,
    "\n  fragment MediaList_group on MediaListGroup {\n    name\n    entries {\n      id\n      ...ToWatch_entry\n      ...ListItem_entry\n      media {\n        id\n        status\n      }\n    }\n  }\n": types.MediaList_GroupFragmentDoc,
    "\n  query TypelistQuery($userName: String!, $type: MediaType!) {\n    User(name: $userName) {\n      id\n      mediaListOptions {\n        animeList {\n          sectionOrder\n        }\n      }\n    }\n    MediaListCollection(userName: $userName, type: $type) {\n      lists {\n        name\n        ...MediaList_group\n        entries {\n          id\n          media {\n            id\n            status\n          }\n        }\n      }\n    }\n  }\n": types.TypelistQueryDocument,
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
export function graphql(source: "\n            fragment cache_updates_Mutation_ToggleFavourite on Media {\n              id\n              isFavourite\n            }\n          "): (typeof documents)["\n            fragment cache_updates_Mutation_ToggleFavourite on Media {\n              id\n              isFavourite\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Save(\n    $mediaId: Int\n    $advancedScores: [Float]\n    $completedAt: FuzzyDateInput\n    $startedAt: FuzzyDateInput\n    $notes: String\n    $progress: Int\n    $repeat: Int\n    $score: Float\n    $status: MediaListStatus\n    $customLists: [String]\n  ) {\n    SaveMediaListEntry(\n      advancedScores: $advancedScores\n      completedAt: $completedAt\n      startedAt: $startedAt\n      notes: $notes\n      mediaId: $mediaId\n      progress: $progress\n      repeat: $repeat\n      score: $score\n      status: $status\n      customLists: $customLists\n    ) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation Save(\n    $mediaId: Int\n    $advancedScores: [Float]\n    $completedAt: FuzzyDateInput\n    $startedAt: FuzzyDateInput\n    $notes: String\n    $progress: Int\n    $repeat: Int\n    $score: Float\n    $status: MediaListStatus\n    $customLists: [String]\n  ) {\n    SaveMediaListEntry(\n      advancedScores: $advancedScores\n      completedAt: $completedAt\n      startedAt: $startedAt\n      notes: $notes\n      mediaId: $mediaId\n      progress: $progress\n      repeat: $repeat\n      score: $score\n      status: $status\n      customLists: $customLists\n    ) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditPageViewer {\n    Viewer {\n      id\n      mediaListOptions {\n        animeList {\n          advancedScoringEnabled\n          advancedScoring\n          ...AdvancedScores_mediaListTypeOptions\n          ...CustomLists_mediaListTypeOptions\n        }\n        scoreFormat\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditPageViewer {\n    Viewer {\n      id\n      mediaListOptions {\n        animeList {\n          advancedScoringEnabled\n          advancedScoring\n          ...AdvancedScores_mediaListTypeOptions\n          ...CustomLists_mediaListTypeOptions\n        }\n        scoreFormat\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EditPageMedia($id: Int!, $format: ScoreFormat) {\n    Media(id: $id) {\n      id\n      episodes\n      mediaListEntry {\n        status\n        id\n        advancedScores\n        customLists\n        notes\n        score(format: $format)\n        repeat\n        progress\n        startedAt {\n          day\n          month\n          year\n        }\n        completedAt {\n          day\n          month\n          year\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query EditPageMedia($id: Int!, $format: ScoreFormat) {\n    Media(id: $id) {\n      id\n      episodes\n      mediaListEntry {\n        status\n        id\n        advancedScores\n        customLists\n        notes\n        score(format: $format)\n        repeat\n        progress\n        startedAt {\n          day\n          month\n          year\n        }\n        completedAt {\n          day\n          month\n          year\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {\n    advancedScoring\n  }\n"): (typeof documents)["\n  fragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {\n    advancedScoring\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n    customLists\n  }\n"): (typeof documents)["\n  fragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n    customLists\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EntryPage($id: Int!) {\n    Media(id: $id) {\n      id\n      coverImage {\n        extraLarge\n        medium\n        color\n      }\n      bannerImage\n      title {\n        userPreferred\n      }\n      description\n    }\n  }\n"): (typeof documents)["\n  query EntryPage($id: Int!) {\n    Media(id: $id) {\n      id\n      coverImage {\n        extraLarge\n        medium\n        color\n      }\n      bannerImage\n      title {\n        userPreferred\n      }\n      description\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ToWatch_entry on MediaList {\n    progress\n    media {\n      episodes\n      nextAiringEpisode {\n        id\n        episode\n      }\n      duration\n      status\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment ToWatch_entry on MediaList {\n    progress\n    media {\n      episodes\n      nextAiringEpisode {\n        id\n        episode\n      }\n      duration\n      status\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListItem_entry on MediaList {\n    ...ToWatch_entry\n\n    score\n    progress\n    media {\n      id\n      title {\n        userPreferred\n      }\n      coverImage {\n        extraLarge\n        medium\n      }\n      episodes\n    }\n  }\n"): (typeof documents)["\n  fragment ListItem_entry on MediaList {\n    ...ToWatch_entry\n\n    score\n    progress\n    media {\n      id\n      title {\n        userPreferred\n      }\n      coverImage {\n        extraLarge\n        medium\n      }\n      episodes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment MediaList_group on MediaListGroup {\n    name\n    entries {\n      id\n      ...ToWatch_entry\n      ...ListItem_entry\n      media {\n        id\n        status\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment MediaList_group on MediaListGroup {\n    name\n    entries {\n      id\n      ...ToWatch_entry\n      ...ListItem_entry\n      media {\n        id\n        status\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TypelistQuery($userName: String!, $type: MediaType!) {\n    User(name: $userName) {\n      id\n      mediaListOptions {\n        animeList {\n          sectionOrder\n        }\n      }\n    }\n    MediaListCollection(userName: $userName, type: $type) {\n      lists {\n        name\n        ...MediaList_group\n        entries {\n          id\n          media {\n            id\n            status\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query TypelistQuery($userName: String!, $type: MediaType!) {\n    User(name: $userName) {\n      id\n      mediaListOptions {\n        animeList {\n          sectionOrder\n        }\n      }\n    }\n    MediaListCollection(userName: $userName, type: $type) {\n      lists {\n        name\n        ...MediaList_group\n        entries {\n          id\n          media {\n            id\n            status\n          }\n        }\n      }\n    }\n  }\n"];
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