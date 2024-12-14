/**
 * @generated SignedSource<<f8ee79a208c7c981e7fa20390f737e53>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type MediaType = "ANIME" | "MANGA" | "%future added value";
import { FragmentRefs } from "relay-runtime";
import { theme as mediaCoverImageThemeResolverType } from "../lib/media/Theme";
// Type assertion validating that `mediaCoverImageThemeResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaCoverImageThemeResolverType satisfies (
  rootKey: Theme_mediaCover$key,
) => unknown | null | undefined);
export type MediaLink_media$data = {
  readonly coverImage: {
    readonly theme: ReturnType<typeof mediaCoverImageThemeResolverType> | null | undefined;
  } | null | undefined;
  readonly id: number;
  readonly title: {
    readonly " $fragmentSpreads": FragmentRefs<"MediaTitle_mediaTitle">;
  };
  readonly type: MediaType | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
  readonly " $fragmentType": "MediaLink_media";
} | null | undefined;
export type MediaLink_media$key = {
  readonly " $data"?: MediaLink_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaLink_media">;
};

import {theme as mediaCoverImageThemeResolver} from './../lib/media/Theme';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaLink_media",
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
      "name": "type",
      "storageKey": null
    },
    {
      "kind": "RequiredField",
      "field": {
        "alias": null,
        "args": null,
        "concreteType": "MediaTitle",
        "kind": "LinkedField",
        "name": "title",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MediaTitle_mediaTitle"
          }
        ],
        "storageKey": null
      },
      "action": "LOG",
      "path": "title"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MediaCoverImage",
      "kind": "LinkedField",
      "name": "coverImage",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "fragment": {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Theme_mediaCover"
          },
          "kind": "RelayResolver",
          "name": "theme",
          "resolverModule": mediaCoverImageThemeResolver,
          "path": "coverImage.theme"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MediaCover_media"
    }
  ],
  "type": "Media",
  "abstractKey": null
};

if (import.meta.env?.DEV) {
  (node as any).hash = "a4371566ee8deade84899752cb450049";
}

export default node;
