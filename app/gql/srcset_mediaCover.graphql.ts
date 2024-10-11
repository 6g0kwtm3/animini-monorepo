/**
 * @generated SignedSource<<df9fdcd1cd6f450fa10e277091c87369>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type srcset_mediaCover$data = {
  readonly extraLarge?: string | null | undefined;
  readonly large?: string | null | undefined;
  readonly medium: string | null | undefined;
  readonly " $fragmentType": "srcset_mediaCover";
};
export type srcset_mediaCover$key = {
  readonly " $data"?: srcset_mediaCover$data;
  readonly " $fragmentSpreads": FragmentRefs<"srcset_mediaCover">;
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
  "name": "srcset_mediaCover",
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
  (node as any).hash = "a1481b9cd03e84e4e10a812d003cf79e";
}

export default node;
