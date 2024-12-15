/**
 * @generated SignedSource<<8f96439a46f1815f09ba9699c88400ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavNotifications_query$data = {
  readonly Page: {
    readonly notifications: ReadonlyArray<{
      readonly __typename: "ActivityLikeNotification";
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"ActivityLike_notification">;
    } | {
      readonly __typename: "AiringNotification";
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"Airing_notification">;
    } | {
      readonly __typename: "RelatedMediaAdditionNotification";
      readonly id: number;
      readonly " $fragmentSpreads": FragmentRefs<"RelatedMediaAddition_notification">;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    } | null | undefined> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "routeNavNotifications_query";
};
export type routeNavNotifications_query$key = {
  readonly " $data"?: routeNavNotifications_query$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeNavNotifications_query">;
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
  "name": "routeNavNotifications_query",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Page",
      "kind": "LinkedField",
      "name": "Page",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "type_in",
              "value": [
                "AIRING",
                "RELATED_MEDIA_ADDITION",
                "ACTIVITY_LIKE"
              ]
            }
          ],
          "concreteType": null,
          "kind": "LinkedField",
          "name": "notifications",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__typename",
              "storageKey": null
            },
            {
              "kind": "InlineFragment",
              "selections": [
                (v0/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "Airing_notification"
                }
              ],
              "type": "AiringNotification",
              "abstractKey": null
            },
            {
              "kind": "InlineFragment",
              "selections": [
                (v0/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "RelatedMediaAddition_notification"
                }
              ],
              "type": "RelatedMediaAdditionNotification",
              "abstractKey": null
            },
            {
              "kind": "InlineFragment",
              "selections": [
                (v0/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ActivityLike_notification"
                }
              ],
              "type": "ActivityLikeNotification",
              "abstractKey": null
            }
          ],
          "storageKey": "notifications(type_in:[\"AIRING\",\"RELATED_MEDIA_ADDITION\",\"ACTIVITY_LIKE\"])"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "f431de894479b95002f72b687576504d";
}

export default node;
