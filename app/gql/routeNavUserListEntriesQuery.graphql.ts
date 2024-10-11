/**
 * @generated SignedSource<<1f3bfd3f0490f67930624350bd6f04c8>>
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
  includeAvgScore: boolean;
  includeCompletedAt: boolean;
  includeMediaStatus: boolean;
  includePopularity: boolean;
  includeProgress: boolean;
  includeScore: boolean;
  includeStartDate: boolean;
  includeStartedAt: boolean;
  includeStatus: boolean;
  includeTags: boolean;
  includeTitle: boolean;
  includeToWatch: boolean;
  includeUpdated: boolean;
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
          readonly day?: number | null | undefined;
          readonly month?: number | null | undefined;
          readonly year?: number | null | undefined;
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
          readonly duration: number | null | undefined;
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
          readonly duration: number | null | undefined;
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
          readonly day?: number | null | undefined;
          readonly month?: number | null | undefined;
          readonly year?: number | null | undefined;
        } | null | undefined;
        readonly status: MediaListStatus | null | undefined;
        readonly updatedAt: number | null | undefined;
      } | {
        readonly completedAt: {
          readonly day: number | null | undefined;
          readonly month: number | null | undefined;
          readonly year: number | null | undefined;
        } | {
          readonly day?: number | null | undefined;
          readonly month?: number | null | undefined;
          readonly year?: number | null | undefined;
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
          readonly day?: number | null | undefined;
          readonly month?: number | null | undefined;
          readonly year?: number | null | undefined;
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
  "name": "includeAvgScore"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeCompletedAt"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeMediaStatus"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includePopularity"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeProgress"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeScore"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeStartDate"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeStartedAt"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeStatus"
},
v9 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeTags"
},
v10 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeTitle"
},
v11 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeToWatch"
},
v12 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "includeUpdated"
},
v13 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "type"
},
v14 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userName"
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v17 = {
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
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v19 = {
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
    (v18/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "episodes",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "chapters",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "year",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "month",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "day",
  "storageKey": null
},
v25 = [
  (v22/*: any*/),
  (v23/*: any*/),
  (v24/*: any*/)
],
v26 = {
  "name": "avalible",
  "args": null,
  "fragment": {
    "kind": "InlineFragment",
    "selections": [
      (v17/*: any*/),
      (v20/*: any*/),
      (v21/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "AiringSchedule",
        "kind": "LinkedField",
        "name": "nextAiringEpisode",
        "plural": false,
        "selections": [
          (v15/*: any*/),
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
      (v15/*: any*/)
    ],
    "type": "Media",
    "abstractKey": null
  },
  "kind": "RelayResolver",
  "storageKey": null,
  "isOutputType": true
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "progress",
  "storageKey": null
},
v28 = [
  {
    "name": "date",
    "args": null,
    "fragment": {
      "kind": "InlineFragment",
      "selections": [
        (v24/*: any*/),
        (v23/*: any*/),
        (v22/*: any*/)
      ],
      "type": "FuzzyDate",
      "abstractKey": null
    },
    "kind": "RelayResolver",
    "storageKey": null,
    "isOutputType": true
  }
],
v29 = {
  "name": "toWatch",
  "args": null,
  "fragment": {
    "kind": "InlineFragment",
    "selections": [
      {
        "name": "behind",
        "args": null,
        "fragment": {
          "kind": "InlineFragment",
          "selections": [
            (v27/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Media",
              "kind": "LinkedField",
              "name": "media",
              "plural": false,
              "selections": [
                (v15/*: any*/),
                (v26/*: any*/)
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
          (v15/*: any*/)
        ],
        "storageKey": null
      },
      (v15/*: any*/)
    ],
    "type": "MediaList",
    "abstractKey": null
  },
  "kind": "RelayResolver",
  "storageKey": null,
  "isOutputType": true
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/),
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/),
      (v12/*: any*/),
      (v13/*: any*/),
      (v14/*: any*/)
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
      (v14/*: any*/),
      (v13/*: any*/),
      (v8/*: any*/),
      (v5/*: any*/),
      (v2/*: any*/),
      (v9/*: any*/),
      (v11/*: any*/),
      (v10/*: any*/),
      (v4/*: any*/),
      (v7/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v6/*: any*/),
      (v0/*: any*/),
      (v12/*: any*/)
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
              (v15/*: any*/),
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
              (v16/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "MediaList",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
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
                      (v15/*: any*/),
                      (v17/*: any*/),
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
                        "concreteType": "MediaCoverImage",
                        "kind": "LinkedField",
                        "name": "coverImage",
                        "plural": false,
                        "selections": [
                          (v18/*: any*/),
                          {
                            "name": "src",
                            "args": null,
                            "fragment": (v19/*: any*/),
                            "kind": "RelayResolver",
                            "storageKey": null,
                            "isOutputType": true
                          },
                          {
                            "name": "srcset",
                            "args": null,
                            "fragment": (v19/*: any*/),
                            "kind": "RelayResolver",
                            "storageKey": null,
                            "isOutputType": true
                          }
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/),
                      (v21/*: any*/),
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
                        "kind": "ScalarField",
                        "name": "type",
                        "storageKey": null
                      },
                      {
                        "condition": "includeTags",
                        "kind": "Condition",
                        "passingValue": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "MediaTag",
                            "kind": "LinkedField",
                            "name": "tags",
                            "plural": true,
                            "selections": [
                              (v15/*: any*/),
                              (v16/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "condition": "includePopularity",
                        "kind": "Condition",
                        "passingValue": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "popularity",
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "condition": "includeStartDate",
                        "kind": "Condition",
                        "passingValue": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "FuzzyDate",
                            "kind": "LinkedField",
                            "name": "startDate",
                            "plural": false,
                            "selections": (v25/*: any*/),
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "condition": "includeAvgScore",
                        "kind": "Condition",
                        "passingValue": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "averageScore",
                            "storageKey": null
                          }
                        ]
                      },
                      (v26/*: any*/),
                      (v26/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v27/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FuzzyDate",
                    "kind": "LinkedField",
                    "name": "completedAt",
                    "plural": false,
                    "selections": (v28/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FuzzyDate",
                    "kind": "LinkedField",
                    "name": "startedAt",
                    "plural": false,
                    "selections": (v28/*: any*/),
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
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "condition": "includeToWatch",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": [
                      (v29/*: any*/)
                    ]
                  },
                  (v29/*: any*/),
                  {
                    "condition": "includeStartedAt",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FuzzyDate",
                        "kind": "LinkedField",
                        "name": "startedAt",
                        "plural": false,
                        "selections": (v25/*: any*/),
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "condition": "includeCompletedAt",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FuzzyDate",
                        "kind": "LinkedField",
                        "name": "completedAt",
                        "plural": false,
                        "selections": (v25/*: any*/),
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "condition": "includeUpdated",
                    "kind": "Condition",
                    "passingValue": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "updatedAt",
                        "storageKey": null
                      }
                    ]
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
    "cacheID": "1795232db6e9daecf2349554ec9e4ac3",
    "id": null,
    "metadata": {},
    "name": "routeNavUserListEntriesQuery",
    "operationKind": "query",
    "text": "query routeNavUserListEntriesQuery(\n  $userName: String!\n  $type: MediaType!\n  $includeStatus: Boolean!\n  $includeScore: Boolean!\n  $includeMediaStatus: Boolean!\n  $includeTags: Boolean!\n  $includeToWatch: Boolean!\n  $includeTitle: Boolean!\n  $includeProgress: Boolean!\n  $includeStartedAt: Boolean!\n  $includeCompletedAt: Boolean!\n  $includePopularity: Boolean!\n  $includeStartDate: Boolean!\n  $includeAvgScore: Boolean!\n  $includeUpdated: Boolean!\n) {\n  ...routeAwaitQuery_query\n}\n\nfragment Avalible_media on Media {\n  status(version: 2)\n  episodes\n  chapters\n  nextAiringEpisode {\n    id\n    episode\n  }\n  id\n}\n\nfragment Behind_entry on MediaList {\n  progress\n  media {\n    id\n    ...Avalible_media\n  }\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaListItemDate_entry on MediaList {\n  id\n  completedAt {\n    ...date_date\n  }\n  startedAt {\n    ...date_date\n  }\n}\n\nfragment MediaListItemInfo_entry on MediaList {\n  id\n}\n\nfragment MediaListItemScore_entry on MediaList {\n  id\n  score\n}\n\nfragment MediaListItemScore_user on User {\n  id\n  mediaListOptions {\n    scoreFormat\n  }\n}\n\nfragment MediaListItemSubtitle_entry on MediaList {\n  id\n  score\n  media {\n    id\n    type\n    ...ProgressTooltip_media\n  }\n  ...ToWatch_entry\n  ...Progress_entry\n  ...MediaListItemScore_entry\n}\n\nfragment MediaListItemTitle_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    title {\n      userPreferred\n      ...MediaTitle_mediaTitle\n    }\n  }\n}\n\nfragment MediaListItem_entry on MediaList {\n  id\n  media {\n    id\n    ...MediaCover_media\n  }\n  ...MediaListItemDate_entry\n  ...ProgressIncrement_entry\n  ...Progress_entry\n  ...MediaListItemTitle_entry\n  ...MediaListItemSubtitle_entry\n  ...MediaListItemInfo_entry\n  ...MediaListItemScore_entry\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment ProgressIncrement_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    ...ProgressTooltip_media\n  }\n  ...Progress_entry\n}\n\nfragment ProgressTooltip_media on Media {\n  id\n  episodes\n  chapters\n  ...Avalible_media\n}\n\nfragment Progress_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    episodes\n    chapters\n    ...Avalible_media\n  }\n}\n\nfragment ToWatch_entry on MediaList {\n  ...Behind_entry\n  media {\n    duration\n    id\n  }\n  id\n}\n\nfragment date_date on FuzzyDate {\n  day\n  month\n  year\n}\n\nfragment isVisible_entry on MediaList {\n  id\n  progress\n  media {\n    id\n    status(version: 2)\n    format\n  }\n  ...ToWatch_entry\n}\n\nfragment routeAwaitQuery_query on Query {\n  MediaListCollection(userName: $userName, type: $type) {\n    user {\n      id\n      ...routeNavUserListEntriesSort_user\n      ...MediaListItemScore_user\n    }\n    lists {\n      name\n      entries {\n        id\n        ...routeIsQuery_entry\n        ...isVisible_entry\n        ...routeNavUserListEntriesSort_entries\n        ...MediaListItem_entry\n        ...routeSidePanel_entry\n      }\n    }\n  }\n}\n\nfragment routeFuzzyDateOrder_fuzzyDate on FuzzyDate {\n  year\n  month\n  day\n}\n\nfragment routeIsQuery_entry on MediaList {\n  id\n  status @include(if: $includeStatus)\n  score @include(if: $includeScore)\n  progress @include(if: $includeProgress)\n  media {\n    id\n    status(version: 2) @include(if: $includeMediaStatus)\n    tags @include(if: $includeTags) {\n      id\n      name\n    }\n  }\n  ...ToWatch_entry @include(if: $includeToWatch)\n}\n\nfragment routeNavUserListEntriesSort_entries on MediaList {\n  id\n  progress @include(if: $includeProgress)\n  score @include(if: $includeScore)\n  startedAt @include(if: $includeStartedAt) {\n    ...routeFuzzyDateOrder_fuzzyDate\n  }\n  completedAt @include(if: $includeCompletedAt) {\n    ...routeFuzzyDateOrder_fuzzyDate\n  }\n  media {\n    id\n    popularity @include(if: $includePopularity)\n    startDate @include(if: $includeStartDate) {\n      ...routeFuzzyDateOrder_fuzzyDate\n    }\n    averageScore @include(if: $includeAvgScore)\n    status(version: 2)\n    title @include(if: $includeTitle) {\n      userPreferred\n    }\n  }\n  updatedAt @include(if: $includeUpdated)\n  ...ToWatch_entry @include(if: $includeToWatch)\n  ...MediaListItem_entry\n}\n\nfragment routeNavUserListEntriesSort_user on User {\n  id\n  mediaListOptions {\n    rowOrder\n  }\n}\n\nfragment routeSidePanel_entry on MediaList {\n  id\n  status\n  score\n  progress\n  media {\n    id\n    title {\n      userPreferred\n    }\n    episodes\n    ...Avalible_media\n    ...MediaCover_media\n  }\n  ...Progress_entry\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "059e08314bc22ec6b746343f8bb89a1a";
}

export default node;
