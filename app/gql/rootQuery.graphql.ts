/**
 * @generated SignedSource<<89525aa33d843229aafa8b71507f8193>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type rootQuery$variables = Record<PropertyKey, never>;
export type rootQuery$data = {
  readonly Viewer: {
    readonly id: number;
    readonly name: string;
    readonly unreadNotificationCount: number | null | undefined;
  } | null | undefined;
};
export type rootQuery$rawResponse = {
  readonly Viewer: {
    readonly id: number;
    readonly name: string;
    readonly unreadNotificationCount: number | null | undefined;
  } | null | undefined;
};
export type rootQuery = {
  rawResponse: rootQuery$rawResponse;
  response: rootQuery$data;
  variables: rootQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "Viewer",
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
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "unreadNotificationCount",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "rootQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "rootQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "8058608655a2b4b7a99a1ae18079308c",
    "id": null,
    "metadata": {},
    "name": "rootQuery",
    "operationKind": "query",
    "text": "query rootQuery {\n  Viewer {\n    id\n    name\n    unreadNotificationCount\n  }\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "2d126b06eb1ae5b6c1667d90ab8fca28";
}

export default node;
