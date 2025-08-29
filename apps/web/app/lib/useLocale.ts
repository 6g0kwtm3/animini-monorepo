import { isLocale } from "~/paraglide/runtime"

const rtlLngs = new Set([
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
	"ar",
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
	"ckb",
	"dv",
	"fa",
	"hbo",
	"he",
	"iw",
	"ji",
	"jpr",
	"men",
	"pbt",
	"pbu",
	"peo",
	"pes",
	"pga",
	"prd",
	"prp",
	"prs",
	"ps",
	"pst",
	"sam",
	"shu",
	"sqr",
	"ssh",
	"ug",
	"ur",
	"xaa",
	"xmn",
	"ydd",
	"yds",
	"yhd",
	"yi",
	"yih",
	"yud",
])

export function languageToLocale(
	acceptLanguage: null | string
): null | { readonly dir: "ltr" | "rtl"; readonly lang: "en" | "ja"; } {
	const locales =
		acceptLanguage?.split(",").map((lang) => lang.split(";")[0]?.trim()) ?? []

	for (const locale of locales) {
		if (isLocale(locale)) {
			return { lang: locale, dir: rtlLngs.has(locale) ? "rtl" : "ltr" } as const
		}
	}

	return null
}
