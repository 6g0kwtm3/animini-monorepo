/**
 * @generated SignedSource<<76b7064e3dae2c49b6d4b372df9462a9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type MediaListStatus = "COMPLETED" | "CURRENT" | "DROPPED" | "PAUSED" | "PLANNING" | "REPEATING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { avalible as mediaAvalibleResolverType } from "../lib/media/Avalible";
// Type assertion validating that `mediaAvalibleResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaAvalibleResolverType satisfies (
  rootKey: Avalible_media$key,
) => number | null | undefined);
export type routeSidePanel_entry$data = {
  readonly id: number;
  readonly media: {
    readonly avalible: number | null | undefined;
    readonly episodes: number | null | undefined;
    readonly id: number;
    readonly title: {
      readonly userPreferred: string | null | undefined;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  } | null | undefined;
  readonly progress: number | null | undefined;
  readonly score: number | null | undefined;
  readonly status: MediaListStatus | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"Progress_entry">;
  readonly " $fragmentType": "routeSidePanel_entry";
};
export type routeSidePanel_entry$key = {
  readonly " $data"?: routeSidePanel_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeSidePanel_entry">;
};

import {avalible as mediaAvalibleResolver} from './../lib/media/Avalible';

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
  "name": "routeSidePanel_entry",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "score",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "progress",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Media",
      "kind": "LinkedField",
      "name": "media",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "MediaTitle",
          "kind": "LinkedField",
          "name": "title",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "userPreferred",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "episodes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "fragment": {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Avalible_media"
          },
          "kind": "RelayResolver",
          "name": "avalible",
          "resolverModule": mediaAvalibleResolver,
          "path": "media.avalible"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "MediaCover_media"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Progress_entry"
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "e5d8cec6bedb4bfb4c150e461ae97132";
}

export default node;
