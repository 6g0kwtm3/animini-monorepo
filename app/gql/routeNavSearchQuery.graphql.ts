/**
 * @generated SignedSource<<80eab392e16cb234e93af30a5e71589a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaSort = "CHAPTERS" | "CHAPTERS_DESC" | "DURATION" | "DURATION_DESC" | "END_DATE" | "END_DATE_DESC" | "EPISODES" | "EPISODES_DESC" | "FAVOURITES" | "FAVOURITES_DESC" | "FORMAT" | "FORMAT_DESC" | "ID" | "ID_DESC" | "POPULARITY" | "POPULARITY_DESC" | "SCORE" | "SCORE_DESC" | "SEARCH_MATCH" | "START_DATE" | "START_DATE_DESC" | "STATUS" | "STATUS_DESC" | "TITLE_ENGLISH" | "TITLE_ENGLISH_DESC" | "TITLE_NATIVE" | "TITLE_NATIVE_DESC" | "TITLE_ROMAJI" | "TITLE_ROMAJI_DESC" | "TRENDING" | "TRENDING_DESC" | "TYPE" | "TYPE_DESC" | "UPDATED_AT" | "UPDATED_AT_DESC" | "VOLUMES" | "VOLUMES_DESC" | "%future added value";
export type MediaType = "ANIME" | "MANGA" | "%future added value";
export type routeNavSearchQuery$variables = {
  q?: string | null | undefined;
  sort?: ReadonlyArray<MediaSort | null | undefined> | null | undefined;
};
export type routeNavSearchQuery$data = {
  readonly page: {
    readonly media: ReadonlyArray<{
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"SearchItem_media">;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavSearchQuery$rawResponse = {
  readonly page: {
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
export type routeNavSearchQuery = {
  rawResponse: routeNavSearchQuery$rawResponse;
  response: routeNavSearchQuery$data;
  variables: routeNavSearchQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "q"
  },
  {
    "defaultValue": [
      "POPULARITY_DESC",
      "SCORE_DESC"
    ],
    "kind": "LocalArgument",
    "name": "sort"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "perPage",
    "value": 10
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "search",
    "variableName": "q"
  },
  {
    "kind": "Variable",
    "name": "sort",
    "variableName": "sort"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v5 = {
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
    (v4/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavSearchQuery",
    "selections": [
      {
        "alias": "page",
        "args": (v1/*: any*/),
        "concreteType": "Page",
        "kind": "LinkedField",
        "name": "Page",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "SearchItem_media"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "Page(perPage:10)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "routeNavSearchQuery",
    "selections": [
      {
        "alias": "page",
        "args": (v1/*: any*/),
        "concreteType": "Page",
        "kind": "LinkedField",
        "name": "Page",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": true,
            "selections": [
              (v3/*: any*/),
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
                  (v4/*: any*/),
                  {
                    "name": "src",
                    "args": null,
                    "fragment": (v5/*: any*/),
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  },
                  {
                    "name": "srcset",
                    "args": null,
                    "fragment": (v5/*: any*/),
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
        "storageKey": "Page(perPage:10)"
      }
    ]
  },
  "params": {
    "cacheID": "0d8b328ea8726ef5cfe1bd51624ecebb",
    "id": null,
    "metadata": {},
    "name": "routeNavSearchQuery",
    "operationKind": "query",
    "text": "query routeNavSearchQuery(\n  $q: String\n  $sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]\n) {\n  page: Page(perPage: 10) {\n    media(search: $q, sort: $sort) {\n      id\n      ...SearchItem_media\n    }\n  }\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment SearchItem_media on Media {\n  id\n  type\n  title {\n    ...MediaTitle_mediaTitle\n  }\n  ...MediaCover_media\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "4850ca9c8b2e170c422e69b458342ed7";
}

export default node;
