/**
 * @generated SignedSource<<c05ec45bb1c2dcec48db8338cef0afa1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavNotificationsQuery$variables = Record<PropertyKey, never>;
export type routeNavNotificationsQuery$data = {
  readonly Viewer: {
    readonly id: number;
    readonly unreadNotificationCount: number | null | undefined;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"routeNavNotifications_query">;
};
export type routeNavNotificationsQuery$rawResponse = {
  readonly Page: {
    readonly notifications: ReadonlyArray<{
      readonly __typename: "ActivityLikeNotification";
      readonly activityId: number;
      readonly context: string | null | undefined;
      readonly createdAt: number | null | undefined;
      readonly id: number;
      readonly user: {
        readonly avatar: {
          readonly large: string | null | undefined;
          readonly medium: string | null | undefined;
        } | null | undefined;
        readonly id: number;
        readonly name: string;
      } | null | undefined;
    } | {
      readonly __typename: "AiringNotification";
      readonly createdAt: number | null | undefined;
      readonly episode: number;
      readonly id: number;
      readonly media: {
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
      } | null | undefined;
    } | {
      readonly __typename: "RelatedMediaAdditionNotification";
      readonly createdAt: number | null | undefined;
      readonly id: number;
      readonly media: {
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
      } | null | undefined;
    } | {
      readonly __typename: string;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly Viewer: {
    readonly id: number;
    readonly unreadNotificationCount: number | null | undefined;
  } | null | undefined;
};
export type routeNavNotificationsQuery = {
  rawResponse: routeNavNotificationsQuery$rawResponse;
  response: routeNavNotificationsQuery$data;
  variables: routeNavNotificationsQuery$variables;
};

const node: ConcreteRequest = (function(){
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
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "Viewer",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "unreadNotificationCount",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v3 = {
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "large",
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
    (v5/*: any*/),
    (v4/*: any*/)
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
},
v7 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavNotificationsQuery",
    "selections": [
      (v1/*: any*/),
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "routeNavNotifications_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "routeNavNotificationsQuery",
    "selections": [
      (v1/*: any*/),
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
            "args": [
              {
                "kind": "Literal",
                "name": "type_in",
                "value": [
                  "AIRING",
                  "RELATED_MEDIA_ADDITION",
                  "ACTIVITY_LIKE"
                ]
              }
            ],
            "concreteType": null,
            "kind": "LinkedField",
            "name": "notifications",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "episode",
                    "storageKey": null
                  },
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Media",
                    "kind": "LinkedField",
                    "name": "media",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      (v0/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "AiringNotification",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v0/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Media",
                    "kind": "LinkedField",
                    "name": "media",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      (v3/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "RelatedMediaAdditionNotification",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  (v0/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "activityId",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "context",
                    "storageKey": null
                  },
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
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
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
                          (v5/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ActivityLikeNotification",
                "abstractKey": null
              }
            ],
            "storageKey": "notifications(type_in:[\"AIRING\",\"RELATED_MEDIA_ADDITION\",\"ACTIVITY_LIKE\"])"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "17d2ee76c8b787b5d41a526aa3ab71c3",
    "id": null,
    "metadata": {},
    "name": "routeNavNotificationsQuery",
    "operationKind": "query",
    "text": "query routeNavNotificationsQuery {\n  Viewer {\n    id\n    unreadNotificationCount\n  }\n  ...routeNavNotifications_query\n}\n\nfragment ActivityLike_notification on ActivityLikeNotification {\n  id\n  createdAt\n  activityId\n  context\n  user {\n    id\n    name\n    avatar {\n      large\n      medium\n    }\n  }\n}\n\nfragment Airing_notification on AiringNotification {\n  id\n  episode\n  createdAt\n  media {\n    title {\n      ...MediaTitle_mediaTitle\n    }\n    ...MediaCover_media\n    id\n  }\n}\n\nfragment MediaCover_media on Media {\n  id\n  coverImage {\n    medium\n    ...src_mediaCover_1HKRCY\n    ...srcset_mediaCover_1HKRCY\n  }\n}\n\nfragment MediaTitle_mediaTitle on MediaTitle {\n  userPreferred\n}\n\nfragment RelatedMediaAddition_notification on RelatedMediaAdditionNotification {\n  id\n  createdAt\n  media {\n    id\n    title {\n      ...MediaTitle_mediaTitle\n    }\n    ...MediaCover_media\n  }\n}\n\nfragment routeNavNotifications_query on Query {\n  Page {\n    notifications(type_in: [AIRING, RELATED_MEDIA_ADDITION, ACTIVITY_LIKE]) {\n      __typename\n      ... on AiringNotification {\n        id\n        ...Airing_notification\n      }\n      ... on RelatedMediaAdditionNotification {\n        id\n        ...RelatedMediaAddition_notification\n      }\n      ... on ActivityLikeNotification {\n        id\n        ...ActivityLike_notification\n      }\n    }\n  }\n}\n\nfragment src_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n\nfragment srcset_mediaCover_1HKRCY on MediaCoverImage {\n  extraLarge\n  large\n  medium\n}\n"
  }
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "becc517e8611d845135f51e0ee4451a0";
}

export default node;
