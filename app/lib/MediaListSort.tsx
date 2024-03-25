import * as api from "~/gql/graphql";



export enum MediaListSort {
	TitleEnglish = api.MediaSort.TitleEnglish,
	ScoreDesc = api.MediaListSort.ScoreDesc,
	ProgressDesc = api.MediaListSort.ProgressDesc,
	UpdatedTimeDesc = api.MediaListSort.UpdatedTimeDesc,
	IdDesc = api.MediaSort.IdDesc,
	StartedOnDesc = api.MediaListSort.StartedOnDesc,
	FinishedOnDesc = api.MediaListSort.FinishedOnDesc,
	StartDateDesc = api.MediaSort.StartDateDesc,
	AvgScore = "AVG_SCORE",
	PopularityDesc = api.MediaSort.PopularityDesc
}
