/**
 * @generated SignedSource<<51127d1217e1c3c5be589374df99e171>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type ScoreFormat = "POINT_10" | "POINT_100" | "POINT_10_DECIMAL" | "POINT_3" | "POINT_5" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MediaListItemScore_user$data = {
  readonly id: number;
  readonly mediaListOptions: {
    readonly scoreFormat: ScoreFormat | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "MediaListItemScore_user";
};
export type MediaListItemScore_user$key = {
  readonly " $data"?: MediaListItemScore_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemScore_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaListItemScore_user",
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
      "concreteType": "MediaListOptions",
      "kind": "LinkedField",
      "name": "mediaListOptions",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "scoreFormat",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "527d7c65e16f6c3d630337be0dc75352";
}

export default node;
