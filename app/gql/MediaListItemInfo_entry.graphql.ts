/**
 * @generated SignedSource<<5a2bbf67020d02cfa561cb20d5c5dbf0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MediaListItemInfo_entry$data = {
  readonly id: number;
  readonly " $fragmentType": "MediaListItemInfo_entry";
};
export type MediaListItemInfo_entry$key = {
  readonly " $data"?: MediaListItemInfo_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemInfo_entry">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaListItemInfo_entry",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};

if (import.meta.env.DEV) {
  (node as any).hash = "5f2dc4fe465da74609458478df526064";
}

export default node;
