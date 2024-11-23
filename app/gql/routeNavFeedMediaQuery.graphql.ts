/**
 * @generated SignedSource<<53098521e54f0da748b58e09f165e67f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaType = "ANIME" | "MANGA" | "%future added value";
export type routeNavFeedMediaQuery$variables = {
  ids?: ReadonlyArray<number | null | undefined> | null | undefined;
};
export type routeNavFeedMediaQuery$data = {
  readonly Page: {
    readonly media: ReadonlyArray<{
      readonly coverImage: {
        readonly color: string | null | undefined;
      } | null | undefined;
      readonly id: number;
      readonly title: {
        readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
      };
      readonly type: MediaType | null | undefined;
      readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
    } | null | undefined> | null | undefined;
  } | null | undefined;
};
export type routeNavFeedMediaQuery$rawResponse = {
  readonly Page: {
    readonly media: ReadonlyArray<{
      readonly coverImage: {
        readonly color: string | null | undefined;
        readonly extraLarge: string | null | undefined;
        readonly large: string | null | undefined;
        readonly medium: string | null | undefined;
      } | {
        readonly color: string | null | undefined;
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
export type routeNavFeedMediaQuery = {
  rawResponse: routeNavFeedMediaQuery$rawResponse;
  response: routeNavFeedMediaQuery$data;
  variables: routeNavFeedMediaQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ids"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id_in",
    "variableName": "ids"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "color",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v6 = {
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
    (v5/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavFeedMediaQuery",
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
            "args": (v1/*: any*/),
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "RequiredField",
                "field": {
                  "alias": null,
                  "args": null,
                  "concreteType": "MediaTitle",
                  "kind": "LinkedField",
                  "name": "title",
                  "plural": false,
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "MediaTitle_mediaTitle"
                    }
                  ],
                  "storageKey": null
                },
                "action": "LOG"
              },
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaCoverImage",
                "kind": "LinkedField",
                "name": "coverImage",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "MediaCover_media"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "routeNavFeedMediaQuery",
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
            "args": (v1/*: any*/),
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": true,
            "selections": [
              (v2/*: any*/),
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
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaCoverImage",
                "kind": "LinkedField",
                "name": "coverImage",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "name": "src",
                    "args": null,
                    "fragment": (v6/*: any*/),
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  },
                  {
                    "name": "srcset",
                    "args": null,
                    "fragment": (v6/*: any*/),
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
    "cacheID": "7595662cb2f7ba46d49acd279059837b",
    "id": null,
    "metadata": {},
    "name": "routeNavFeedMediaQuery",
    "operationKind": "query",
    "text": "query routeNavFeedMediaQuery(\n  $ids: [Int]\n) {\n  Page {\n    media(id_in: $ids) {\n      id\n      title {\n        ...MediaTitle_mediaTitle\n      }\n      type\n      coverImage {\n        color\n      }\n      ...MediaCover_media\n    }\n  }\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "c4e2801b91f750ee4476d90aebf54db6";
}

export default node;
