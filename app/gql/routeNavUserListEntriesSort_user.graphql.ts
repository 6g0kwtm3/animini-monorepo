/**
 * @generated SignedSource<<4bc3a8c3d1239421df549857c4cef814>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderInlineDataFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type routeNavUserListEntriesSort_user$data = {
  readonly id: number;
  readonly mediaListOptions: {
    readonly rowOrder: string | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "routeNavUserListEntriesSort_user";
};
export type routeNavUserListEntriesSort_user$key = {
  readonly " $data"?: routeNavUserListEntriesSort_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"routeNavUserListEntriesSort_user">;
};

const node: ReaderInlineDataFragment = {
  "kind": "InlineDataFragment",
  "name": "routeNavUserListEntriesSort_user"
};

if (import.meta.env?.DEV) {
  (node as any).hash = "9b7ca834f3c8a88bd29b908d77ccbc24";
}

export default node;
