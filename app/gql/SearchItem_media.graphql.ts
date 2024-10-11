/**
 * @generated SignedSource<<193690b0bc3575b5773829eeec52fb8e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type MediaType = "ANIME" | "MANGA" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type SearchItem_media$data = {
  readonly id: number;
  readonly title: {
    readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
  };
  readonly type: MediaType | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  readonly " $fragmentType": "SearchItem_media";
} | null | undefined;
export type SearchItem_media$key = {
  readonly " $data"?: SearchItem_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchItem_media">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchItem_media",
  "selections": [
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
      "name": "type",
      "storageKey": null
    },
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
      "action": "LOG",
      "path": "title"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaCover_media"
    }
  ],
  "type": "Media",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "e96cf36b49e8d92465162d09d6a808c2";
}

export default node;
