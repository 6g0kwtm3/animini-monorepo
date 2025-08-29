import { numberToString } from "utilities"

const tokens = {
	"body-lg": { fontSize: 16, fontWeight: 400, lineHeight: 24, tracking: 0.5 },
	"body-md": { fontSize: 14, fontWeight: 400, lineHeight: 20, tracking: 0.25 },
	"body-sm": { fontSize: 12, fontWeight: 400, lineHeight: 16, tracking: 0.4 },
	"display-lg": {
		fontSize: 57,
		fontWeight: 400,
		lineHeight: 64,
		tracking: -0.25,
	},
	"display-md": { fontSize: 45, fontWeight: 400, lineHeight: 52, tracking: 0 },
	"display-sm": { fontSize: 36, fontWeight: 400, lineHeight: 44, tracking: 0 },
	"headline-lg": { fontSize: 32, fontWeight: 400, lineHeight: 40, tracking: 0 },
	"headline-md": { fontSize: 28, fontWeight: 400, lineHeight: 36, tracking: 0 },
	"headline-sm": { fontSize: 24, fontWeight: 400, lineHeight: 32, tracking: 0 },
	"label-lg": { fontSize: 14, fontWeight: 500, lineHeight: 20, tracking: 0.1 },
	"label-md": { fontSize: 12, fontWeight: 500, lineHeight: 16, tracking: 0.5 },
	"label-sm": { fontSize: 11, fontWeight: 500, lineHeight: 16, tracking: 0.5 },
	"title-lg": { fontSize: 22, fontWeight: 400, lineHeight: 28, tracking: 0 },
	"title-md": { fontSize: 16, fontWeight: 500, lineHeight: 24, tracking: 0.15 },
	"title-sm": { fontSize: 14, fontWeight: 500, lineHeight: 20, tracking: 0.1 },
} as const satisfies Record<string, Token>

interface Token {
	/* px */
	fontSize: number
	fontWeight: number
	/* px */
	lineHeight: number
	/* px */
	tracking: number
}

export default tokens

export function letterSpacing(token: Pick<Token, "fontSize" | "tracking">) {
	return `${numberToString(token.tracking / token.fontSize)}rem`
}

export function pxToRem(px: number) {
	return `${numberToString(px / 16)}rem`
}
