/**
 * @generated SignedSource<<f8e7770075aeb95ee9f9e778e8d87855>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteUpdatableQuery } from 'relay-runtime';
export type routeNavNotificationsUpdateQuery$variables = Record<PropertyKey, never>;
export type routeNavNotificationsUpdateQuery$data = {
  get Viewer(): {
    unreadNotificationCount: number | null | undefined;
  } | null | undefined;
  set Viewer(value: null | undefined);
};
export type routeNavNotificationsUpdateQuery = {
  response: routeNavNotificationsUpdateQuery$data;
  variables: routeNavNotificationsUpdateQuery$variables;
};

const node: ConcreteUpdatableQuery = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavNotificationsUpdateQuery",
    "selections": [
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
            "name": "unreadNotificationCount",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "UpdatableQuery"
};

if (import.meta.env.DEV) {
  (node as any).hash = "a0dcfdd18fcdf7d40fbcfa2359cbec3f";
}

export default node;
