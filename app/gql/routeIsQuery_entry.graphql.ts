/**
 * @generated SignedSource<<b49a7724fa4d8d163933fa70e61df829>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
export type MediaListStatus = "COMPLETED" | "CURRENT" | "DROPPED" | "PAUSED" | "PLANNING" | "REPEATING" | "%future added value";
export type MediaStatus = "CANCELLED" | "FINISHED" | "HIATUS" | "NOT_YET_RELEASED" | "RELEASING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { toWatch as mediaListToWatchResolverType } from "../lib/entry/ToWatch";
// Type assertion validating that `mediaListToWatchResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListToWatchResolverType satisfies (
  rootKey: ToWatch_entry$key,
) => number | null | undefined);
export type routeIsQuery_entry$data = {
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly status?: MediaStatus | null | undefined;
    readonly tags?: ReadonlyArray<{
      readonly id: number;
      readonly name: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly progress?: number | null | undefined;
  readonly score?: number | null | undefined;
  readonly status?: MediaListStatus | null | undefined;
  readonly toWatch?: number | null | undefined;
  readonly " $fragmentType": "routeIsQuery_entry";
};
export type routeIsQuery_entry$key = {
  readonly " $data"?: routeIsQuery_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeIsQuery_entry">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeIsQuery_entry"
};

if (import.meta.env.DEV) {
  (node as any).hash = "97c7597f26a0d8c9f84f35caf2d8b2f2";
}

export default node;
