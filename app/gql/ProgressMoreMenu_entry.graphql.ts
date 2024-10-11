/**
 * @generated SignedSource<<f7da94a67d84b30138078fd8483bf481>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProgressMoreMenu_entry$data = {
  readonly id: number;
  readonly media: {
    readonly id: number;
    readonly " $fragmentSpreads": FragmentRefs<"ProgressShareMedia_media">;
  } | null | undefined;
  readonly " $fragmentType": "ProgressMoreMenu_entry";
};
export type ProgressMoreMenu_entry$key = {
  readonly " $data"?: ProgressMoreMenu_entry$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProgressMoreMenu_entry">;
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
  "name": "ProgressMoreMenu_entry",
  "selections": [
    (v0/*: any*/),
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
          "name": "ProgressShareMedia_media"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MediaList",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "c859a011bc550f57d0b0eef0b7c322b0";
}

export default node;
