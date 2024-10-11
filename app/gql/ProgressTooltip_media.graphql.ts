/**
 * @generated SignedSource<<9eb29a3ffcf800e32fe2a19e32f33abc>>
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
export type ProgressTooltip_media$data = {
  readonly avalible: number | null | undefined;
  readonly chapters: number | null | undefined;
  readonly episodes: number | null | undefined;
  readonly id: number;
  readonly " $fragmentType": "ProgressTooltip_media";
};
export type ProgressTooltip_media$key = {
  readonly " $data"?: ProgressTooltip_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProgressTooltip_media">;
};

import {avalible as mediaAvalibleResolver} from './../lib/media/Avalible';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProgressTooltip_media",
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
      "path": "avalible"
    }
  ],
  "type": "Media",
  "abstractKey": null
};

if (import.meta.env.DEV) {
  (node as any).hash = "a6e32c44975283f75c2d0084589b665b";
}

export default node;
