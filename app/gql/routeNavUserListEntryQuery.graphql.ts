/**
 * @generated SignedSource<<2f8656672c9a76da1a3b42d668901983>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavUserListEntryQuery$variables = {
  id: number;
  userName: string;
};
export type routeNavUserListEntryQuery$data = {
  readonly MediaList: {
    readonly " $fragmentSpreads": FragmentRefs<"routeSidePanel_entry">;
  };
} | null | undefined;
export type routeNavUserListEntryQuery = {
  response: routeNavUserListEntryQuery$data;
  variables: routeNavUserListEntryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userName"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  },
  {
    "kind": "Variable",
    "name": "userName",
    "variableName": "userName"
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
  "name": "episodes",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chapters",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v7 = {
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
    (v6/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavUserListEntryQuery",
    "selections": [
      {
        "kind": "RequiredField",
        "field": {
          "alias": null,
          "args": (v2/*: any*/),
          "concreteType": "MediaList",
          "kind": "LinkedField",
          "name": "MediaList",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "routeSidePanel_entry"
            }
          ],
          "storageKey": null
        },
        "action": "LOG"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "routeNavUserListEntryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "MediaList",
        "kind": "LinkedField",
        "name": "MediaList",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "score",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "progress",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Media",
            "kind": "LinkedField",
            "name": "media",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
              (v4/*: any*/),
              {
                "name": "avalible",
                "args": null,
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": [
                        {
                          "kind": "Literal",
                          "name": "version",
                          "value": 2
                        }
                      ],
                      "kind": "ScalarField",
                      "name": "status",
                      "storageKey": "status(version:2)"
                    },
                    (v4/*: any*/),
                    (v5/*: any*/),
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "AiringSchedule",
                      "kind": "LinkedField",
                      "name": "nextAiringEpisode",
                      "plural": false,
                      "selections": [
                        (v3/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "episode",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    (v3/*: any*/)
                  ],
                  "type": "Media",
                  "abstractKey": null
                },
                "kind": "RelayResolver",
                "storageKey": null,
                "isOutputType": true
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaCoverImage",
                "kind": "LinkedField",
                "name": "coverImage",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "name": "src",
                    "args": null,
                    "fragment": (v7/*: any*/),
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  },
                  {
                    "name": "srcset",
                    "args": null,
                    "fragment": (v7/*: any*/),
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  }
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6ad763593862a0833029e6380ec4d0de",
    "id": null,
    "metadata": {},
    "name": "routeNavUserListEntryQuery",
    "operationKind": "query",
    "text": "query routeNavUserListEntryQuery(\n  $userName: String!\n  $id: Int!\n) {\n  MediaList(userName: $userName, id: $id) {\n    ...routeSidePanel_entry\n  }\n}\n\nfragment Avalible_media on Media {\n  status(version: 2)\n  episodes\n  chapters\n  nextAiringEpisode {\n    id\n    episode\n  }\n  id\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment Progress_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    episodes\n    chapters\n    ...Avalible_media\n  }\n}\n\nfragment routeSidePanel_entry on MediaList {\n  id\n  status\n  score\n  progress\n  media {\n    id\n    title {\n      userPreferred\n    }\n    episodes\n    ...Avalible_media\n    ...MediaCover_media\n  }\n  ...Progress_entry\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "f2104135e05261c191c92205ec1074e6";
}

export default node;
