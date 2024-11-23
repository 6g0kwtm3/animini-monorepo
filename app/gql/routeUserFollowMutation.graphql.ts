/**
 * @generated SignedSource<<dd44a1e0e88b9ecbe850828ded890dfc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type routeUserFollowMutation$variables = {
  userId: number;
};
export type routeUserFollowMutation$data = {
  readonly ToggleFollow: {
    readonly id: number;
    readonly isFollowing: boolean | null | undefined;
    readonly name: string;
  } | null | undefined;
};
export type routeUserFollowMutation$rawResponse = {
  readonly ToggleFollow: {
    readonly id: number;
    readonly isFollowing: boolean | null | undefined;
    readonly name: string;
  } | null | undefined;
};
export type routeUserFollowMutation = {
  rawResponse: routeUserFollowMutation$rawResponse;
  response: routeUserFollowMutation$data;
  variables: routeUserFollowMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "userId",
    "variableName": "userId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowing",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeUserFollowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "ToggleFollow",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "RequiredField",
            "field": (v3/*: any*/),
            "action": "LOG"
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "routeUserFollowMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "ToggleFollow",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "981bd611934c11a59f67b11804b2d23e",
    "id": null,
    "metadata": {},
    "name": "routeUserFollowMutation",
    "operationKind": "mutation",
    "text": "mutation routeUserFollowMutation(\n  $userId: Int!\n) {\n  ToggleFollow(userId: $userId) {\n    id\n    name\n    isFollowing\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "65a8058b2f91116dbfc49c5708f08df9";
}

export default node;
