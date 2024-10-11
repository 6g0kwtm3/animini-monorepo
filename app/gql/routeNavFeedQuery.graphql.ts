/**
 * @generated SignedSource<<91ffc0660e0341afbe7d72dda86dbb0d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type routeNavFeedQuery$variables = Record<PropertyKey, never>;
export type routeNavFeedQuery$data = {
  readonly Page: {
    readonly activities: ReadonlyArray<{
      readonly __typename: "TextActivity";
      readonly createdAt: number;
      readonly id: number;
      readonly text: string | null | undefined;
      readonly user: {
        readonly avatar: {
          readonly large: string | null | undefined;
          readonly medium: string | null | undefined;
        } | null | undefined;
        readonly id: number;
        readonly name: string;
      } | null | undefined;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavFeedQuery$rawResponse = {
  readonly Page: {
    readonly activities: ReadonlyArray<{
      readonly __typename: "TextActivity";
      readonly createdAt: number;
      readonly id: number;
      readonly text: string | null | undefined;
      readonly user: {
        readonly avatar: {
          readonly large: string | null | undefined;
          readonly medium: string | null | undefined;
        } | null | undefined;
        readonly id: number;
        readonly name: string;
      } | null | undefined;
    } | {
      readonly __typename: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavFeedQuery = {
  rawResponse: routeNavFeedQuery$rawResponse;
  response: routeNavFeedQuery$data;
  variables: routeNavFeedQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "perPage",
        "value": 10
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
            "name": "sort",
            "value": [
              "ID_DESC"
            ]
          },
          {
            "kind": "Literal",
            "name": "type_in",
            "value": [
              "TEXT"
            ]
          }
        ],
        "concreteType": null,
        "kind": "LinkedField",
        "name": "activities",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "InlineFragment",
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
                "name": "text",
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
            "type": "TextActivity",
            "abstractKey": null
          }
        ],
        "storageKey": "activities(sort:[\"ID_DESC\"],type_in:[\"TEXT\"])"
      }
    ],
    "storageKey": "Page(perPage:10)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavFeedQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "routeNavFeedQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "96196dca2747c11082043948f199ac3b",
    "id": null,
    "metadata": {},
    "name": "routeNavFeedQuery",
    "operationKind": "query",
    "text": "query routeNavFeedQuery {\n  Page(perPage: 10) {\n    activities(sort: [ID_DESC], type_in: [TEXT]) {\n      __typename\n      ... on TextActivity {\n        id\n        createdAt\n        text\n        user {\n          id\n          name\n          avatar {\n            large\n            medium\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "5e35085293df789b6b9cb32aad547e7a";
}

export default node;
