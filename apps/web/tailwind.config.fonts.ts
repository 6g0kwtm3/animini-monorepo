const tokens = {
	"display-lg": {
		fontWeight: 400,
		fontSize: 57,
		tracking: -0.25,
		lineHeight: 64,
	},
	"display-md": { fontWeight: 400, fontSize: 45, tracking: 0, lineHeight: 52 },
	"display-sm": { fontWeight: 400, fontSize: 36, tracking: 0, lineHeight: 44 },
	"headline-lg": { fontWeight: 400, fontSize: 32, tracking: 0, lineHeight: 40 },
	"headline-md": { fontWeight: 400, fontSize: 28, tracking: 0, lineHeight: 36 },
	"headline-sm": { fontWeight: 400, fontSize: 24, tracking: 0, lineHeight: 32 },
	"title-lg": { fontWeight: 400, fontSize: 22, tracking: 0, lineHeight: 28 },
	"title-md": { fontWeight: 500, fontSize: 16, tracking: 0.15, lineHeight: 24 },
	"title-sm": { fontWeight: 500, fontSize: 14, tracking: 0.1, lineHeight: 20 },
	"body-lg": { fontWeight: 400, fontSize: 16, tracking: 0.5, lineHeight: 24 },
	"body-md": { fontWeight: 400, fontSize: 14, tracking: 0.25, lineHeight: 20 },
	"body-sm": { fontWeight: 400, fontSize: 12, tracking: 0.4, lineHeight: 16 },
	"label-lg": { fontWeight: 500, fontSize: 14, tracking: 0.1, lineHeight: 20 },
	"label-md": { fontWeight: 500, fontSize: 12, tracking: 0.5, lineHeight: 16 },
	"label-sm": { fontWeight: 500, fontSize: 11, tracking: 0.5, lineHeight: 16 },
} as const satisfies Record<string, Token>

interface Token {
	fontWeight: number
	/* px */
	fontSize: number
	/* px */
	tracking: number
	/* px */
	lineHeight: number
}

export default tokens

export function pxToRem(px: number) {
	return `${px / 16}rem`
}

export function letterSpacing(token: Token) {
	return `${token.tracking / token.fontSize}rem`
}
