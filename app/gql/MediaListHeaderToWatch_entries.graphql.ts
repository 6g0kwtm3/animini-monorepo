/**
 * @generated SignedSource<<fcfb37f6c53e9345d0c1ad0c7d116828>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
import { toWatch as mediaListToWatchResolverType } from "../lib/entry/ToWatch";
// Type assertion validating that `mediaListToWatchResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListToWatchResolverType satisfies (
  rootKey: ToWatch_entry$key,
) => number | null | undefined);
export type MediaListHeaderToWatch_entries$data = ReadonlyArray<{
  readonly id: number;
  readonly toWatch: number | null | undefined;
  readonly " $fragmentType": "MediaListHeaderToWatch_entries";
}>;
export type MediaListHeaderToWatch_entries$key = ReadonlyArray<{
  readonly " $data"?: MediaListHeaderToWatch_entries$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListHeaderToWatch_entries">;
}>;

import {toWatch as mediaListToWatchResolver} from './../lib/entry/ToWatch';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "MediaListHeaderToWatch_entries",
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
      "fragment": {
        "args": null,
        "kind": "FragmentSpread",
        "name": "ToWatch_entry"
      },
      "kind": "RelayResolver",
      "name": "toWatch",
      "resolverModule": mediaListToWatchResolver,
      "path": "toWatch"
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};

if (import.meta.env.DEV) {
  (node as any).hash = "1a3a1ecae8395065b9629cc934332522";
}

export default node;
