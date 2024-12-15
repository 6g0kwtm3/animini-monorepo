/**
 * @generated SignedSource<<3666a70db8c2a56af51a0193a5175fd3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type MediaListStatus = "COMPLETED" | "CURRENT" | "DROPPED" | "PAUSED" | "PLANNING" | "REPEATING" | "%future added value";
export type routeUserSetStatusMutation$variables = {
  mediaId: number;
  status: MediaListStatus;
};
export type routeUserSetStatusMutation$data = {
  readonly SaveMediaListEntry: {
    readonly id: number;
    readonly progress: number | null | undefined;
  } | null | undefined;
};
export type routeUserSetStatusMutation$rawResponse = {
  readonly SaveMediaListEntry: {
    readonly id: number;
    readonly progress: number | null | undefined;
  } | null | undefined;
};
export type routeUserSetStatusMutation = {
  rawResponse: routeUserSetStatusMutation$rawResponse;
  response: routeUserSetStatusMutation$data;
  variables: routeUserSetStatusMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "mediaId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "status"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "mediaId",
        "variableName": "mediaId"
      },
      {
        "kind": "Variable",
        "name": "status",
        "variableName": "status"
      }
    ],
    "concreteType": "MediaList",
    "kind": "LinkedField",
    "name": "SaveMediaListEntry",
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
        "name": "progress",
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
    "name": "routeUserSetStatusMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "routeUserSetStatusMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "82fb4bcb21fb46d3f9e1018709e42f38",
    "id": null,
    "metadata": {},
    "name": "routeUserSetStatusMutation",
    "operationKind": "mutation",
    "text": "mutation routeUserSetStatusMutation(\n  $mediaId: Int!\n  $status: MediaListStatus!\n) {\n  SaveMediaListEntry(mediaId: $mediaId, status: $status) {\n    id\n    progress\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "8f181158c7e02895840752ff647be3ed";
}

export default node;
