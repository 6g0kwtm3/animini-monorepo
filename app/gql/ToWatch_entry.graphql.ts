/**
 * @generated SignedSource<<8ceb427e874761a57b8b945c43d5dbeb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
import { behind as mediaListBehindResolverType } from "../lib/entry/Behind";
// Type assertion validating that `mediaListBehindResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaListBehindResolverType satisfies (
  rootKey: Behind_entry$key,
) => number | null | undefined);
export type ToWatch_entry$data = {
  readonly behind: NonNullable<number | null | undefined>;
  readonly id: number;
  readonly media: {
    readonly duration: number | null | undefined;
    readonly id: number;
  } | null | undefined;
  readonly " $fragmentType": "ToWatch_entry";
} | null | undefined;
export type ToWatch_entry$key = {
  readonly " $data"?: ToWatch_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"ToWatch_entry">;
};

import {behind as mediaListBehindResolver} from './../lib/entry/Behind';

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
  "name": "ToWatch_entry",
  "selections": [
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "fragment": {
          "args": null,
          "kind": "FragmentSpread",
          "name": "Behind_entry"
        },
        "kind": "RelayResolver",
        "name": "behind",
        "resolverModule": mediaListBehindResolver,
        "path": "behind"
      },
      "action": "NONE",
      "path": "behind"
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
          "name": "duration",
          "storageKey": null
        },
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    (v0/*: any*/)
  ],
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "03f1dc0399f595a3c238b2928056f354";
}

export default node;
