/**
 * @generated SignedSource<<f238514fc6694e5a125ed61f5426a888>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaType = "ANIME" | "MANGA" | "%future added value";
export type routeNavUserListQuery$variables = {
  type: MediaType;
  userName: string;
};
export type routeNavUserListQuery$data = {
  readonly MediaListCollection: {
    readonly lists: ReadonlyArray<{
      readonly name: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly user: {
      readonly mediaListOptions: {
        readonly animeList: {
          readonly sectionOrder: ReadonlyArray<string | null | undefined> | null | undefined;
        } | null | undefined;
        readonly mangaList: {
          readonly sectionOrder: ReadonlyArray<string | null | undefined> | null | undefined;
        } | null | undefined;
        readonly rowOrder: string | null | undefined;
      } | null | undefined;
      readonly name: string;
      readonly " $fragmentSpreads": FragmentRefs<"User_user">;
    } | null | undefined;
  } | null | undefined;
};
export type routeNavUserListQuery$rawResponse = {
  readonly MediaListCollection: {
    readonly lists: ReadonlyArray<{
      readonly name: string | null | undefined;
    } | null | undefined> | null | undefined;
    readonly user: {
      readonly avatar: {
        readonly large: string | null | undefined;
        readonly medium: string | null | undefined;
      } | null | undefined;
      readonly bannerImage: string | null | undefined;
      readonly id: number;
      readonly mediaListOptions: {
        readonly animeList: {
          readonly sectionOrder: ReadonlyArray<string | null | undefined> | null | undefined;
        } | null | undefined;
        readonly mangaList: {
          readonly sectionOrder: ReadonlyArray<string | null | undefined> | null | undefined;
        } | null | undefined;
        readonly rowOrder: string | null | undefined;
      } | null | undefined;
      readonly name: string;
    } | null | undefined;
  } | null | undefined;
};
export type routeNavUserListQuery = {
  rawResponse: routeNavUserListQuery$rawResponse;
  response: routeNavUserListQuery$data;
  variables: routeNavUserListQuery$variables;
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
v2 = [
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
  "concreteType": "MediaListGroup",
  "kind": "LinkedField",
  "name": "lists",
  "plural": true,
  "selections": [
    (v3/*: any*/)
  ],
  "storageKey": null
},
v5 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "sectionOrder",
    "storageKey": null
  }
],
v6 = {
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
      "concreteType": "MediaListTypeOptions",
      "kind": "LinkedField",
      "name": "animeList",
      "plural": false,
      "selections": (v5/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MediaListTypeOptions",
      "kind": "LinkedField",
      "name": "mangaList",
      "plural": false,
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavUserListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "MediaListCollection",
        "kind": "LinkedField",
        "name": "MediaListCollection",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v6/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "User_user"
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "routeNavUserListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "MediaListCollection",
        "kind": "LinkedField",
        "name": "MediaListCollection",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v6/*: any*/),
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
                "name": "bannerImage",
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "6d7a20feba41e40601275cd1633d6c8d",
    "id": null,
    "metadata": {},
    "name": "routeNavUserListQuery",
    "operationKind": "query",
    "text": "query routeNavUserListQuery(\n  $userName: String!\n  $type: MediaType!\n) {\n  MediaListCollection(userName: $userName, type: $type) {\n    lists {\n      name\n    }\n    user {\n      name\n      mediaListOptions {\n        rowOrder\n        animeList {\n          sectionOrder\n        }\n        mangaList {\n          sectionOrder\n        }\n      }\n      ...User_user\n    }\n  }\n}\n\nfragment User_user on User {\n  id\n  name\n  bannerImage\n  avatar {\n    large\n    medium\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "e5b56833f01ea3716b848d2f51c3d1b2";
}

export default node;
