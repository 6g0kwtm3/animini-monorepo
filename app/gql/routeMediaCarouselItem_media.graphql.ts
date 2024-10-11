/**
 * @generated SignedSource<<414d32e9eea1c55ec31514bebed254b8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeMediaCarouselItem_media$data = {
  readonly id: number;
  readonly title: {
    readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
  };
  readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  readonly " $fragmentType": "routeMediaCarouselItem_media";
} | null | undefined;
export type routeMediaCarouselItem_media$key = {
  readonly " $data"?: routeMediaCarouselItem_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeMediaCarouselItem_media">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "routeMediaCarouselItem_media",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
      "args": [
        {
          "kind": "Literal",
          "name": "extraLarge",
          "value": true
        }
      ],
      "kind": "FragmentSpread",
      "name": "MediaCover_media"
    }
  ],
  "type": "Media",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "643b273f19d9e1d8e1719be86d647561";
}

export default node;
