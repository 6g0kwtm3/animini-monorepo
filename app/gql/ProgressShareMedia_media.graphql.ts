/**
 * @generated SignedSource<<ae685599f2e383d53e4c17b9b2d86aec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProgressShareMedia_media$data = {
  readonly id: number;
  readonly title: {
    readonly userPreferred: string;
  };
  readonly " $fragmentType": "ProgressShareMedia_media";
} | null | undefined;
export type ProgressShareMedia_media$key = {
  readonly " $data"?: ProgressShareMedia_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProgressShareMedia_media">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProgressShareMedia_media",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "MediaTitle",
        "kind": "LinkedField",
        "name": "title",
        "plural": false,
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
        "storageKey": null
      },
      "action": "LOG"
    }
  ],
  "type": "Media",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "cfce6b08e8a2ac020d0d81fe646c05b5";
}

export default node;
