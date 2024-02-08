import { Schema } from "@effect/schema"

const MediaTitle = Schema.struct({
	romaji: Schema.nullish(Schema.string),
	english: Schema.nullish(Schema.string),
	native: Schema.nullish(Schema.string)
})

const MediaCover = Schema.struct({
	medium: Schema.nullish(Schema.string),
	extraLarge: Schema.nullish(Schema.string)
})

export const Media = Schema.struct({
	id: Schema.Int,
	synonyms: Schema.nullish(Schema.array(Schema.nullable(Schema.string))),
	title: Schema.nullish(MediaTitle),
	coverImage: Schema.nullish(MediaCover),
	type: Schema.nullish(Schema.literal("MANGA", "ANIME"))
})
