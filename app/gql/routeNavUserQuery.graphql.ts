/**
 * @generated SignedSource<<616962f5a120fcf833bb509c7094b250>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
import { profileTheme as userOptionsProfileThemeResolverType } from "../lib/user/Theme";
// Type assertion validating that `userOptionsProfileThemeResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(userOptionsProfileThemeResolverType satisfies (
  rootKey: Theme_userOptions$key,
) => unknown | null | undefined);
export type routeNavUserQuery$variables = {
  userName: string;
};
export type routeNavUserQuery$data = {
  readonly user: {
    readonly about: string | null | undefined;
    readonly id: number;
    readonly isFollowing: boolean | null | undefined;
    readonly name: string;
    readonly options: {
      readonly profileTheme: ReturnType<typeof userOptionsProfileThemeResolverType> | null | undefined;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"User_user">;
  } | null | undefined;
};
export type routeNavUserQuery$rawResponse = {
  readonly user: {
    readonly about: string | null | undefined;
    readonly avatar: {
      readonly large: string | null | undefined;
      readonly medium: string | null | undefined;
    } | null | undefined;
    readonly bannerImage: string | null | undefined;
    readonly id: number;
    readonly isFollowing: boolean | null | undefined;
    readonly name: string;
    readonly options: {
      readonly profileColor: string | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type routeNavUserQuery = {
  rawResponse: routeNavUserQuery$rawResponse;
  response: routeNavUserQuery$data;
  variables: routeNavUserQuery$variables;
};

import {profileTheme as userOptionsProfileThemeResolver} from './../lib/user/Theme';

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "userName"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "userName"
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
  "name": "isFollowing",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "about",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "routeNavUserQuery",
    "selections": [
      {
        "alias": "user",
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "User",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "UserOptions",
            "kind": "LinkedField",
            "name": "options",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "fragment": {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "Theme_userOptions"
                },
                "kind": "RelayResolver",
                "name": "profileTheme",
                "resolverModule": userOptionsProfileThemeResolver,
                "path": "user.options.profileTheme"
              }
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "User_user"
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
    "name": "routeNavUserQuery",
    "selections": [
      {
        "alias": "user",
        "args": (v1/*: any*/),
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "User",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "UserOptions",
            "kind": "LinkedField",
            "name": "options",
            "plural": false,
            "selections": [
              {
                "name": "profileTheme",
                "args": null,
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "profileColor",
                      "storageKey": null
                    }
                  ],
                  "type": "UserOptions",
                  "abstractKey": null
                },
                "kind": "RelayResolver",
                "storageKey": null,
                "isOutputType": true
              }
            ],
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
    ]
  },
  "params": {
    "cacheID": "04691aedc5c02de6ccf1f88f1b6a2408",
    "id": null,
    "metadata": {},
    "name": "routeNavUserQuery",
    "operationKind": "query",
    "text": "query routeNavUserQuery(\n  $userName: String!\n) {\n  user: User(name: $userName) {\n    id\n    isFollowing\n    about\n    name\n    options {\n      ...Theme_userOptions\n    }\n    ...User_user\n  }\n}\n\nfragment Theme_userOptions on UserOptions {\n  profileColor\n}\n\nfragment User_user on User {\n  id\n  name\n  bannerImage\n  avatar {\n    large\n    medium\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "5380df1e903033f5ae618c18fde39f75";
}

export default node;
