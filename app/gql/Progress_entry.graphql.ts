/**
 * @generated SignedSource<<9988705608a263e1f3d6d1f9b86aca9c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
import { avalible as mediaAvalibleResolverType } from "../lib/media/Avalible";
// Type assertion validating that `mediaAvalibleResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaAvalibleResolverType satisfies (
  rootKey: Avalible_media$key,
) => number | null | undefined);
export type Progress_entry$data = {
  readonly id: number;
  readonly media: {
    readonly avalible: number | null | undefined;
    readonly chapters: number | null | undefined;
    readonly episodes: number | null | undefined;
    readonly id: number;
  } | null | undefined;
  readonly progress: number | null | undefined;
  readonly " $fragmentType": "Progress_entry";
};
export type Progress_entry$key = {
  readonly " $data"?: Progress_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"Progress_entry">;
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
  "name": "Progress_entry",
  "selections": [
    (v0/*: any*/),
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
          "kind": "ScalarField",
          "name": "episodes",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "chapters",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "00fef4d3c5b347895b35b4722196bc8f";
}

export default node;
