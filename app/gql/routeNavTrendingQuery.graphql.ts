/**
 * @generated SignedSource<<4316c6d32c293670b89ec30252e4721b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaType = "ANIME" | "MANGA" | "%future added value";
export type routeNavTrendingQuery$variables = Record<PropertyKey, never>;
export type routeNavTrendingQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"SearchTrending_query">;
};
export type routeNavTrendingQuery$rawResponse = {
  readonly trending: {
    readonly media: ReadonlyArray<{
      readonly coverImage: {
        readonly extraLarge: string | null | undefined;
        readonly large: string | null | undefined;
        readonly medium: string | null | undefined;
      } | {
        readonly medium: string | null | undefined;
      } | null | undefined;
      readonly id: number;
      readonly title: {
        readonly userPreferred: string | null | undefined;
      } | null | undefined;
      readonly type: MediaType | null | undefined;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavTrendingQuery = {
  rawResponse: routeNavTrendingQuery$rawResponse;
  response: routeNavTrendingQuery$data;
  variables: routeNavTrendingQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v1 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "extraLarge",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "large",
      "storageKey": null
    },
    (v0/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavTrendingQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "SearchTrending_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "routeNavTrendingQuery",
    "selections": [
      {
        "alias": "trending",
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
                  "TRENDING_DESC"
                ]
              }
            ],
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": true,
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
                "name": "type",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaTitle",
                "kind": "LinkedField",
                "name": "title",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "userPreferred",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaCoverImage",
                "kind": "LinkedField",
                "name": "coverImage",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "name": "src",
                    "args": null,
                    "fragment": (v1/*: any*/),
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  },
                  {
                    "name": "srcset",
                    "args": null,
                    "fragment": (v1/*: any*/),
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "media(sort:[\"TRENDING_DESC\"])"
          }
        ],
        "storageKey": "Page(perPage:10)"
      }
    ]
  },
  "params": {
    "cacheID": "a2a8989c023645b0826b12d147fa8ddf",
    "id": null,
    "metadata": {},
    "name": "routeNavTrendingQuery",
    "operationKind": "query",
    "text": "query routeNavTrendingQuery {\n  ...SearchTrending_query\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment SearchItem_media on Media {\n  id\n  type\n  title {\n    ...MediaTitle_mediaTitle\n  }\n  ...MediaCover_media\n}\n\nfragment SearchTrending_query on Query {\n  trending: Page(perPage: 10) {\n    media(sort: [TRENDING_DESC]) {\n      id\n      ...SearchItem_media\n    }\n  }\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "3f46cf246cfd80cc9b8d47f38fefa6f0";
}

export default node;
