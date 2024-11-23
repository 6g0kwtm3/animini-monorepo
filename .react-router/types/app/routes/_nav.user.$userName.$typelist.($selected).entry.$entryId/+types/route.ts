// React Router generated types for route:
// routes/_nav.user.$userName.$typelist.($selected).entry.$entryId/route.tsx

import type * as T from "react-router/route-module"

import type { Info as Parent0 } from "../../../+types/root"
import type { Info as Parent1 } from "../../_nav/+types/route"
import type { Info as Parent2 } from "../../_nav.user.$userName/+types/route"
import type { Info as Parent3 } from "../../_nav.user.$userName.$typelist/+types/route"
import type { Info as Parent4 } from "../../_nav.user.$userName.$typelist.($selected)/+types/route"

type Module = typeof import("../route")

export type Info = {
  parents: [Parent0, Parent1, Parent2, Parent3, Parent4],
  id: "routes/_nav.user.$userName.$typelist.($selected).entry.$entryId"
  file: "routes/_nav.user.$userName.$typelist.($selected).entry.$entryId/route.tsx"
  path: "entry/:entryId"
  params: {"userName": string; "typelist": string; "selected"?: string; "entryId": string}
  module: Module
  loaderData: T.CreateLoaderData<Module>
  actionData: T.CreateActionData<Module>
}

export namespace Route {
  export type LinkDescriptors = T.LinkDescriptors
  export type LinksFunction = () => LinkDescriptors

  export type MetaArgs = T.CreateMetaArgs<Info>
  export type MetaDescriptors = T.MetaDescriptors
  export type MetaFunction = (args: MetaArgs) => MetaDescriptors

  export type HeadersArgs = T.HeadersArgs
  export type HeadersFunction = (args: HeadersArgs) => Headers | HeadersInit

  export type LoaderArgs = T.CreateServerLoaderArgs<Info>
  export type ClientLoaderArgs = T.CreateClientLoaderArgs<Info>
  export type ActionArgs = T.CreateServerActionArgs<Info>
  export type ClientActionArgs = T.CreateClientActionArgs<Info>

  export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Info>
  export type ComponentProps = T.CreateComponentProps<Info>
  export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Info>
}