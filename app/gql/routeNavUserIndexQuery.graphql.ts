/**
 * @generated SignedSource<<cc4803d5ebb16335d1ecb057a3196658>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type routeNavUserIndexQuery$variables = {
  userName: string;
};
export type routeNavUserIndexQuery$data = {
  readonly User: {
    readonly about: string | null | undefined;
    readonly id: number;
  } | null | undefined;
};
export type routeNavUserIndexQuery$rawResponse = {
  readonly User: {
    readonly about: string | null | undefined;
    readonly id: number;
  } | null | undefined;
};
export type routeNavUserIndexQuery = {
  rawResponse: routeNavUserIndexQuery$rawResponse;
  response: routeNavUserIndexQuery$data;
  variables: routeNavUserIndexQuery$variables;
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
        "name": "about",
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
    "name": "routeNavUserIndexQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "routeNavUserIndexQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2bb674b7bc0824872327c37c243be8a1",
    "id": null,
    "metadata": {},
    "name": "routeNavUserIndexQuery",
    "operationKind": "query",
    "text": "query routeNavUserIndexQuery(\n  $userName: String!\n) {\n  User(name: $userName) {\n    id\n    about\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "ea30fbc2d60acb1e012db34a38961176";
}

export default node;
