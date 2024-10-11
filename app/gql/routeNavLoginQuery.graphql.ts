/**
 * @generated SignedSource<<206733874b5cfc74e273e69eb7ca370b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type routeNavLoginQuery$variables = Record<PropertyKey, never>;
export type routeNavLoginQuery$data = {
  readonly Viewer: {
    readonly id: number;
    readonly name: string;
  } | null | undefined;
};
export type routeNavLoginQuery$rawResponse = {
  readonly Viewer: {
    readonly id: number;
    readonly name: string;
  } | null | undefined;
};
export type routeNavLoginQuery = {
  rawResponse: routeNavLoginQuery$rawResponse;
  response: routeNavLoginQuery$data;
  variables: routeNavLoginQuery$variables;
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
    "name": "routeNavLoginQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "routeNavLoginQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "74fa100316d51e5435e9754baf17233c",
    "id": null,
    "metadata": {},
    "name": "routeNavLoginQuery",
    "operationKind": "query",
    "text": "query routeNavLoginQuery {\n  Viewer {\n    id\n    name\n  }\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "e112425f53145923339425c592f782ee";
}

export default node;
