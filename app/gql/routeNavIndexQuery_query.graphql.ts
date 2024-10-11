/**
 * @generated SignedSource<<39e27e7e761c09e1a5906990e31822e2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavIndexQuery_query$data = {
  readonly Page: {
    readonly media: ReadonlyArray<{
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"routeMediaCarouselItem_media">;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "routeNavIndexQuery_query";
};
export type routeNavIndexQuery_query$key = {
  readonly " $data"?: routeNavIndexQuery_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeNavIndexQuery_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "routeNavIndexQuery_query",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Page",
      "kind": "LinkedField",
      "name": "Page",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Media",
          "kind": "LinkedField",
          "name": "media",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "id",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "routeMediaCarouselItem_media"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

if (import.meta.env.DEV) {
  (node as any).hash = "f789edcc27e62841e79277b3bc1c3066";
}

export default node;
