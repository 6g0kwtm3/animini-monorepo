import { Schema } from "@effect/schema"

const MediaTitle = Schema.struct({
	romaji: Schema.nullable(Schema.string),
	english: Schema.nullable(Schema.string),
	native: Schema.nullable(Schema.string)
})

const MediaCover = Schema.struct({
	medium: Schema.nullable(Schema.string),
	extraLarge: Schema.nullable(Schema.string)
})

export const Media = Schema.struct({
	id: Schema.Int,
	synonyms: Schema.nullable(Schema.array(Schema.nullable(Schema.string))),
	title: Schema.nullable(MediaTitle),
	coverImage: Schema.nullable(MediaCover),
	type: Schema.nullable(Schema.literal("MANGA", "ANIME"))
})
