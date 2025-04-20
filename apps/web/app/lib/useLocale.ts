import { isLocale } from "~/paraglide/runtime"

const rtlLngs = new Set([
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
])

export function languageToLocale(
	acceptLanguage: string | null
): { readonly lang: "en" | "ja"; readonly dir: "rtl" | "ltr" } | null {
	const locales =
		acceptLanguage?.split(",").map((lang) => lang.split(";")[0]?.trim()) ?? []

	for (const locale of locales) {
		if (isLocale(locale)) {
			return { lang: locale, dir: rtlLngs.has(locale) ? "rtl" : "ltr" } as const
		}
	}

	return null
}
