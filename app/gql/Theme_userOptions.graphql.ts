/**
 * @generated SignedSource<<5d215505690976a6bcc2343ab69f588c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Theme_userOptions$data = {
  readonly profileColor: string | null | undefined;
  readonly " $fragmentType": "Theme_userOptions";
};
export type Theme_userOptions$key = {
  readonly " $data"?: Theme_userOptions$data;
  readonly " $fragmentSpreads": FragmentRefs<"Theme_userOptions">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Theme_userOptions",
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
};

if (import.meta.env.DEV) {
  (node as any).hash = "9f82ba7583597fd54e8aa474d2cab043";
}

export default node;
