/**
 * @generated SignedSource<<3fb0669ee4cd5dfa22badb3e5d26e9ff>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type src_mediaCover$data = {
  readonly extraLarge?: string | null | undefined;
  readonly large?: string | null | undefined;
  readonly medium: string | null | undefined;
  readonly " $fragmentType": "src_mediaCover";
};
export type src_mediaCover$key = {
  readonly " $data"?: src_mediaCover$data;
  readonly " $fragmentSpreads": FragmentRefs<"src_mediaCover">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "extraLarge"
    },
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "large"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "src_mediaCover",
  "selections": [
    {
      "condition": "extraLarge",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "extraLarge",
          "storageKey": null
        }
      ]
    },
    {
      "condition": "large",
      "kind": "Condition",
      "passingValue": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "large",
          "storageKey": null
        }
      ]
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "medium",
      "storageKey": null
    }
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};

if (import.meta.env.DEV) {
  (node as any).hash = "f185028146ff9595bda3e0e73c936051";
}

export default node;
