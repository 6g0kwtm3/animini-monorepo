/**
 * @generated SignedSource<<d40b987dce3d22df7477b071c6e2c104>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
export type MediaFormat = "MANGA" | "MOVIE" | "MUSIC" | "NOVEL" | "ONA" | "ONE_SHOT" | "OVA" | "SPECIAL" | "TV" | "TV_SHORT" | "%future added value";
export type MediaStatus = "CANCELLED" | "FINISHED" | "HIATUS" | "NOT_YET_RELEASED" | "RELEASING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { toWatch as mediaListToWatchResolverType } from "../lib/entry/ToWatch";
// Type assertion validating that `mediaListToWatchResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListToWatchResolverType satisfies (
  rootKey: ToWatch_entry$key,
) => number | null | undefined);
export type isVisible_entry$data = {
  readonly id: number;
  readonly media: {
    readonly format: MediaFormat | null | undefined;
    readonly id: number;
    readonly status: MediaStatus | null | undefined;
  } | null | undefined;
  readonly progress: number | null | undefined;
  readonly toWatch: number | null | undefined;
  readonly " $fragmentType": "isVisible_entry";
};
export type isVisible_entry$key = {
  readonly " $data"?: isVisible_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"isVisible_entry">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "isVisible_entry"
};

if (import.meta.env?.DEV) {
  (node as any).hash = "b733b559a24cf6e96edf0f2d47760e98";
}

export default node;
