/**
 * @generated SignedSource<<be9fb50cd613475781a618287e673afc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type SearchTrending_query$data = {
  readonly trending: {
    readonly media: ReadonlyArray<{
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"SearchItem_media">;
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "SearchTrending_query";
};
export type SearchTrending_query$key = {
  readonly " $data"?: SearchTrending_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"SearchTrending_query">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SearchTrending_query",
  "selections": [
    {
      "alias": "trending",
      "args": [
        {
          "kind": "Literal",
          "name": "perPage",
          "value": 10
        }
      ],
      "concreteType": "Page",
      "kind": "LinkedField",
      "name": "Page",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "sort",
              "value": [
                "TRENDING_DESC"
              ]
            }
          ],
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
              "name": "SearchItem_media"
            }
          ],
          "storageKey": "media(sort:[\"TRENDING_DESC\"])"
        }
      ],
      "storageKey": "Page(perPage:10)"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "7effab2de29bfaefd65f11f8fc3f564c";
}

export default node;
