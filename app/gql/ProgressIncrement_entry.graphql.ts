/**
 * @generated SignedSource<<235b5cd2c9c9cffdc3e80abf4f108f28>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProgressIncrement_entry$data = {
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly " $fragmentSpreads": FragmentRefs<"ProgressTooltip_media">;
  } | null | undefined;
  readonly progress: number | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"Progress_entry">;
  readonly " $fragmentType": "ProgressIncrement_entry";
};
export type ProgressIncrement_entry$key = {
  readonly " $data"?: ProgressIncrement_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProgressIncrement_entry">;
};

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
  "name": "ProgressIncrement_entry",
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
          "args": null,
          "kind": "FragmentSpread",
          "name": "ProgressTooltip_media"
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
  (node as any).hash = "e97c17f18f9f473afdb4781f965ef5ef";
}

export default node;
