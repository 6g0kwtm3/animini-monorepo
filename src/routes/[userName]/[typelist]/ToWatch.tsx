import type { GraphQL } from "$houdini"

interface Props {
  entry: GraphQL<`
  {... on MediaList  @componentField(field: "ToWatch", prop: "entry") {
        progress
        media {
          episodes
          nextAiringEpisode {
            id
            episode
          }
          duration
          status
          id
        }}
      }`>
}

function formatWatch(minutes: number) {
  if (!isFinite(minutes)) {
    return ""
  }
  if (minutes > 60) {
    return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
  }
  return minutes + "min"
}

export default function ToWatch({ entry }: Props) {
  return (
    <>
      {formatWatch(
        ((entry.media?.nextAiringEpisode?.episode - 1 ||
          entry.media?.episodes ||
          Infinity) -
          (entry.progress ?? 0)) *
          ((entry.media?.duration ?? 25) - 3) || Infinity,
      )}
    </>
  )
}
