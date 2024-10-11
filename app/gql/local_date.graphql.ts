/**
 * @generated SignedSource<<f08e8221779dbd00f13b973419a4c127>>
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
export type local_date$data = {
  readonly date: ReturnType<typeof fuzzyDateDateResolverType> | null | undefined;
  readonly " $fragmentType": "local_date";
};
export type local_date$key = {
  readonly " $data"?: local_date$data;
  readonly " $fragmentSpreads": FragmentRefs<"local_date">;
};

import {date as fuzzyDateDateResolver} from './../lib/media/date';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "local_date",
  "selections": [
    {
      "alias": null,
      "args": null,
      "fragment": {
        "args": null,
        "kind": "FragmentSpread",
        "name": "date_date"
      },
      "kind": "RelayResolver",
      "name": "date",
      "resolverModule": fuzzyDateDateResolver,
      "path": "date"
    }
  ],
  "type": "FuzzyDate",
  "abstractKey": null
};

if (import.meta.env.DEV) {
  (node as any).hash = "126cd8026f794965bc18688ae92e9443";
}

export default node;
