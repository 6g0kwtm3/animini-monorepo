/**
 * @generated SignedSource<<8d64182b6f52c825feef517c6fcb97a5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaListItemTitle_entry$data = {
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly title: {
      readonly userPreferred: string;
      readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
    };
  };
  readonly progress: number | null | undefined;
  readonly " $fragmentType": "MediaListItemTitle_entry";
} | null | undefined;
export type MediaListItemTitle_entry$key = {
  readonly " $data"?: MediaListItemTitle_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemTitle_entry">;
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
  "name": "MediaListItemTitle_entry",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "progress",
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
          (v0/*: any*/),
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
                  "field": {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "userPreferred",
                    "storageKey": null
                  },
                  "action": "LOG"
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "MediaTitle_mediaTitle"
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
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "64acb317d58e589e0568ca9a3d17bcf3";
}

export default node;
