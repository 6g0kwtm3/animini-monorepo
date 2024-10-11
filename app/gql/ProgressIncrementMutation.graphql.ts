/**
 * @generated SignedSource<<d2201bbadc0a4d7a581d210a82447f46>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ProgressIncrementMutation$variables = {
  entryId: number;
  progress?: number | null | undefined;
};
export type ProgressIncrementMutation$data = {
  readonly SaveMediaListEntry: {
    readonly id: number;
    readonly progress: number | null | undefined;
  } | null | undefined;
};
export type ProgressIncrementMutation = {
  response: ProgressIncrementMutation$data;
  variables: ProgressIncrementMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "entryId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "progress"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "entryId"
      },
      {
        "kind": "Variable",
        "name": "progress",
        "variableName": "progress"
      }
    ],
    "concreteType": "MediaList",
    "kind": "LinkedField",
    "name": "SaveMediaListEntry",
    "plural": false,
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
        "name": "progress",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProgressIncrementMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProgressIncrementMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "87f302e3b62217327dcc552c5e191d6b",
    "id": null,
    "metadata": {},
    "name": "ProgressIncrementMutation",
    "operationKind": "mutation",
    "text": "mutation ProgressIncrementMutation(\n  $entryId: Int!\n  $progress: Int\n) {\n  SaveMediaListEntry(id: $entryId, progress: $progress) {\n    id\n    progress\n  }\n}\n"
  }
};
})();

if (import.meta.env?.DEV) {
  (node as any).hash = "96c2559ffddaf211452cac9e119adc64";
}

export default node;
