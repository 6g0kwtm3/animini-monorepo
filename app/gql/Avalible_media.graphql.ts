/**
 * @generated SignedSource<<6af7560d429f5209caf8e4bfbf368028>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type MediaStatus = "CANCELLED" | "FINISHED" | "HIATUS" | "NOT_YET_RELEASED" | "RELEASING" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type Avalible_media$data = {
  readonly chapters: number | null | undefined;
  readonly episodes: number | null | undefined;
  readonly id: number;
  readonly nextAiringEpisode: {
    readonly episode: number;
    readonly id: number;
  } | null | undefined;
  readonly status: MediaStatus | null | undefined;
  readonly " $fragmentType": "Avalible_media";
};
export type Avalible_media$key = {
  readonly " $data"?: Avalible_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"Avalible_media">;
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
  "name": "Avalible_media",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "version",
          "value": 2
        }
      ],
      "kind": "ScalarField",
      "name": "status",
      "storageKey": "status(version:2)"
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
      "concreteType": "AiringSchedule",
      "kind": "LinkedField",
      "name": "nextAiringEpisode",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "episode",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v0/*: any*/)
  ],
  "type": "Media",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "5b64aa7db6309d0a242cc4341b9006d4";
}

export default node;
