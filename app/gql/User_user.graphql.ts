/**
 * @generated SignedSource<<3b79265632ca9f71cd5fab6c2a30c36c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type User_user$data = {
  readonly avatar: {
    readonly large: string | null | undefined;
    readonly medium: string | null | undefined;
  } | null | undefined;
  readonly bannerImage: string | null | undefined;
  readonly id: number;
  readonly name: string;
  readonly " $fragmentType": "User_user";
};
export type User_user$key = {
  readonly " $data"?: User_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"User_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "User_user",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bannerImage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "UserAvatar",
      "kind": "LinkedField",
      "name": "avatar",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "large",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "medium",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "3f1aef9b73d0a7a42e4a75075b68faf0";
}

export default node;
