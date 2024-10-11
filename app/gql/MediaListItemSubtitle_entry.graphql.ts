/**
 * @generated SignedSource<<410177c338994eadd8ce2fbc880e183b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type MediaType = "ANIME" | "MANGA" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { toWatch as mediaListToWatchResolverType } from "../lib/entry/ToWatch";
// Type assertion validating that `mediaListToWatchResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListToWatchResolverType satisfies (
  rootKey: ToWatch_entry$key,
) => number | null | undefined);
export type MediaListItemSubtitle_entry$data = {
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly type: MediaType | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"ProgressTooltip_media">;
  } | null | undefined;
  readonly score: number | null | undefined;
  readonly toWatch: number | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemScore_entry" | "Progress_entry">;
  readonly " $fragmentType": "MediaListItemSubtitle_entry";
};
export type MediaListItemSubtitle_entry$key = {
  readonly " $data"?: MediaListItemSubtitle_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemSubtitle_entry">;
};

import {toWatch as mediaListToWatchResolver} from './../lib/entry/ToWatch';

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
  "name": "MediaListItemSubtitle_entry",
  "selections": [
    (v0/*: any*/),
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
          "name": "type",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ProgressTooltip_media"
        }
      ],
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Progress_entry"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaListItemScore_entry"
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "0951038cae9fc6f1aeb3aa62f1f2bcb3";
}

export default node;
