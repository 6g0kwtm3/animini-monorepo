import { use } from "react"
import { isAvailableLanguageTag } from "~/paraglide/runtime"
import { RootProvider } from "./RootProvider"

const rtlLngs = [
	"ar",
	"shu",
	"sqr",
	"ssh",
	"xaa",
	"yhd",
	"yud",
	"aao",
	"abh",
	"abv",
	"acm",
	"acq",
	"acw",
	"acx",
	"acy",
	"adf",
	"ads",
	"aeb",
	"aec",
	"afb",
	"ajp",
	"apc",
	"apd",
	"arb",
	"arq",
	"ars",
	"ary",
	"arz",
	"auz",
	"avl",
	"ayh",
	"ayl",
	"ayn",
	"ayp",
	"bbz",
	"pga",
	"he",
	"iw",
	"ps",
	"pbt",
	"pbu",
	"pst",
	"prp",
	"prd",
	"ug",
	"ur",
	"ydd",
	"yds",
	"yih",
	"ji",
	"yi",
	"hbo",
	"men",
	"xmn",
	"fa",
	"jpr",
	"peo",
	"pes",
	"prs",
	"dv",
	"sam",
	"ckb",
]

export function useLocale(): {
	readonly locale: "en" | "ja"
	readonly dir: "rtl" | "ltr"
} {
	const acceptLanguage = use(RootProvider).language

	const locales =
		acceptLanguage?.split(",").map((lang) => lang.split(";")[0]?.trim()) ?? []

	for (const locale of locales) {
		if (isAvailableLanguageTag(locale)) {
			return { locale, dir: rtlLngs.includes(locale) ? "rtl" : "ltr" } as const
		}
	}

	return { locale: "en", dir: "ltr" } as const
}
