import { type } from "arktype"

export const MediaListSortSchema = type(
	"'MediaSort.TitleEnglish'|'MediaListSort.ScoreDesc'|'MediaListSort.ProgressDesc'|'MediaListSort.UpdatedTimeDesc'|'MediaSort.IdDesc'|'MediaListSort.StartedOnDesc'|'MediaListSort.FinishedOnDesc'|'MediaSort.StartDateDesc'|'AVG_SCORE'|'MediaSort.PopularityDesc'"
)

export const MediaListSort = {
	AvgScore: "AVG_SCORE",
	FinishedOnDesc: "MediaListSort.FinishedOnDesc",
	IdDesc: "MediaSort.IdDesc",
	PopularityDesc: "MediaSort.PopularityDesc",
	ProgressDesc: "MediaListSort.ProgressDesc",
	ScoreDesc: "MediaListSort.ScoreDesc",
	StartDateDesc: "MediaSort.StartDateDesc",
	StartedOnDesc: "MediaListSort.StartedOnDesc",
	TitleEnglish: "MediaSort.TitleEnglish",
	UpdatedTimeDesc: "MediaListSort.UpdatedTimeDesc",
} satisfies Record<string, typeof MediaListSortSchema.infer>
