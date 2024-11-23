/**
 * @generated SignedSource<<be0b614d41d0b2bc0ec003f919d64db1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type date_date$data = {
  readonly day: number | null | undefined;
  readonly month: number;
  readonly year: number;
  readonly " $fragmentType": "date_date";
} | null | undefined;
export type date_date$key = {
  readonly " $data"?: date_date$data;
  readonly " $fragmentSpreads": FragmentRefs<"date_date">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "date_date",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "day",
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "month",
        "storageKey": null
      },
      "action": "LOG"
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "year",
        "storageKey": null
      },
      "action": "LOG"
    }
  ],
  "type": "FuzzyDate",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "0fd78db5ad4a2a08bc7f8565177b6ff5";
}

export default node;
