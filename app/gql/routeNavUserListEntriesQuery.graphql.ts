/**
 * @generated SignedSource<<4b446fd80688110795141d87c5f166c8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaFormat = "MANGA" | "MOVIE" | "MUSIC" | "NOVEL" | "ONA" | "ONE_SHOT" | "OVA" | "SPECIAL" | "TV" | "TV_SHORT" | "%future added value";
export type MediaListStatus = "COMPLETED" | "CURRENT" | "DROPPED" | "PAUSED" | "PLANNING" | "REPEATING" | "%future added value";
export type MediaStatus = "CANCELLED" | "FINISHED" | "HIATUS" | "NOT_YET_RELEASED" | "RELEASING" | "%future added value";
export type MediaType = "ANIME" | "MANGA" | "%future added value";
export type ScoreFormat = "POINT_10" | "POINT_100" | "POINT_10_DECIMAL" | "POINT_3" | "POINT_5" | "%future added value";
export type routeNavUserListEntriesQuery$variables = {
  type: MediaType;
  userName: string;
};
export type routeNavUserListEntriesQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"routeAwaitQuery_query">;
};
export type routeNavUserListEntriesQuery$rawResponse = {
  readonly MediaListCollection: {
    readonly lists: ReadonlyArray<{
      readonly entries: ReadonlyArray<{
        readonly completedAt: {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | null | undefined;
        readonly id: number;
        readonly media: {
          readonly averageScore: number | null | undefined;
          readonly chapters: number | null | undefined;
          readonly coverImage: {
            readonly extraLarge: string | null | undefined;
            readonly large: string | null | undefined;
            readonly medium: string | null | undefined;
          } | {
            readonly medium: string | null | undefined;
          } | null | undefined;
          readonly duration?: number | null | undefined;
          readonly endDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly episodes: number | null | undefined;
          readonly format: MediaFormat | null | undefined;
          readonly id: number;
          readonly nextAiringEpisode: {
            readonly episode: number;
            readonly id: number;
          } | null | undefined;
          readonly popularity: number | null | undefined;
          readonly startDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly status: MediaStatus | null | undefined;
          readonly tags: ReadonlyArray<{
            readonly id: number;
            readonly name: string;
          } | null | undefined> | null | undefined;
          readonly title: {
            readonly userPreferred: string | null | undefined;
          } | null | undefined;
          readonly type: MediaType | null | undefined;
        } | {
          readonly averageScore: number | null | undefined;
          readonly chapters: number | null | undefined;
          readonly coverImage: {
            readonly extraLarge: string | null | undefined;
            readonly large: string | null | undefined;
            readonly medium: string | null | undefined;
          } | {
            readonly medium: string | null | undefined;
          } | null | undefined;
          readonly duration?: number | null | undefined;
          readonly endDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly episodes: number | null | undefined;
          readonly format: MediaFormat | null | undefined;
          readonly id: number;
          readonly popularity: number | null | undefined;
          readonly startDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly status: MediaStatus | null | undefined;
          readonly tags: ReadonlyArray<{
            readonly id: number;
            readonly name: string;
          } | null | undefined> | null | undefined;
          readonly title: {
            readonly userPreferred: string | null | undefined;
          } | null | undefined;
          readonly type: MediaType | null | undefined;
        } | null | undefined;
        readonly progress: number | null | undefined;
        readonly score: number | null | undefined;
        readonly startedAt: {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | null | undefined;
        readonly status: MediaListStatus | null | undefined;
        readonly updatedAt: number | null | undefined;
      } | {
        readonly completedAt: {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | null | undefined;
        readonly id: number;
        readonly media: {
          readonly averageScore: number | null | undefined;
          readonly chapters: number | null | undefined;
          readonly coverImage: {
            readonly extraLarge: string | null | undefined;
            readonly large: string | null | undefined;
            readonly medium: string | null | undefined;
          } | {
            readonly medium: string | null | undefined;
          } | null | undefined;
          readonly endDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly episodes: number | null | undefined;
          readonly format: MediaFormat | null | undefined;
          readonly id: number;
          readonly nextAiringEpisode: {
            readonly episode: number;
            readonly id: number;
          } | null | undefined;
          readonly popularity: number | null | undefined;
          readonly startDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly status: MediaStatus | null | undefined;
          readonly tags: ReadonlyArray<{
            readonly id: number;
            readonly name: string;
          } | null | undefined> | null | undefined;
          readonly title: {
            readonly userPreferred: string | null | undefined;
          } | null | undefined;
          readonly type: MediaType | null | undefined;
        } | {
          readonly averageScore: number | null | undefined;
          readonly chapters: number | null | undefined;
          readonly coverImage: {
            readonly extraLarge: string | null | undefined;
            readonly large: string | null | undefined;
            readonly medium: string | null | undefined;
          } | {
            readonly medium: string | null | undefined;
          } | null | undefined;
          readonly endDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly episodes: number | null | undefined;
          readonly format: MediaFormat | null | undefined;
          readonly id: number;
          readonly popularity: number | null | undefined;
          readonly startDate: {
            readonly day: number | null | undefined;
            readonly month: number | null | undefined;
            readonly year: number | null | undefined;
          } | null | undefined;
          readonly status: MediaStatus | null | undefined;
          readonly tags: ReadonlyArray<{
            readonly id: number;
            readonly name: string;
          } | null | undefined> | null | undefined;
          readonly title: {
            readonly userPreferred: string | null | undefined;
          } | null | undefined;
          readonly type: MediaType | null | undefined;
        } | null | undefined;
        readonly progress: number | null | undefined;
        readonly score: number | null | undefined;
        readonly startedAt: {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | null | undefined;
        readonly status: MediaListStatus | null | undefined;
        readonly updatedAt: number | null | undefined;
      } | null | undefined> | null | undefined;
      readonly name: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly user: {
      readonly id: number;
      readonly mediaListOptions: {
        readonly rowOrder: string | null | undefined;
        readonly scoreFormat: ScoreFormat | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type routeNavUserListEntriesQuery = {
  rawResponse: routeNavUserListEntriesQuery$rawResponse;
  response: routeNavUserListEntriesQuery$data;
  variables: routeNavUserListEntriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "type"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userName"
},
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "progress",
  "storageKey": null
},
v5 = {
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "year",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "month",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "day",
  "storageKey": null
},
v9 = [
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v11 = {
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
    (v10/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "episodes",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chapters",
  "storageKey": null
},
v14 = {
  "name": "avalible",
  "args": null,
  "fragment": {
    "kind": "InlineFragment",
    "selections": [
      (v5/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "AiringSchedule",
        "kind": "LinkedField",
        "name": "nextAiringEpisode",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
      (v2/*: any*/)
    ],
    "type": "Media",
    "abstractKey": null
  },
  "kind": "RelayResolver",
  "storageKey": null,
  "isOutputType": true
},
v15 = {
  "name": "behind",
  "args": null,
  "fragment": {
    "kind": "InlineFragment",
    "selections": [
      (v4/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Media",
        "kind": "LinkedField",
        "name": "media",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v14/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "MediaList",
    "abstractKey": null
  },
  "kind": "RelayResolver",
  "storageKey": null,
  "isOutputType": true
},
v16 = [
  (v6/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/),
  {
    "name": "date",
    "args": null,
    "fragment": {
      "kind": "InlineFragment",
      "selections": [
        (v8/*: any*/),
        (v7/*: any*/),
        (v6/*: any*/)
      ],
      "type": "FuzzyDate",
      "abstractKey": null
    },
    "kind": "RelayResolver",
    "storageKey": null,
    "isOutputType": true
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavUserListEntriesQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "routeAwaitQuery_query"
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
    "name": "routeNavUserListEntriesQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "type",
            "variableName": "type"
          },
          {
            "kind": "Variable",
            "name": "userName",
            "variableName": "userName"
          }
        ],
        "concreteType": "MediaListCollection",
        "kind": "LinkedField",
        "name": "MediaListCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaListOptions",
                "kind": "LinkedField",
                "name": "mediaListOptions",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "rowOrder",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "scoreFormat",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "MediaListGroup",
            "kind": "LinkedField",
            "name": "lists",
            "plural": true,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaList",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
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
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Media",
                    "kind": "LinkedField",
                    "name": "media",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "MediaTag",
                        "kind": "LinkedField",
                        "name": "tags",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "format",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "popularity",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FuzzyDate",
                        "kind": "LinkedField",
                        "name": "startDate",
                        "plural": false,
                        "selections": (v9/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FuzzyDate",
                        "kind": "LinkedField",
                        "name": "endDate",
                        "plural": false,
                        "selections": (v9/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "averageScore",
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
                          (v10/*: any*/),
                          {
                            "name": "src",
                            "args": null,
                            "fragment": (v11/*: any*/),
                            "kind": "RelayResolver",
                            "storageKey": null,
                            "isOutputType": true
                          },
                          {
                            "name": "srcset",
                            "args": null,
                            "fragment": (v11/*: any*/),
                            "kind": "RelayResolver",
                            "storageKey": null,
                            "isOutputType": true
                          }
                        ],
                        "storageKey": null
                      },
                      (v12/*: any*/),
                      (v13/*: any*/),
                      (v14/*: any*/),
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "type",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "name": "toWatch",
                    "args": null,
                    "fragment": {
                      "kind": "InlineFragment",
                      "selections": [
                        (v15/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Media",
                          "kind": "LinkedField",
                          "name": "media",
                          "plural": false,
                          "selections": [
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "duration",
                              "storageKey": null
                            },
                            (v2/*: any*/)
                          ],
                          "storageKey": null
                        },
                        (v2/*: any*/)
                      ],
                      "type": "MediaList",
                      "abstractKey": null
                    },
                    "kind": "RelayResolver",
                    "storageKey": null,
                    "isOutputType": true
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FuzzyDate",
                    "kind": "LinkedField",
                    "name": "startedAt",
                    "plural": false,
                    "selections": (v16/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FuzzyDate",
                    "kind": "LinkedField",
                    "name": "completedAt",
                    "plural": false,
                    "selections": (v16/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "updatedAt",
                    "storageKey": null
                  },
                  (v15/*: any*/)
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
    "cacheID": "958e9ba6e6d8aa9c7e3e1943ce948f2a",
    "id": null,
    "metadata": {},
    "name": "routeNavUserListEntriesQuery",
    "operationKind": "query",
    "text": "query routeNavUserListEntriesQuery(\n  $userName: String!\n  $type: MediaType!\n) {\n  ...routeAwaitQuery_query\n}\n\nfragment Avalible_media on Media {\n  status(version: 2)\n  episodes\n  chapters\n  nextAiringEpisode {\n    id\n    episode\n  }\n  id\n}\n\nfragment Behind_entry on MediaList {\n  progress\n  media {\n    id\n    ...Avalible_media\n  }\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaListItemDate_entry on MediaList {\n  id\n  completedAt {\n    ...date_date\n  }\n  startedAt {\n    ...date_date\n  }\n}\n\nfragment MediaListItemInfo_entry on MediaList {\n  id\n}\n\nfragment MediaListItemScore_entry on MediaList {\n  id\n  score\n}\n\nfragment MediaListItemScore_user on User {\n  id\n  mediaListOptions {\n    scoreFormat\n  }\n}\n\nfragment MediaListItemSubtitle_entry on MediaList {\n  id\n  score\n  media {\n    id\n    type\n    ...ProgressTooltip_media\n  }\n  ...ToWatch_entry\n  ...Progress_entry\n  ...MediaListItemScore_entry\n}\n\nfragment MediaListItemTitle_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    title {\n      userPreferred\n      ...MediaTitle_mediaTitle\n    }\n  }\n}\n\nfragment MediaListItem_entry on MediaList {\n  id\n  media {\n    id\n    ...MediaCover_media\n  }\n  ...MediaListItemDate_entry\n  ...ProgressIncrement_entry\n  ...Progress_entry\n  ...MediaListItemTitle_entry\n  ...MediaListItemSubtitle_entry\n  ...MediaListItemInfo_entry\n  ...MediaListItemScore_entry\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment ProgressIncrement_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    ...ProgressTooltip_media\n  }\n  ...Progress_entry\n}\n\nfragment ProgressTooltip_media on Media {\n  id\n  episodes\n  chapters\n  ...Avalible_media\n}\n\nfragment Progress_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    episodes\n    chapters\n    ...Avalible_media\n  }\n}\n\nfragment ToWatch_entry on MediaList {\n  ...Behind_entry\n  media {\n    duration\n    id\n  }\n  id\n}\n\nfragment date_date on FuzzyDate {\n  day\n  month\n  year\n}\n\nfragment isVisible_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    status(version: 2)\n    format\n  }\n  ...ToWatch_entry\n}\n\nfragment routeAwaitQuery_query on Query {\n  MediaListCollection(userName: $userName, type: $type) {\n    user {\n      id\n      ...routeNavUserListEntriesSort_user\n      ...MediaListItemScore_user\n    }\n    lists {\n      name\n      entries {\n        id\n        ...routeIsQuery_entry\n        ...isVisible_entry\n        ...routeNavUserListEntriesSort_entries\n        ...MediaListItem_entry\n        ...routeSidePanel_entry\n      }\n    }\n  }\n}\n\nfragment routeFuzzyDateOrder_fuzzyDate on FuzzyDate {\n  year\n  month\n  day\n}\n\nfragment routeIsQuery_entry on MediaList {\n  id\n  status\n  score\n  progress\n  media {\n    id\n    status(version: 2)\n    tags {\n      id\n      name\n    }\n  }\n  ...ToWatch_entry\n}\n\nfragment routeNavUserListEntriesSort_entries on MediaList {\n  id\n  progress\n  score\n  startedAt {\n    ...routeFuzzyDateOrder_fuzzyDate\n  }\n  completedAt {\n    ...routeFuzzyDateOrder_fuzzyDate\n  }\n  media {\n    id\n    popularity\n    startDate {\n      ...routeFuzzyDateOrder_fuzzyDate\n    }\n    endDate {\n      ...routeFuzzyDateOrder_fuzzyDate\n    }\n    averageScore\n    status(version: 2)\n    title {\n      userPreferred\n    }\n  }\n  updatedAt\n  ...ToWatch_entry\n  ...Behind_entry\n  ...MediaListItem_entry\n}\n\nfragment routeNavUserListEntriesSort_user on User {\n  id\n  mediaListOptions {\n    rowOrder\n  }\n}\n\nfragment routeSidePanel_entry on MediaList {\n  id\n  status\n  score\n  progress\n  media {\n    id\n    title {\n      userPreferred\n    }\n    episodes\n    ...Avalible_media\n    ...MediaCover_media\n  }\n  ...Progress_entry\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "189580d164bb93888afda64365cf0e63";
}

export default node;
