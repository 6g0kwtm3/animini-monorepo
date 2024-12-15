/**
 * @generated SignedSource<<9d5e5393d0ee216f6d80011d961b40ce>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
export type MediaStatus = "CANCELLED" | "FINISHED" | "HIATUS" | "NOT_YET_RELEASED" | "RELEASING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { behind as mediaListBehindResolverType } from "../lib/entry/Behind";
// Type assertion validating that `mediaListBehindResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListBehindResolverType satisfies (
  rootKey: Behind_entry$key,
) => number | null | undefined);
import { toWatch as mediaListToWatchResolverType } from "../lib/entry/ToWatch";
// Type assertion validating that `mediaListToWatchResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListToWatchResolverType satisfies (
  rootKey: ToWatch_entry$key,
) => number | null | undefined);
export type routeNavUserListEntriesSort_entries$data = {
  readonly behind: number | null | undefined;
  readonly completedAt: {
    readonly " $fragmentSpreads": FragmentRefs<"routeFuzzyDateOrder_fuzzyDate">;
  } | null | undefined;
  readonly id: number;
  readonly media: {
    readonly averageScore: number | null | undefined;
    readonly endDate: {
      readonly " $fragmentSpreads": FragmentRefs<"routeFuzzyDateOrder_fuzzyDate">;
    } | null | undefined;
    readonly id: number;
    readonly popularity: number | null | undefined;
    readonly startDate: {
      readonly " $fragmentSpreads": FragmentRefs<"routeFuzzyDateOrder_fuzzyDate">;
    } | null | undefined;
    readonly status: MediaStatus | null | undefined;
    readonly title: {
      readonly userPreferred: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
  readonly progress: number | null | undefined;
  readonly score: number | null | undefined;
  readonly startedAt: {
    readonly " $fragmentSpreads": FragmentRefs<"routeFuzzyDateOrder_fuzzyDate">;
  } | null | undefined;
  readonly toWatch: number | null | undefined;
  readonly updatedAt: number | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItem_entry">;
  readonly " $fragmentType": "routeNavUserListEntriesSort_entries";
};
export type routeNavUserListEntriesSort_entries$key = {
  readonly " $data"?: routeNavUserListEntriesSort_entries$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeNavUserListEntriesSort_entries">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeNavUserListEntriesSort_entries"
};

if (import.meta.env?.DEV) {
  (node as any).hash = "340a3098dbe5f620ac5eb6cee5123417";
}

export default node;
