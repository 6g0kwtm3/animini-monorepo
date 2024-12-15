/**
 * @generated SignedSource<<f1f2773330706975704a753967c4fc1c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RelatedMediaAddition_notification$data = {
  readonly createdAt: number | null | undefined;
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly title: {
      readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
    };
    readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  };
  readonly " $fragmentType": "RelatedMediaAddition_notification";
} | null | undefined;
export type RelatedMediaAddition_notification$key = {
  readonly " $data"?: RelatedMediaAddition_notification$data;
  readonly " $fragmentSpreads": FragmentRefs<"RelatedMediaAddition_notification">;
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
  "name": "RelatedMediaAddition_notification",
  "selections": [
    (v0/*: any*/),
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
          }
        ],
        "storageKey": null
      },
      "action": "LOG"
    }
  ],
  "type": "RelatedMediaAdditionNotification",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "ae1cc673fbb63fbc5a1b1f737e68a0bd";
}

export default node;
