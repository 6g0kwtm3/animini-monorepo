import { type } from "arktype"

export const MediaListSortSchema = type(
	"'MediaSort.TitleEnglish'|'MediaListSort.ScoreDesc'|'MediaListSort.ProgressDesc'|'MediaListSort.UpdatedTimeDesc'|'MediaSort.IdDesc'|'MediaListSort.StartedOnDesc'|'MediaListSort.FinishedOnDesc'|'MediaSort.StartDateDesc'|'AVG_SCORE'|'MediaSort.PopularityDesc'"
)

export const MediaListSort = {
	TitleEnglish: "MediaSort.TitleEnglish",
	ScoreDesc: "MediaListSort.ScoreDesc",
	ProgressDesc: "MediaListSort.ProgressDesc",
	UpdatedTimeDesc: "MediaListSort.UpdatedTimeDesc",
	IdDesc: "MediaSort.IdDesc",
	StartedOnDesc: "MediaListSort.StartedOnDesc",
	FinishedOnDesc: "MediaListSort.FinishedOnDesc",
	StartDateDesc: "MediaSort.StartDateDesc",
	AvgScore: "AVG_SCORE",
	PopularityDesc: "MediaSort.PopularityDesc",
} satisfies Record<string, typeof MediaListSortSchema.infer>
