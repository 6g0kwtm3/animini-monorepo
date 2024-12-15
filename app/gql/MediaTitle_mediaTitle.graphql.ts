/**
 * @generated SignedSource<<a1059e29a4d18e9ceee59095b84b5132>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaTitle_mediaTitle$data = {
  readonly userPreferred: string;
  readonly " $fragmentType": "MediaTitle_mediaTitle";
} | null | undefined;
export type MediaTitle_mediaTitle$key = {
  readonly " $data"?: MediaTitle_mediaTitle$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaTitle_mediaTitle",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "userPreferred",
        "storageKey": null
      },
      "action": "LOG"
    }
  ],
  "type": "MediaTitle",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "044efa9e5a7511d13125903d96555a6f";
}

export default node;
