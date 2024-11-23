/**
 * @generated SignedSource<<e655010efc8761edb769c8d56b6ff8db>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Airing_notification$data = {
  readonly createdAt: number | null | undefined;
  readonly episode: number;
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly title: {
      readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
    };
    readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  };
  readonly " $fragmentType": "Airing_notification";
} | null | undefined;
export type Airing_notification$key = {
  readonly " $data"?: Airing_notification$data;
  readonly " $fragmentSpreads": FragmentRefs<"Airing_notification">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Airing_notification",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "episode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "Media",
        "kind": "LinkedField",
        "name": "media",
        "plural": false,
        "selections": [
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
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MediaCover_media"
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      },
      "action": "LOG"
    }
  ],
  "type": "AiringNotification",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "502294b30fefb3c6d6f4030e8aba02ac";
}

export default node;
