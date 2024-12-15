/**
 * @generated SignedSource<<a4e8e4e4bb4b9e3392346c32d746fd56>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeAwaitQuery_query$data = {
  readonly MediaListCollection: {
    readonly lists: ReadonlyArray<{
      readonly entries: ReadonlyArray<{
        readonly id: number;
        readonly " $fragmentSpreads": FragmentRefs<"MediaListItem_entry" | "isVisible_entry" | "routeIsQuery_entry" | "routeNavUserListEntriesSort_entries" | "routeSidePanel_entry">;
      } | null | undefined> | null | undefined;
      readonly name: string;
    } | null | undefined>;
    readonly user: {
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"MediaListItemScore_user" | "routeNavUserListEntriesSort_user">;
    } | null | undefined;
  };
  readonly " $fragmentType": "routeAwaitQuery_query";
} | null | undefined;
export type routeAwaitQuery_query$key = {
  readonly " $data"?: routeAwaitQuery_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeAwaitQuery_query">;
};

import {behind as mediaListBehindResolver} from './../lib/entry/Behind';
import {toWatch as mediaListToWatchResolver} from './../lib/entry/ToWatch';

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "score",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "progress",
  "storageKey": null
},
v4 = {
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
v5 = {
  "alias": null,
  "args": null,
  "fragment": {
    "args": null,
    "kind": "FragmentSpread",
    "name": "ToWatch_entry"
  },
  "kind": "RelayResolver",
  "name": "toWatch",
  "resolverModule": mediaListToWatchResolver,
  "path": "toWatch"
},
v6 = [
  {
    "kind": "InlineDataFragmentSpread",
    "name": "routeFuzzyDateOrder_fuzzyDate",
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "year",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "month",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "day",
        "storageKey": null
      }
    ],
    "args": null,
    "argumentDefinitions": ([]/*: any*/)
  }
],
v7 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "MediaListItem_entry"
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "type"
    },
    {
      "kind": "RootArgument",
      "name": "userName"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "routeAwaitQuery_query",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
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
              (v0/*: any*/),
              {
                "kind": "InlineDataFragmentSpread",
                "name": "routeNavUserListEntriesSort_user",
                "selections": [
                  (v0/*: any*/),
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "args": null,
                "argumentDefinitions": []
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "MediaListItemScore_user"
              }
            ],
            "storageKey": null
          },
          {
            "kind": "RequiredField",
            "field": {
              "alias": null,
              "args": null,
              "concreteType": "MediaListGroup",
              "kind": "LinkedField",
              "name": "lists",
              "plural": true,
              "selections": [
                {
                  "kind": "RequiredField",
                  "field": (v1/*: any*/),
                  "action": "LOG"
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "MediaList",
                  "kind": "LinkedField",
                  "name": "entries",
                  "plural": true,
                  "selections": [
                    (v0/*: any*/),
                    {
                      "kind": "InlineDataFragmentSpread",
                      "name": "routeIsQuery_entry",
                      "selections": [
                        (v0/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "status",
                          "storageKey": null
                        },
                        (v2/*: any*/),
                        (v3/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Media",
                          "kind": "LinkedField",
                          "name": "media",
                          "plural": false,
                          "selections": [
                            (v0/*: any*/),
                            (v4/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "MediaTag",
                              "kind": "LinkedField",
                              "name": "tags",
                              "plural": true,
                              "selections": [
                                (v0/*: any*/),
                                (v1/*: any*/)
                              ],
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        },
                        (v5/*: any*/)
                      ],
                      "args": null,
                      "argumentDefinitions": []
                    },
                    {
                      "kind": "InlineDataFragmentSpread",
                      "name": "isVisible_entry",
                      "selections": [
                        (v0/*: any*/),
                        (v3/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "Media",
                          "kind": "LinkedField",
                          "name": "media",
                          "plural": false,
                          "selections": [
                            (v0/*: any*/),
                            (v4/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "format",
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        },
                        (v5/*: any*/)
                      ],
                      "args": null,
                      "argumentDefinitions": []
                    },
                    {
                      "kind": "InlineDataFragmentSpread",
                      "name": "routeNavUserListEntriesSort_entries",
                      "selections": [
                        (v0/*: any*/),
                        (v3/*: any*/),
                        (v2/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "FuzzyDate",
                          "kind": "LinkedField",
                          "name": "startedAt",
                          "plural": false,
                          "selections": (v6/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "FuzzyDate",
                          "kind": "LinkedField",
                          "name": "completedAt",
                          "plural": false,
                          "selections": (v6/*: any*/),
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
                            (v0/*: any*/),
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
                              "selections": (v6/*: any*/),
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "concreteType": "FuzzyDate",
                              "kind": "LinkedField",
                              "name": "endDate",
                              "plural": false,
                              "selections": (v6/*: any*/),
                              "storageKey": null
                            },
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "averageScore",
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
                                {
                                  "alias": null,
                                  "args": null,
                                  "kind": "ScalarField",
                                  "name": "userPreferred",
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
                          "kind": "ScalarField",
                          "name": "updatedAt",
                          "storageKey": null
                        },
                        (v5/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "fragment": {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "Behind_entry"
                          },
                          "kind": "RelayResolver",
                          "name": "behind",
                          "resolverModule": mediaListBehindResolver,
                          "path": "behind"
                        },
                        (v7/*: any*/)
                      ],
                      "args": null,
                      "argumentDefinitions": []
                    },
                    (v7/*: any*/),
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "routeSidePanel_entry"
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            "action": "LOG"
          }
        ],
        "storageKey": null
      },
      "action": "LOG"
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "464edb33dce74649948932df207ed303";
}

export default node;
