import { create } from "@anitrove/unstyled"
import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import ReactRelay from "react-relay"

import type { ReactNode } from "react"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
} from "~/components/List"

import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off"
import { route_media } from "../route"
import { MediaCover } from "./MediaCover"
import { formatWatch } from "./ToWatch"

import { A } from "@anitrove/a"
import { media, utilities } from "@anitrove/design"
import {
	mergeStyles,
	precompileStyles,
	type OutStyles,
} from "@anitrove/unstyled"
import { CompositeItem, CompositeRow } from "@ariakit/react"
import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import type { MediaListItem_media$key } from "~/gql/MediaListItem_media.graphql"

import { Box } from "@anitrove/unstyled/box"
import { Badge } from "~/components/Badge"
import type {
	MediaListItemSubtitle_entry$key,
	MediaType,
} from "~/gql/MediaListItemSubtitle_entry.graphql"
import * as Predicate from "~/lib/Predicate"
import { useFragment } from "../Network"
import { MediaTitle } from "./MediaTitle"

export const styles = create({
	item: {
		...utilities.theme({
			[media.hover]: { default: "light", [media.dark]: "dark" },
			[media.focusWithin]: { default: "light", [media.dark]: "dark" },
		}),
		...utilities.contrast({
			[media.hover]: { default: "standard", [media.dark]: "high" },
			[media.focusWithin]: { default: "standard", [media.dark]: "high" },
		}),
	},
	avatar: { position: "relative" },
	subtitle: { display: "flex", flexWrap: "wrap", gap: ".25rem" },
})
