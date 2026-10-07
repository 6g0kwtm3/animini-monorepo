import { Badge } from "@animedes/components/Badge"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
} from "@animedes/components/List"
import * as Predicate from "@animedes/components/Predicate"
import { Skeleton } from "@animedes/components/Skeleton"
import { A } from "@anitrove/a"
import { media, utilities } from "@anitrove/design"
import { create } from "@anitrove/unstyled"
import {
	mergeStyles,
	precompileStyles,
	type OutStyles,
} from "@anitrove/unstyled"
import { Box } from "@anitrove/unstyled/box"
import { CompositeItem, CompositeRow } from "@ariakit/react"
import ReactRelay from "react-relay"
import { m } from "~/lib/paraglide"
import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off"

import { useFragment } from "../Network"
import { route_media } from "../route"
import { MediaCover } from "./MediaCover"
import { MediaTitle } from "./MediaTitle"
import { formatWatch } from "./ToWatch"

import type { ReactNode } from "react"
import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import type { MediaListItem_media$key } from "~/gql/MediaListItem_media.graphql"
import type {
	MediaListItemSubtitle_entry$key,
	MediaType,
} from "~/gql/MediaListItemSubtitle_entry.graphql"

export const styles = create({
	item: {
		...utilities.theme({
			[media.hover]: { base: "light", [media.dark]: "dark" },
			[media.focusWithin]: { base: "light", [media.dark]: "dark" },
		}),
		...utilities.contrast({
			[media.hover]: { base: "standard", [media.dark]: "high" },
			[media.focusWithin]: { base: "standard", [media.dark]: "high" },
		}),
	},
	avatar: { position: "relative" },
	subtitle: { display: "flex", flexWrap: "wrap", gap: ".25rem" },
})
