/**
 * @generated SignedSource<<c7b1019d9769a0d7b8399e25db1b3a97>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaListItem_entry$data = {
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  };
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemDate_entry" | "MediaListItemInfo_entry" | "MediaListItemScore_entry" | "MediaListItemSubtitle_entry" | "MediaListItemTitle_entry" | "ProgressIncrement_entry" | "Progress_entry">;
  readonly " $fragmentType": "MediaListItem_entry";
} | null | undefined;
export type MediaListItem_entry$key = {
  readonly " $data"?: MediaListItem_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItem_entry">;
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
  "name": "MediaListItem_entry",
  "selections": [
    (v0/*: any*/),
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "MediaCover_media"
          }
        ],
        "storageKey": null
      },
      "action": "LOG",
      "path": "media"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaListItemDate_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ProgressIncrement_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Progress_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaListItemTitle_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaListItemSubtitle_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaListItemInfo_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaListItemScore_entry"
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "c76aa8052f2ddf30cfa501b9b748800f";
}

export default node;
