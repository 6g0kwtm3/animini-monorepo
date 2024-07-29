import type { ReactNode } from "react"

import { m } from "~/lib/paraglide"

import { MediaListSort } from "~/lib/MediaListSort"

import type { MediaStatus } from "~/gql/Avalible_media.graphql"
import type { MediaFormat } from "~/gql/routeNavUserListEntriesFilter_entries.graphql"

export const ANIME_STATUS_OPTIONS = {
	FINISHED: m.media_status_finished(),
	RELEASING: m.media_status_releasing(),
	NOT_YET_RELEASED: m.media_status_not_yet_released(),
	CANCELLED: m.media_status_cancelled(),
} satisfies Partial<Record<MediaStatus, ReactNode>>

export const MANGA_STATUS_OPTIONS = {
	FINISHED: m.media_status_finished(),
	RELEASING: m.media_status_releasing(),
	HIATUS: m.media_status_hiatus(),
	NOT_YET_RELEASED: m.media_status_not_yet_released(),
	CANCELLED: m.media_status_cancelled(),
} satisfies Partial<Record<MediaStatus, ReactNode>>

export const ANIME_FORMAT_OPTIONS = {
	TV: m.media_format_tv(),
	TV_SHORT: m.media_format_tv_short(),
	MOVIE: m.media_format_movie(),
	SPECIAL: m.media_format_special(),
	OVA: m.media_format_ova(),
	ONA: m.media_format_ona(),
	MUSIC: m.media_format_music(),
} satisfies Partial<Record<MediaFormat, ReactNode>>

export const ANIME_PROGRESS_OPTIONS = {
	UNSEEN: "Unwatched",
	STARTED: "Started",
}

export const MANGA_PROGRESS_OPTIONS = {
	UNSEEN: "Unread",
	STARTED: "Started",
}

export const ANIME_SORT_OPTIONS = {
	[MediaListSort.TitleEnglish]: m.media_sort_title(),
	[MediaListSort.ScoreDesc]: m.media_sort_score(),
	[MediaListSort.ProgressDesc]: m.media_sort_progress(),
	[MediaListSort.UpdatedTimeDesc]: m.media_sort_last_updated(),
	[MediaListSort.IdDesc]: m.media_sort_last_added(),
	[MediaListSort.StartedOnDesc]: m.media_sort_start_date(),
	[MediaListSort.FinishedOnDesc]: m.media_sort_completed_date(),
	[MediaListSort.StartDateDesc]: m.media_sort_release_date(),
	[MediaListSort.AvgScore]: m.media_sort_avg_score(),
	[MediaListSort.PopularityDesc]: m.media_sort_popularity(),
}

export const MANGA_SORT_OPTIONS = { ...ANIME_SORT_OPTIONS }

export const MANGA_FORMAT_OPTIONS = {
	MANGA: m.media_format_manga(),
	NOVEL: m.media_format_novel(),
	ONE_SHOT: m.media_format_one_shot(),
} satisfies Partial<Record<MediaFormat, ReactNode>>
