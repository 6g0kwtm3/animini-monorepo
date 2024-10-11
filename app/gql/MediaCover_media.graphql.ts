/**
 * @generated SignedSource<<4ad8dd6f9bcb436136d10d8537564210>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
import { src as mediaCoverImageSrcResolverType } from "../lib/media/src";
// Type assertion validating that `mediaCoverImageSrcResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaCoverImageSrcResolverType satisfies (
  rootKey: src_mediaCover$key,
  args: {
    extraLarge: boolean | null | undefined;
    large: boolean | null | undefined;
  },
) => string | null | undefined);
import { srcset as mediaCoverImageSrcsetResolverType } from "../lib/media/srcset";
// Type assertion validating that `mediaCoverImageSrcsetResolverType` resolver is correctly implemented.
// A type error here indicates that the type signature of the resolver module is incorrect.
(mediaCoverImageSrcsetResolverType satisfies (
  rootKey: srcset_mediaCover$key,
  args: {
    extraLarge: boolean | null | undefined;
    large: boolean | null | undefined;
  },
) => string | null | undefined);
export type MediaCover_media$data = {
  readonly coverImage: {
    readonly medium: string | null | undefined;
    readonly src: NonNullable<string | null | undefined>;
    readonly srcset: NonNullable<string | null | undefined>;
  } | null | undefined;
  readonly id: number;
  readonly " $fragmentType": "MediaCover_media";
};
export type MediaCover_media$key = {
  readonly " $data"?: MediaCover_media$data;
  readonly " $fragmentSpreads": FragmentRefs<"MediaCover_media">;
};

import {src as mediaCoverImageSrcResolver} from './../lib/media/src';
import {srcset as mediaCoverImageSrcsetResolver} from './../lib/media/srcset';

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Variable",
    "name": "extraLarge",
    "variableName": "extraLarge"
  },
  {
    "kind": "Variable",
    "name": "large",
    "variableName": "large"
  }
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "extraLarge"
    },
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "large"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "MediaCover_media",
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
      "concreteType": "MediaCoverImage",
      "kind": "LinkedField",
      "name": "coverImage",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "medium",
          "storageKey": null
        },
        {
          "kind": "RequiredField",
          "field": {
            "alias": null,
            "args": [],
            "fragment": {
              "args": (v0/*: any*/),
              "kind": "FragmentSpread",
              "name": "src_mediaCover"
            },
            "kind": "RelayResolver",
            "name": "src",
            "resolverModule": mediaCoverImageSrcResolver,
            "path": "coverImage.src"
          },
          "action": "LOG",
          "path": "coverImage.src"
        },
        {
          "kind": "RequiredField",
          "field": {
            "alias": null,
            "args": [],
            "fragment": {
              "args": (v0/*: any*/),
              "kind": "FragmentSpread",
              "name": "srcset_mediaCover"
            },
            "kind": "RelayResolver",
            "name": "srcset",
            "resolverModule": mediaCoverImageSrcsetResolver,
            "path": "coverImage.srcset"
          },
          "action": "LOG",
          "path": "coverImage.srcset"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Media",
  "abstractKey": null
};
})();

if (import.meta.env.DEV) {
  (node as any).hash = "b558b15bcaeb897f02a6b191b4987d90";
}

export default node;
