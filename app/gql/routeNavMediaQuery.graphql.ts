/**
 * @generated SignedSource<<3206de0e0497355dbc22077b0e9f549c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavMediaQuery$variables = {
  id: number;
};
export type routeNavMediaQuery$data = {
  readonly Media: {
    readonly bannerImage: string | null | undefined;
    readonly coverImage: {
      readonly color: string | null | undefined;
    } | null | undefined;
    readonly description: string | null | undefined;
    readonly id: number;
    readonly title: {
      readonly userPreferred: string;
      readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
    };
    readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  } | null | undefined;
};
export type routeNavMediaQuery$rawResponse = {
  readonly Media: {
    readonly bannerImage: string | null | undefined;
    readonly coverImage: {
      readonly color: string | null | undefined;
      readonly extraLarge: string | null | undefined;
      readonly large: string | null | undefined;
      readonly medium: string | null | undefined;
    } | {
      readonly color: string | null | undefined;
      readonly medium: string | null | undefined;
    } | null | undefined;
    readonly description: string | null | undefined;
    readonly id: number;
    readonly title: {
      readonly userPreferred: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type routeNavMediaQuery = {
  rawResponse: routeNavMediaQuery$rawResponse;
  response: routeNavMediaQuery$data;
  variables: routeNavMediaQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
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
  "name": "color",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bannerImage",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "userPreferred",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v8 = {
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
    (v7/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavMediaQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Media",
        "kind": "LinkedField",
        "name": "Media",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "MediaCoverImage",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v4/*: any*/),
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
                  "kind": "RequiredField",
                  "field": (v5/*: any*/),
                  "action": "LOG",
                  "path": "Media.title.userPreferred"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "MediaTitle_mediaTitle"
                }
              ],
              "storageKey": null
            },
            "action": "LOG",
            "path": "Media.title"
          },
          (v6/*: any*/),
          {
            "args": [
              {
                "kind": "Literal",
                "name": "extraLarge",
                "value": true
              }
            ],
            "kind": "FragmentSpread",
            "name": "MediaCover_media"
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
    "name": "routeNavMediaQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Media",
        "kind": "LinkedField",
        "name": "Media",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "MediaCoverImage",
            "kind": "LinkedField",
            "name": "coverImage",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v7/*: any*/),
              {
                "name": "src",
                "args": null,
                "fragment": (v8/*: any*/),
                "kind": "RelayResolver",
                "storageKey": null,
                "isOutputType": true
              },
              {
                "name": "srcset",
                "args": null,
                "fragment": (v8/*: any*/),
                "kind": "RelayResolver",
                "storageKey": null,
                "isOutputType": true
              }
            ],
            "storageKey": null
          },
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "MediaTitle",
            "kind": "LinkedField",
            "name": "title",
            "plural": false,
            "selections": [
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5b96f220b91adce90600e0e63ba62460",
    "id": null,
    "metadata": {},
    "name": "routeNavMediaQuery",
    "operationKind": "query",
    "text": "query routeNavMediaQuery(\n  $id: Int!\n) {\n  Media(id: $id) {\n    id\n    coverImage {\n      color\n    }\n    bannerImage\n    title {\n      userPreferred\n      ...MediaTitle_mediaTitle\n    }\n    description\n    ...MediaCover_media_3HwoU6\n  }\n}\n\nfragment MediaCover_media_3HwoU6 on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "ef7a0e00f1bf565633389154eea3bae5";
}

export default node;
