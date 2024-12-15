/**
 * @generated SignedSource<<41b50bf2030ab242eb88ce85673f3cc6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
import { date as fuzzyDateDateResolverType } from "../lib/media/date";
// Type assertion validating that `fuzzyDateDateResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(fuzzyDateDateResolverType satisfies (
  rootKey: date_date$key,
) => unknown | null | undefined);
export type MediaListItemDate_entry$data = {
  readonly completedAt: {
    readonly date: NonNullable<ReturnType<typeof fuzzyDateDateResolverType>>;
  } | null | undefined;
  readonly id: number;
  readonly startedAt: {
    readonly date: NonNullable<ReturnType<typeof fuzzyDateDateResolverType>>;
  } | null | undefined;
  readonly " $fragmentType": "MediaListItemDate_entry";
};
export type MediaListItemDate_entry$key = {
  readonly " $data"?: MediaListItemDate_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaListItemDate_entry">;
};

import {date as fuzzyDateDateResolver} from './../lib/media/date';

const node: ReaderFragment = (function(){
var v0 = {
  "args": null,
  "kind": "FragmentSpread",
  "name": "date_date"
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaListItemDate_entry",
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
      "concreteType": "FuzzyDate",
      "kind": "LinkedField",
      "name": "completedAt",
      "plural": false,
      "selections": [
        {
          "kind": "RequiredField",
          "field": {
            "alias": null,
            "args": null,
            "fragment": (v0/*: any*/),
            "kind": "RelayResolver",
            "name": "date",
            "resolverModule": fuzzyDateDateResolver,
            "path": "completedAt.date"
          },
          "action": "LOG"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FuzzyDate",
      "kind": "LinkedField",
      "name": "startedAt",
      "plural": false,
      "selections": [
        {
          "kind": "RequiredField",
          "field": {
            "alias": null,
            "args": null,
            "fragment": (v0/*: any*/),
            "kind": "RelayResolver",
            "name": "date",
            "resolverModule": fuzzyDateDateResolver,
            "path": "startedAt.date"
          },
          "action": "LOG"
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
  (node as any).hash = "7ea96ff3f3077ddd3b936961999461bb";
}

export default node;
