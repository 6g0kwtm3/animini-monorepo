/**
 * @generated SignedSource<<4cdd1c00675235e6a91c4e57a0ce668f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavIndexQuery$variables = Record<PropertyKey, never>;
export type routeNavIndexQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"routeNavIndexQuery_query">;
};
export type routeNavIndexQuery$rawResponse = {
  readonly Page: {
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
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavIndexQuery = {
  rawResponse: routeNavIndexQuery$rawResponse;
  response: routeNavIndexQuery$data;
  variables: routeNavIndexQuery$variables;
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
    "name": "routeNavIndexQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "routeNavIndexQuery_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "routeNavIndexQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Page",
        "kind": "LinkedField",
        "name": "Page",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
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
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "86556fc10abafb9de26c41bb18340066",
    "id": null,
    "metadata": {},
    "name": "routeNavIndexQuery",
    "operationKind": "query",
    "text": "query routeNavIndexQuery {\n  ...routeNavIndexQuery_query\n}\n\nfragment MediaCover_media_3HwoU6 on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment routeMediaCarouselItem_media on Media {\n  id\n  title {\n    ...MediaTitle_mediaTitle\n  }\n  ...MediaCover_media_3HwoU6\n}\n\nfragment routeNavIndexQuery_query on Query {\n  Page {\n    media {\n      id\n      ...routeMediaCarouselItem_media\n    }\n  }\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "37f7081d9ea35a8a5c100a0bfcb24a75";
}

export default node;
