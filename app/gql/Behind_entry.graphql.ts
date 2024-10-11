/**
 * @generated SignedSource<<4bbf3956f96e0db3710eb50cc0e0b6b8>>
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
export type Behind_entry$data = {
  readonly media: {
    readonly avalible: NonNullable<number | null | undefined>;
    readonly id: number;
  } | null | undefined;
  readonly progress: number | null | undefined;
  readonly " $fragmentType": "Behind_entry";
};
export type Behind_entry$key = {
  readonly " $data"?: Behind_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"Behind_entry">;
};

import {avalible as mediaAvalibleResolver} from './../lib/media/Avalible';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Behind_entry",
  "selections": [
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
          "action": "NONE",
          "path": "media.avalible"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "1d4340257140dad5039b03849e8dcb63";
}

export default node;
