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
    "\n\t\tfragment ListItem_entry on MediaList {\n\t\t\t...ToWatch_entry\n\t\t\t...Progress_entry\n\t\t\tscore\n\t\t\tprogress\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\ttitle {\n\t\t\t\t\tuserPreferred\n\t\t\t\t}\n\t\t\t\tcoverImage {\n\t\t\t\t\textraLarge\n\t\t\t\t\tmedium\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.ListItem_EntryFragmentDoc,
    "\n\tfragment Progress_entry on MediaList {\n\t\tid\n\t\tprogress\n\t\tmedia {\n\t\t\t...Avalible_media\n\t\t\tid\n\t\t\tepisodes\n\t\t}\n\t}\n": types.Progress_EntryFragmentDoc,
    "\n\t\tfragment Behind_entry on MediaList {\n\t\t\tprogress\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\t...Avalible_media\n\t\t\t}\n\t\t}\n\t": types.Behind_EntryFragmentDoc,
    "\n\t\tfragment ToWatch_entry on MediaList {\n\t\t\t...Behind_entry\n\t\t\tmedia {\n\t\t\t\tduration\n\t\t\t\tid\n\t\t\t}\n\t\t\tid\n\t\t}\n\t": types.ToWatch_EntryFragmentDoc,
    "\n\t\tfragment MediaListHeaderToWatch_entries on MediaList {\n\t\t\tid\n\t\t\t...ToWatch_entry\n\t\t}\n\t": types.MediaListHeaderToWatch_EntriesFragmentDoc,
    "\n\t\tfragment MediaList_group on MediaListGroup {\n\t\t\tentries {\n\t\t\t\tid\n\t\t\t\t...ListItem_entry\n\t\t\t}\n\t\t}\n\t": types.MediaList_GroupFragmentDoc,
    "\n\t\tfragment Avalible_media on Media {\n\t\t\tstatus\n\t\t\tepisodes\n\t\t\tnextAiringEpisode {\n\t\t\t\tid\n\t\t\t\tepisode\n\t\t\t}\n\t\t\tid\n\t\t}\n\t": types.Avalible_MediaFragmentDoc,
    "\n\t\tfragment SearchItem_media on Media {\n\t\t\tid\n\t\t\ttype\n\t\t\tcoverImage {\n\t\t\t\tmedium\n\t\t\t\textraLarge\n\t\t\t}\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t}\n\t": types.SearchItem_MediaFragmentDoc,
    "\n\t\tquery TypelistQuery($userName: String!, $type: MediaType!) {\n\t\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\t\tlists {\n\t\t\t\t\tname\n\t\t\t\t\t...MediaList_group\n\t\t\t\t\tentries {\n\t\t\t\t\t\t...ToWatch_entry\n\t\t\t\t\t\tid\n\t\t\t\t\t\tmedia {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\tformat\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t": types.TypelistQueryDocument,
    "\n\t\t\t\t\t\tquery FiltersQuery($userName: String!, $type: MediaType!) {\n\t\t\t\t\t\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\t\t\t\t\t\tlists {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.FiltersQueryDocument,
    "\n\t\t\t\t\t\tquery ListsQuery($userName: String!, $type: MediaType!) {\n\t\t\t\t\t\t\tMediaListCollection(\n\t\t\t\t\t\t\t\tuserName: $userName\n\t\t\t\t\t\t\t\ttype: $type\n\t\t\t\t\t\t\t\tsort: [FINISHED_ON_DESC, UPDATED_TIME_DESC]\n\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\tuser {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tmediaListOptions {\n\t\t\t\t\t\t\t\t\t\tanimeList {\n\t\t\t\t\t\t\t\t\t\t\tsectionOrder\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\tmangaList {\n\t\t\t\t\t\t\t\t\t\t\tsectionOrder\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tlists {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tentries {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t...ListItem_entry\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.ListsQueryDocument,
    "\n\t\t\t\t\t\tquery EditPageMedia($mediaId: Int!, $format: ScoreFormat) {\n\t\t\t\t\t\t\tViewer {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tmediaListOptions {\n\t\t\t\t\t\t\t\t\tscoreFormat\n\t\t\t\t\t\t\t\t\tanimeList {\n\t\t\t\t\t\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\t\t\t\t\t\tadvancedScoring\n\t\t\t\t\t\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tmangaList {\n\t\t\t\t\t\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\t\t\t\t\t\tadvancedScoring\n\t\t\t\t\t\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tMedia(id: $mediaId) {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tepisodes\n\t\t\t\t\t\t\t\ttype\n\t\t\t\t\t\t\t\t...Progress_media\n\t\t\t\t\t\t\t\tmediaListEntry {\n\t\t\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\tadvancedScores\n\t\t\t\t\t\t\t\t\tcustomLists\n\t\t\t\t\t\t\t\t\tnotes\n\t\t\t\t\t\t\t\t\tscore(format: $format)\n\t\t\t\t\t\t\t\t\trepeat\n\t\t\t\t\t\t\t\t\tprogress\n\t\t\t\t\t\t\t\t\tstartedAt {\n\t\t\t\t\t\t\t\t\t\tday\n\t\t\t\t\t\t\t\t\t\tmonth\n\t\t\t\t\t\t\t\t\t\tyear\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tcompletedAt {\n\t\t\t\t\t\t\t\t\t\tday\n\t\t\t\t\t\t\t\t\t\tmonth\n\t\t\t\t\t\t\t\t\t\tyear\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.EditPageMediaDocument,
    "\n\t\tmutation Save(\n\t\t\t$mediaId: Int\n\t\t\t$advancedScores: [Float]\n\t\t\t$completedAt: FuzzyDateInput\n\t\t\t$startedAt: FuzzyDateInput\n\t\t\t$notes: String\n\t\t\t$progress: Int\n\t\t\t$repeat: Int\n\t\t\t$score: Float\n\t\t\t$status: MediaListStatus\n\t\t\t$customLists: [String]\n\t\t) {\n\t\t\tSaveMediaListEntry(\n\t\t\t\tadvancedScores: $advancedScores\n\t\t\t\tcompletedAt: $completedAt\n\t\t\t\tstartedAt: $startedAt\n\t\t\t\tnotes: $notes\n\t\t\t\tmediaId: $mediaId\n\t\t\t\tprogress: $progress\n\t\t\t\trepeat: $repeat\n\t\t\t\tscore: $score\n\t\t\t\tstatus: $status\n\t\t\t\tcustomLists: $customLists\n\t\t\t) {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t": types.SaveDocument,
    "\n\t\tfragment Progress_media on Media {\n\t\t\tid\n\t\t\tepisodes\n\t\t}\n\t": types.Progress_MediaFragmentDoc,
    "\n\t\tfragment AdvancedScoring_listOptions on MediaListTypeOptions {\n\t\t\tadvancedScoringEnabled\n\t\t\tadvancedScoring\n\t\t}\n\t": types.AdvancedScoring_ListOptionsFragmentDoc,
    "\n\t\tfragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n\t\t\tcustomLists\n\t\t}\n\t": types.CustomLists_MediaListTypeOptionsFragmentDoc,
    "\n\t\t\t\t\t\tquery EntryPage($id: Int!) {\n\t\t\t\t\t\t\tMedia(id: $id) {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tcoverImage {\n\t\t\t\t\t\t\t\t\textraLarge\n\t\t\t\t\t\t\t\t\tmedium\n\t\t\t\t\t\t\t\t\tcolor\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tbannerImage\n\t\t\t\t\t\t\t\ttitle {\n\t\t\t\t\t\t\t\t\tuserPreferred\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.EntryPageDocument,
    "\n\t\t\t\t\t\t\tquery NavQuery {\n\t\t\t\t\t\t\t\ttrending: Page(perPage: 10) {\n\t\t\t\t\t\t\t\t\tmedia(sort: [TRENDING_DESC]) {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t...SearchItem_media\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t": types.NavQueryDocument,
    "\n\t\t\t\t\t\tquery LoginQuery {\n\t\t\t\t\t\t\tViewer {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.LoginQueryDocument,
    "\n\t\t\t\t\t\tquery SearchQuery(\n\t\t\t\t\t\t\t$q: String\n\t\t\t\t\t\t\t$sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n\t\t\t\t\t\t) {\n\t\t\t\t\t\t\tpage: Page(perPage: 10) {\n\t\t\t\t\t\t\t\tmedia(search: $q, sort: $sort) {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t...SearchItem_media\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.SearchQueryDocument,
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
export function graphql(source: "\n\t\tfragment ListItem_entry on MediaList {\n\t\t\t...ToWatch_entry\n\t\t\t...Progress_entry\n\t\t\tscore\n\t\t\tprogress\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\ttitle {\n\t\t\t\t\tuserPreferred\n\t\t\t\t}\n\t\t\t\tcoverImage {\n\t\t\t\t\textraLarge\n\t\t\t\t\tmedium\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment ListItem_entry on MediaList {\n\t\t\t...ToWatch_entry\n\t\t\t...Progress_entry\n\t\t\tscore\n\t\t\tprogress\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\ttitle {\n\t\t\t\t\tuserPreferred\n\t\t\t\t}\n\t\t\t\tcoverImage {\n\t\t\t\t\textraLarge\n\t\t\t\t\tmedium\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment Progress_entry on MediaList {\n\t\tid\n\t\tprogress\n\t\tmedia {\n\t\t\t...Avalible_media\n\t\t\tid\n\t\t\tepisodes\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment Progress_entry on MediaList {\n\t\tid\n\t\tprogress\n\t\tmedia {\n\t\t\t...Avalible_media\n\t\t\tid\n\t\t\tepisodes\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment Behind_entry on MediaList {\n\t\t\tprogress\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\t...Avalible_media\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment Behind_entry on MediaList {\n\t\t\tprogress\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\t...Avalible_media\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment ToWatch_entry on MediaList {\n\t\t\t...Behind_entry\n\t\t\tmedia {\n\t\t\t\tduration\n\t\t\t\tid\n\t\t\t}\n\t\t\tid\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment ToWatch_entry on MediaList {\n\t\t\t...Behind_entry\n\t\t\tmedia {\n\t\t\t\tduration\n\t\t\t\tid\n\t\t\t}\n\t\t\tid\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment MediaListHeaderToWatch_entries on MediaList {\n\t\t\tid\n\t\t\t...ToWatch_entry\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment MediaListHeaderToWatch_entries on MediaList {\n\t\t\tid\n\t\t\t...ToWatch_entry\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment MediaList_group on MediaListGroup {\n\t\t\tentries {\n\t\t\t\tid\n\t\t\t\t...ListItem_entry\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment MediaList_group on MediaListGroup {\n\t\t\tentries {\n\t\t\t\tid\n\t\t\t\t...ListItem_entry\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment Avalible_media on Media {\n\t\t\tstatus\n\t\t\tepisodes\n\t\t\tnextAiringEpisode {\n\t\t\t\tid\n\t\t\t\tepisode\n\t\t\t}\n\t\t\tid\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment Avalible_media on Media {\n\t\t\tstatus\n\t\t\tepisodes\n\t\t\tnextAiringEpisode {\n\t\t\t\tid\n\t\t\t\tepisode\n\t\t\t}\n\t\t\tid\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment SearchItem_media on Media {\n\t\t\tid\n\t\t\ttype\n\t\t\tcoverImage {\n\t\t\t\tmedium\n\t\t\t\textraLarge\n\t\t\t}\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment SearchItem_media on Media {\n\t\t\tid\n\t\t\ttype\n\t\t\tcoverImage {\n\t\t\t\tmedium\n\t\t\t\textraLarge\n\t\t\t}\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tquery TypelistQuery($userName: String!, $type: MediaType!) {\n\t\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\t\tlists {\n\t\t\t\t\tname\n\t\t\t\t\t...MediaList_group\n\t\t\t\t\tentries {\n\t\t\t\t\t\t...ToWatch_entry\n\t\t\t\t\t\tid\n\t\t\t\t\t\tmedia {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\tformat\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tquery TypelistQuery($userName: String!, $type: MediaType!) {\n\t\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\t\tlists {\n\t\t\t\t\tname\n\t\t\t\t\t...MediaList_group\n\t\t\t\t\tentries {\n\t\t\t\t\t\t...ToWatch_entry\n\t\t\t\t\t\tid\n\t\t\t\t\t\tmedia {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\tformat\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\tquery FiltersQuery($userName: String!, $type: MediaType!) {\n\t\t\t\t\t\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\t\t\t\t\t\tlists {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tquery FiltersQuery($userName: String!, $type: MediaType!) {\n\t\t\t\t\t\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\t\t\t\t\t\tlists {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\tquery ListsQuery($userName: String!, $type: MediaType!) {\n\t\t\t\t\t\t\tMediaListCollection(\n\t\t\t\t\t\t\t\tuserName: $userName\n\t\t\t\t\t\t\t\ttype: $type\n\t\t\t\t\t\t\t\tsort: [FINISHED_ON_DESC, UPDATED_TIME_DESC]\n\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\tuser {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tmediaListOptions {\n\t\t\t\t\t\t\t\t\t\tanimeList {\n\t\t\t\t\t\t\t\t\t\t\tsectionOrder\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\tmangaList {\n\t\t\t\t\t\t\t\t\t\t\tsectionOrder\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tlists {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tentries {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t...ListItem_entry\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tquery ListsQuery($userName: String!, $type: MediaType!) {\n\t\t\t\t\t\t\tMediaListCollection(\n\t\t\t\t\t\t\t\tuserName: $userName\n\t\t\t\t\t\t\t\ttype: $type\n\t\t\t\t\t\t\t\tsort: [FINISHED_ON_DESC, UPDATED_TIME_DESC]\n\t\t\t\t\t\t\t) {\n\t\t\t\t\t\t\t\tuser {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tmediaListOptions {\n\t\t\t\t\t\t\t\t\t\tanimeList {\n\t\t\t\t\t\t\t\t\t\t\tsectionOrder\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\tmangaList {\n\t\t\t\t\t\t\t\t\t\t\tsectionOrder\n\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tlists {\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tentries {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t...ListItem_entry\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\tquery EditPageMedia($mediaId: Int!, $format: ScoreFormat) {\n\t\t\t\t\t\t\tViewer {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tmediaListOptions {\n\t\t\t\t\t\t\t\t\tscoreFormat\n\t\t\t\t\t\t\t\t\tanimeList {\n\t\t\t\t\t\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\t\t\t\t\t\tadvancedScoring\n\t\t\t\t\t\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tmangaList {\n\t\t\t\t\t\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\t\t\t\t\t\tadvancedScoring\n\t\t\t\t\t\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tMedia(id: $mediaId) {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tepisodes\n\t\t\t\t\t\t\t\ttype\n\t\t\t\t\t\t\t\t...Progress_media\n\t\t\t\t\t\t\t\tmediaListEntry {\n\t\t\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\tadvancedScores\n\t\t\t\t\t\t\t\t\tcustomLists\n\t\t\t\t\t\t\t\t\tnotes\n\t\t\t\t\t\t\t\t\tscore(format: $format)\n\t\t\t\t\t\t\t\t\trepeat\n\t\t\t\t\t\t\t\t\tprogress\n\t\t\t\t\t\t\t\t\tstartedAt {\n\t\t\t\t\t\t\t\t\t\tday\n\t\t\t\t\t\t\t\t\t\tmonth\n\t\t\t\t\t\t\t\t\t\tyear\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tcompletedAt {\n\t\t\t\t\t\t\t\t\t\tday\n\t\t\t\t\t\t\t\t\t\tmonth\n\t\t\t\t\t\t\t\t\t\tyear\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tquery EditPageMedia($mediaId: Int!, $format: ScoreFormat) {\n\t\t\t\t\t\t\tViewer {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tmediaListOptions {\n\t\t\t\t\t\t\t\t\tscoreFormat\n\t\t\t\t\t\t\t\t\tanimeList {\n\t\t\t\t\t\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\t\t\t\t\t\tadvancedScoring\n\t\t\t\t\t\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tmangaList {\n\t\t\t\t\t\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\t\t\t\t\t\tadvancedScoring\n\t\t\t\t\t\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tMedia(id: $mediaId) {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tepisodes\n\t\t\t\t\t\t\t\ttype\n\t\t\t\t\t\t\t\t...Progress_media\n\t\t\t\t\t\t\t\tmediaListEntry {\n\t\t\t\t\t\t\t\t\tstatus\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\tadvancedScores\n\t\t\t\t\t\t\t\t\tcustomLists\n\t\t\t\t\t\t\t\t\tnotes\n\t\t\t\t\t\t\t\t\tscore(format: $format)\n\t\t\t\t\t\t\t\t\trepeat\n\t\t\t\t\t\t\t\t\tprogress\n\t\t\t\t\t\t\t\t\tstartedAt {\n\t\t\t\t\t\t\t\t\t\tday\n\t\t\t\t\t\t\t\t\t\tmonth\n\t\t\t\t\t\t\t\t\t\tyear\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tcompletedAt {\n\t\t\t\t\t\t\t\t\t\tday\n\t\t\t\t\t\t\t\t\t\tmonth\n\t\t\t\t\t\t\t\t\t\tyear\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tmutation Save(\n\t\t\t$mediaId: Int\n\t\t\t$advancedScores: [Float]\n\t\t\t$completedAt: FuzzyDateInput\n\t\t\t$startedAt: FuzzyDateInput\n\t\t\t$notes: String\n\t\t\t$progress: Int\n\t\t\t$repeat: Int\n\t\t\t$score: Float\n\t\t\t$status: MediaListStatus\n\t\t\t$customLists: [String]\n\t\t) {\n\t\t\tSaveMediaListEntry(\n\t\t\t\tadvancedScores: $advancedScores\n\t\t\t\tcompletedAt: $completedAt\n\t\t\t\tstartedAt: $startedAt\n\t\t\t\tnotes: $notes\n\t\t\t\tmediaId: $mediaId\n\t\t\t\tprogress: $progress\n\t\t\t\trepeat: $repeat\n\t\t\t\tscore: $score\n\t\t\t\tstatus: $status\n\t\t\t\tcustomLists: $customLists\n\t\t\t) {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t"): (typeof documents)["\n\t\tmutation Save(\n\t\t\t$mediaId: Int\n\t\t\t$advancedScores: [Float]\n\t\t\t$completedAt: FuzzyDateInput\n\t\t\t$startedAt: FuzzyDateInput\n\t\t\t$notes: String\n\t\t\t$progress: Int\n\t\t\t$repeat: Int\n\t\t\t$score: Float\n\t\t\t$status: MediaListStatus\n\t\t\t$customLists: [String]\n\t\t) {\n\t\t\tSaveMediaListEntry(\n\t\t\t\tadvancedScores: $advancedScores\n\t\t\t\tcompletedAt: $completedAt\n\t\t\t\tstartedAt: $startedAt\n\t\t\t\tnotes: $notes\n\t\t\t\tmediaId: $mediaId\n\t\t\t\tprogress: $progress\n\t\t\t\trepeat: $repeat\n\t\t\t\tscore: $score\n\t\t\t\tstatus: $status\n\t\t\t\tcustomLists: $customLists\n\t\t\t) {\n\t\t\t\tid\n\t\t\t}\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment Progress_media on Media {\n\t\t\tid\n\t\t\tepisodes\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment Progress_media on Media {\n\t\t\tid\n\t\t\tepisodes\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment AdvancedScoring_listOptions on MediaListTypeOptions {\n\t\t\tadvancedScoringEnabled\n\t\t\tadvancedScoring\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment AdvancedScoring_listOptions on MediaListTypeOptions {\n\t\t\tadvancedScoringEnabled\n\t\t\tadvancedScoring\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\tfragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n\t\t\tcustomLists\n\t\t}\n\t"): (typeof documents)["\n\t\tfragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n\t\t\tcustomLists\n\t\t}\n\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\tquery EntryPage($id: Int!) {\n\t\t\t\t\t\t\tMedia(id: $id) {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tcoverImage {\n\t\t\t\t\t\t\t\t\textraLarge\n\t\t\t\t\t\t\t\t\tmedium\n\t\t\t\t\t\t\t\t\tcolor\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tbannerImage\n\t\t\t\t\t\t\t\ttitle {\n\t\t\t\t\t\t\t\t\tuserPreferred\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tquery EntryPage($id: Int!) {\n\t\t\t\t\t\t\tMedia(id: $id) {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tcoverImage {\n\t\t\t\t\t\t\t\t\textraLarge\n\t\t\t\t\t\t\t\t\tmedium\n\t\t\t\t\t\t\t\t\tcolor\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tbannerImage\n\t\t\t\t\t\t\t\ttitle {\n\t\t\t\t\t\t\t\t\tuserPreferred\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tdescription\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\t\tquery NavQuery {\n\t\t\t\t\t\t\t\ttrending: Page(perPage: 10) {\n\t\t\t\t\t\t\t\t\tmedia(sort: [TRENDING_DESC]) {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t...SearchItem_media\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\t\tquery NavQuery {\n\t\t\t\t\t\t\t\ttrending: Page(perPage: 10) {\n\t\t\t\t\t\t\t\t\tmedia(sort: [TRENDING_DESC]) {\n\t\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t\t...SearchItem_media\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\tquery LoginQuery {\n\t\t\t\t\t\t\tViewer {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tquery LoginQuery {\n\t\t\t\t\t\t\tViewer {\n\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\t\t\t\t\t\tquery SearchQuery(\n\t\t\t\t\t\t\t$q: String\n\t\t\t\t\t\t\t$sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n\t\t\t\t\t\t) {\n\t\t\t\t\t\t\tpage: Page(perPage: 10) {\n\t\t\t\t\t\t\t\tmedia(search: $q, sort: $sort) {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t...SearchItem_media\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tquery SearchQuery(\n\t\t\t\t\t\t\t$q: String\n\t\t\t\t\t\t\t$sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n\t\t\t\t\t\t) {\n\t\t\t\t\t\t\tpage: Page(perPage: 10) {\n\t\t\t\t\t\t\t\tmedia(search: $q, sort: $sort) {\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t...SearchItem_media\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;