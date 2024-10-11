/**
 * @generated SignedSource<<101b80b3735822b689d3f8874ee0978c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ActivityLike_notification$data = {
  readonly activityId: number;
  readonly context: string | null | undefined;
  readonly createdAt: number | null | undefined;
  readonly id: number;
  readonly user: {
    readonly avatar: {
      readonly large: string | null | undefined;
      readonly medium: string | null | undefined;
    } | null | undefined;
    readonly id: number;
    readonly name: string;
  } | null | undefined;
  readonly " $fragmentType": "ActivityLike_notification";
};
export type ActivityLike_notification$key = {
  readonly " $data"?: ActivityLike_notification$data;
  readonly " $fragmentSpreads": FragmentRefs<"ActivityLike_notification">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActivityLike_notification",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "activityId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "context",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "user",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
      "storageKey": null
    }
  ],
  "type": "ActivityLikeNotification",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "4ecf2c74a72bd58ab7d9e8a599f3b8a5";
}

export default node;
