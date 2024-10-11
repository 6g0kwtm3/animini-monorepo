/**
 * @generated SignedSource<<98e8104dc8dc1ef62d1a567706552818>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type routeNavNotificationsReadQuery$variables = Record<PropertyKey, never>;
export type routeNavNotificationsReadQuery$data = {
  readonly Page: {
    readonly notifications: ReadonlyArray<{
      readonly __typename: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavNotificationsReadQuery$rawResponse = {
  readonly Page: {
    readonly notifications: ReadonlyArray<{
      readonly __typename: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavNotificationsReadQuery = {
  rawResponse: routeNavNotificationsReadQuery$rawResponse;
  response: routeNavNotificationsReadQuery$data;
  variables: routeNavNotificationsReadQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "perPage",
        "value": 0
      }
    ],
    "concreteType": "Page",
    "kind": "LinkedField",
    "name": "Page",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "resetNotificationCount",
            "value": true
          }
        ],
        "concreteType": null,
        "kind": "LinkedField",
        "name": "notifications",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": "notifications(resetNotificationCount:true)"
      }
    ],
    "storageKey": "Page(perPage:0)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavNotificationsReadQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "routeNavNotificationsReadQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "016191fb1daecf626f1e630ff1db3e51",
    "id": null,
    "metadata": {},
    "name": "routeNavNotificationsReadQuery",
    "operationKind": "query",
    "text": "query routeNavNotificationsReadQuery {\n  Page(perPage: 0) {\n    notifications(resetNotificationCount: true) {\n      __typename\n    }\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "f2ac2ea4c9bed75f142c66590cf45ca6";
}

export default node;
