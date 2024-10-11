/**
 * @generated SignedSource<<8e9a9cc6064c56867a632212de6c3626>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeFuzzyDateOrder_fuzzyDate$data = {
  readonly day: number | null | undefined;
  readonly month: number | null | undefined;
  readonly year: number | null | undefined;
  readonly " $fragmentType": "routeFuzzyDateOrder_fuzzyDate";
};
export type routeFuzzyDateOrder_fuzzyDate$key = {
  readonly " $data"?: routeFuzzyDateOrder_fuzzyDate$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeFuzzyDateOrder_fuzzyDate">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeFuzzyDateOrder_fuzzyDate"
};

if (import.meta.env.DEV) {
  (node as any).hash = "08fcce2ac61137c26662d3123bf36336";
}

export default node;
