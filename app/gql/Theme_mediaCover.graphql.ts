/**
 * @generated SignedSource<<d9f2efce6b385c36d1605ff5f3b88c62>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Theme_mediaCover$data = {
  readonly color: string | null | undefined;
  readonly " $fragmentType": "Theme_mediaCover";
};
export type Theme_mediaCover$key = {
  readonly " $data"?: Theme_mediaCover$data;
  readonly " $fragmentSpreads": FragmentRefs<"Theme_mediaCover">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Theme_mediaCover",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "color",
      "storageKey": null
    }
  ],
  "type": "MediaCoverImage",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "51e32408c8de0b29eb5e1b18285aa875";
}

export default node;
