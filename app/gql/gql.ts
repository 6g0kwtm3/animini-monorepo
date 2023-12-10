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
    "\n\t\t\t\t\t\tfragment cache_updates_Mutation_ToggleFavourite on Media {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tisFavourite\n\t\t\t\t\t\t}\n\t\t\t\t\t": types.Cache_Updates_Mutation_ToggleFavouriteFragmentDoc,
    "\n\tmutation Save(\n\t\t$mediaId: Int\n\t\t$advancedScores: [Float]\n\t\t$completedAt: FuzzyDateInput\n\t\t$startedAt: FuzzyDateInput\n\t\t$notes: String\n\t\t$progress: Int\n\t\t$repeat: Int\n\t\t$score: Float\n\t\t$status: MediaListStatus\n\t\t$customLists: [String]\n\t) {\n\t\tSaveMediaListEntry(\n\t\t\tadvancedScores: $advancedScores\n\t\t\tcompletedAt: $completedAt\n\t\t\tstartedAt: $startedAt\n\t\t\tnotes: $notes\n\t\t\tmediaId: $mediaId\n\t\t\tprogress: $progress\n\t\t\trepeat: $repeat\n\t\t\tscore: $score\n\t\t\tstatus: $status\n\t\t\tcustomLists: $customLists\n\t\t) {\n\t\t\tid\n\t\t}\n\t}\n": types.SaveDocument,
    "\n\tquery EditPageViewer {\n\t\tViewer {\n\t\t\tid\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\tadvancedScoring\n\t\t\t\t\t...AdvancedScores_mediaListTypeOptions\n\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t}\n\t\t\t\tscoreFormat\n\t\t\t}\n\t\t}\n\t}\n": types.EditPageViewerDocument,
    "\n\tquery EditPageMedia($id: Int!, $format: ScoreFormat) {\n\t\tMedia(id: $id) {\n\t\t\tid\n\t\t\tepisodes\n\t\t\tmediaListEntry {\n\t\t\t\tstatus\n\t\t\t\tid\n\t\t\t\tadvancedScores\n\t\t\t\tcustomLists\n\t\t\t\tnotes\n\t\t\t\tscore(format: $format)\n\t\t\t\trepeat\n\t\t\t\tprogress\n\t\t\t\tstartedAt {\n\t\t\t\t\tday\n\t\t\t\t\tmonth\n\t\t\t\t\tyear\n\t\t\t\t}\n\t\t\t\tcompletedAt {\n\t\t\t\t\tday\n\t\t\t\t\tmonth\n\t\t\t\t\tyear\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.EditPageMediaDocument,
    "\n\tfragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {\n\t\tadvancedScoring\n\t}\n": types.AdvancedScores_MediaListTypeOptionsFragmentDoc,
    "\n\tfragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n\t\tcustomLists\n\t}\n": types.CustomLists_MediaListTypeOptionsFragmentDoc,
    "\n\tquery EntryPage($id: Int!) {\n\t\tMedia(id: $id) {\n\t\t\tid\n\t\t\tcoverImage {\n\t\t\t\textraLarge\n\t\t\t\tmedium\n\t\t\t\tcolor\n\t\t\t}\n\t\t\tbannerImage\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tdescription\n\t\t}\n\t}\n": types.EntryPageDocument,
    "\n\tfragment ToWatch_entry on MediaList {\n\t\tprogress\n\t\tmedia {\n\t\t\tepisodes\n\t\t\tnextAiringEpisode {\n\t\t\t\tid\n\t\t\t\tepisode\n\t\t\t}\n\t\t\tduration\n\t\t\tstatus\n\t\t\tid\n\t\t}\n\t}\n": types.ToWatch_EntryFragmentDoc,
    "\n\tfragment ListItem_entry on MediaList {\n\t\t...ToWatch_entry\n\n\t\tscore\n\t\tprogress\n\t\tmedia {\n\t\t\tid\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tcoverImage {\n\t\t\t\textraLarge\n\t\t\t\tmedium\n\t\t\t}\n\t\t\tepisodes\n\t\t}\n\t}\n": types.ListItem_EntryFragmentDoc,
    "\n\tfragment MediaList_group on MediaListGroup {\n\t\tname\n\t\tentries {\n\t\t\tid\n\t\t\t...ToWatch_entry\n\t\t\t...ListItem_entry\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n": types.MediaList_GroupFragmentDoc,
    "\n\tquery TypelistQuery($userName: String!, $type: MediaType!) {\n\t\tUser(name: $userName) {\n\t\t\tid\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tsectionOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\tlists {\n\t\t\t\tname\n\t\t\t\t...MediaList_group\n\t\t\t\tentries {\n\t\t\t\t\tid\n\t\t\t\t\tmedia {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tstatus\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.TypelistQueryDocument,
    "\n\tquery HomeQuery {\n\t\tMedia(id: 1) {\n\t\t\tid\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tisFavourite\n\t\t}\n\t}\n": types.HomeQueryDocument,
    "\n\tmutation HomeMutation($animeId: Int) {\n\t\tToggleFavourite(animeId: $animeId) {\n\t\t\t__typename\n\t\t}\n\t}\n": types.HomeMutationDocument,
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
export function graphql(source: "\n\t\t\t\t\t\tfragment cache_updates_Mutation_ToggleFavourite on Media {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tisFavourite\n\t\t\t\t\t\t}\n\t\t\t\t\t"): (typeof documents)["\n\t\t\t\t\t\tfragment cache_updates_Mutation_ToggleFavourite on Media {\n\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\tisFavourite\n\t\t\t\t\t\t}\n\t\t\t\t\t"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation Save(\n\t\t$mediaId: Int\n\t\t$advancedScores: [Float]\n\t\t$completedAt: FuzzyDateInput\n\t\t$startedAt: FuzzyDateInput\n\t\t$notes: String\n\t\t$progress: Int\n\t\t$repeat: Int\n\t\t$score: Float\n\t\t$status: MediaListStatus\n\t\t$customLists: [String]\n\t) {\n\t\tSaveMediaListEntry(\n\t\t\tadvancedScores: $advancedScores\n\t\t\tcompletedAt: $completedAt\n\t\t\tstartedAt: $startedAt\n\t\t\tnotes: $notes\n\t\t\tmediaId: $mediaId\n\t\t\tprogress: $progress\n\t\t\trepeat: $repeat\n\t\t\tscore: $score\n\t\t\tstatus: $status\n\t\t\tcustomLists: $customLists\n\t\t) {\n\t\t\tid\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation Save(\n\t\t$mediaId: Int\n\t\t$advancedScores: [Float]\n\t\t$completedAt: FuzzyDateInput\n\t\t$startedAt: FuzzyDateInput\n\t\t$notes: String\n\t\t$progress: Int\n\t\t$repeat: Int\n\t\t$score: Float\n\t\t$status: MediaListStatus\n\t\t$customLists: [String]\n\t) {\n\t\tSaveMediaListEntry(\n\t\t\tadvancedScores: $advancedScores\n\t\t\tcompletedAt: $completedAt\n\t\t\tstartedAt: $startedAt\n\t\t\tnotes: $notes\n\t\t\tmediaId: $mediaId\n\t\t\tprogress: $progress\n\t\t\trepeat: $repeat\n\t\t\tscore: $score\n\t\t\tstatus: $status\n\t\t\tcustomLists: $customLists\n\t\t) {\n\t\t\tid\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery EditPageViewer {\n\t\tViewer {\n\t\t\tid\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\tadvancedScoring\n\t\t\t\t\t...AdvancedScores_mediaListTypeOptions\n\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t}\n\t\t\t\tscoreFormat\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery EditPageViewer {\n\t\tViewer {\n\t\t\tid\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tadvancedScoringEnabled\n\t\t\t\t\tadvancedScoring\n\t\t\t\t\t...AdvancedScores_mediaListTypeOptions\n\t\t\t\t\t...CustomLists_mediaListTypeOptions\n\t\t\t\t}\n\t\t\t\tscoreFormat\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery EditPageMedia($id: Int!, $format: ScoreFormat) {\n\t\tMedia(id: $id) {\n\t\t\tid\n\t\t\tepisodes\n\t\t\tmediaListEntry {\n\t\t\t\tstatus\n\t\t\t\tid\n\t\t\t\tadvancedScores\n\t\t\t\tcustomLists\n\t\t\t\tnotes\n\t\t\t\tscore(format: $format)\n\t\t\t\trepeat\n\t\t\t\tprogress\n\t\t\t\tstartedAt {\n\t\t\t\t\tday\n\t\t\t\t\tmonth\n\t\t\t\t\tyear\n\t\t\t\t}\n\t\t\t\tcompletedAt {\n\t\t\t\t\tday\n\t\t\t\t\tmonth\n\t\t\t\t\tyear\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery EditPageMedia($id: Int!, $format: ScoreFormat) {\n\t\tMedia(id: $id) {\n\t\t\tid\n\t\t\tepisodes\n\t\t\tmediaListEntry {\n\t\t\t\tstatus\n\t\t\t\tid\n\t\t\t\tadvancedScores\n\t\t\t\tcustomLists\n\t\t\t\tnotes\n\t\t\t\tscore(format: $format)\n\t\t\t\trepeat\n\t\t\t\tprogress\n\t\t\t\tstartedAt {\n\t\t\t\t\tday\n\t\t\t\t\tmonth\n\t\t\t\t\tyear\n\t\t\t\t}\n\t\t\t\tcompletedAt {\n\t\t\t\t\tday\n\t\t\t\t\tmonth\n\t\t\t\t\tyear\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {\n\t\tadvancedScoring\n\t}\n"): (typeof documents)["\n\tfragment AdvancedScores_mediaListTypeOptions on MediaListTypeOptions {\n\t\tadvancedScoring\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n\t\tcustomLists\n\t}\n"): (typeof documents)["\n\tfragment CustomLists_mediaListTypeOptions on MediaListTypeOptions {\n\t\tcustomLists\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery EntryPage($id: Int!) {\n\t\tMedia(id: $id) {\n\t\t\tid\n\t\t\tcoverImage {\n\t\t\t\textraLarge\n\t\t\t\tmedium\n\t\t\t\tcolor\n\t\t\t}\n\t\t\tbannerImage\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tdescription\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery EntryPage($id: Int!) {\n\t\tMedia(id: $id) {\n\t\t\tid\n\t\t\tcoverImage {\n\t\t\t\textraLarge\n\t\t\t\tmedium\n\t\t\t\tcolor\n\t\t\t}\n\t\t\tbannerImage\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tdescription\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment ToWatch_entry on MediaList {\n\t\tprogress\n\t\tmedia {\n\t\t\tepisodes\n\t\t\tnextAiringEpisode {\n\t\t\t\tid\n\t\t\t\tepisode\n\t\t\t}\n\t\t\tduration\n\t\t\tstatus\n\t\t\tid\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment ToWatch_entry on MediaList {\n\t\tprogress\n\t\tmedia {\n\t\t\tepisodes\n\t\t\tnextAiringEpisode {\n\t\t\t\tid\n\t\t\t\tepisode\n\t\t\t}\n\t\t\tduration\n\t\t\tstatus\n\t\t\tid\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment ListItem_entry on MediaList {\n\t\t...ToWatch_entry\n\n\t\tscore\n\t\tprogress\n\t\tmedia {\n\t\t\tid\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tcoverImage {\n\t\t\t\textraLarge\n\t\t\t\tmedium\n\t\t\t}\n\t\t\tepisodes\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment ListItem_entry on MediaList {\n\t\t...ToWatch_entry\n\n\t\tscore\n\t\tprogress\n\t\tmedia {\n\t\t\tid\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tcoverImage {\n\t\t\t\textraLarge\n\t\t\t\tmedium\n\t\t\t}\n\t\t\tepisodes\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment MediaList_group on MediaListGroup {\n\t\tname\n\t\tentries {\n\t\t\tid\n\t\t\t...ToWatch_entry\n\t\t\t...ListItem_entry\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment MediaList_group on MediaListGroup {\n\t\tname\n\t\tentries {\n\t\t\tid\n\t\t\t...ToWatch_entry\n\t\t\t...ListItem_entry\n\t\t\tmedia {\n\t\t\t\tid\n\t\t\t\tstatus\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery TypelistQuery($userName: String!, $type: MediaType!) {\n\t\tUser(name: $userName) {\n\t\t\tid\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tsectionOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\tlists {\n\t\t\t\tname\n\t\t\t\t...MediaList_group\n\t\t\t\tentries {\n\t\t\t\t\tid\n\t\t\t\t\tmedia {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tstatus\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery TypelistQuery($userName: String!, $type: MediaType!) {\n\t\tUser(name: $userName) {\n\t\t\tid\n\t\t\tmediaListOptions {\n\t\t\t\tanimeList {\n\t\t\t\t\tsectionOrder\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\tMediaListCollection(userName: $userName, type: $type) {\n\t\t\tlists {\n\t\t\t\tname\n\t\t\t\t...MediaList_group\n\t\t\t\tentries {\n\t\t\t\t\tid\n\t\t\t\t\tmedia {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tstatus\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery HomeQuery {\n\t\tMedia(id: 1) {\n\t\t\tid\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tisFavourite\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery HomeQuery {\n\t\tMedia(id: 1) {\n\t\t\tid\n\t\t\ttitle {\n\t\t\t\tuserPreferred\n\t\t\t}\n\t\t\tisFavourite\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation HomeMutation($animeId: Int) {\n\t\tToggleFavourite(animeId: $animeId) {\n\t\t\t__typename\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation HomeMutation($animeId: Int) {\n\t\tToggleFavourite(animeId: $animeId) {\n\t\t\t__typename\n\t\t}\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;