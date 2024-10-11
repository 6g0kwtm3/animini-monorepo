/**
 * @generated SignedSource<<a7e629c2e6ce124dfe0a5ca7b8473af9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaListItemScore_entry$data = {
  readonly id: number;
  readonly score: number | null | undefined;
  readonly " $fragmentType": "MediaListItemScore_entry";
};
export type MediaListItemScore_entry$key = {
  readonly " $data"?: MediaListItemScore_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemScore_entry">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaListItemScore_entry",
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
      "name": "score",
      "storageKey": null
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "c4cd3e5fc8c3079777fcb28ead9cd7e7";
}

export default node;
