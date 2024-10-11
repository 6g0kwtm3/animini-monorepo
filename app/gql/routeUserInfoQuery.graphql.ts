/**
 * @generated SignedSource<<02d6f267415d191fe947abe6b4f29686>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type routeUserInfoQuery$variables = {
  userName: string;
};
export type routeUserInfoQuery$data = {
  readonly User: {
    readonly avatar: {
      readonly large: string | null | undefined;
      readonly medium: string | null | undefined;
    } | null | undefined;
    readonly donatorBadge: string | null | undefined;
    readonly id: number;
    readonly isFollower: boolean | null | undefined;
    readonly isFollowing: boolean | null | undefined;
  } | null | undefined;
};
export type routeUserInfoQuery$rawResponse = {
  readonly User: {
    readonly avatar: {
      readonly large: string | null | undefined;
      readonly medium: string | null | undefined;
    } | null | undefined;
    readonly donatorBadge: string | null | undefined;
    readonly id: number;
    readonly isFollower: boolean | null | undefined;
    readonly isFollowing: boolean | null | undefined;
  } | null | undefined;
};
export type routeUserInfoQuery = {
  rawResponse: routeUserInfoQuery$rawResponse;
  response: routeUserInfoQuery$data;
  variables: routeUserInfoQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userName"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "userName"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "User",
    "plural": false,
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
        "name": "isFollower",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isFollowing",
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
            "name": "medium",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "large",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "donatorBadge",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeUserInfoQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "routeUserInfoQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e4fbd3b5b83ae1d6f8a6981df4809f9b",
    "id": null,
    "metadata": {},
    "name": "routeUserInfoQuery",
    "operationKind": "query",
    "text": "query routeUserInfoQuery(\n  $userName: String!\n) {\n  User(name: $userName) {\n    id\n    isFollower\n    isFollowing\n    avatar {\n      medium\n      large\n    }\n    donatorBadge\n  }\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "baecefe4b5ceb7dd4c8e95f815b8d314";
}

export default node;
