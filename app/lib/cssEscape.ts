export const cssEscape = function (value: string) {
	if (arguments.length === 0) {
		throw new TypeError("`CSS.escape` requires an argument.")
	}
	var string = String(value)
	var length = string.length
	var index = -1
	var codeUnit: number
	var result = ""
	var firstCodeUnit = string.codePointAt(0)

	if (
		// If the character is the first character and is a `-` (U+002D), and
		// there is no second character, […]
		length == 1 &&
		firstCodeUnit == 0x00_2d
	) {
		return "\\" + string
	}

	while (++index < length) {
		codeUnit = string.codePointAt(index)!
		// Note: there’s no need to special-case astral symbols, surrogate
		// pairs, or lone surrogates.

		// If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
		// (U+FFFD).
		if (codeUnit == 0x00_00) {
			result += "\uFFFD"
			continue
		}

		if (
			// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
			// U+007F, […]
			(codeUnit >= 0x00_01 && codeUnit <= 0x00_1f) ||
			codeUnit == 0x00_7f ||
			// If the character is the first character and is in the range [0-9]
			// (U+0030 to U+0039), […]
			(index == 0 && codeUnit >= 0x00_30 && codeUnit <= 0x00_39) ||
			// If the character is the second character and is in the range [0-9]
			// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
			(index == 1 &&
				codeUnit >= 0x00_30 &&
				codeUnit <= 0x00_39 &&
				firstCodeUnit == 0x00_2d)
		) {
			// https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
			result += "\\" + codeUnit.toString(16) + " "
			continue
		}

		// If the character is not handled by one of the above rules and is
		// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
		// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
		// U+005A), or [a-z] (U+0061 to U+007A), […]
		if (
			codeUnit >= 0x00_80 ||
			codeUnit == 0x00_2d ||
			codeUnit == 0x00_5f ||
			(codeUnit >= 0x00_30 && codeUnit <= 0x00_39) ||
			(codeUnit >= 0x00_41 && codeUnit <= 0x00_5a) ||
			(codeUnit >= 0x00_61 && codeUnit <= 0x00_7a)
		) {
			// the character itself
			result += string.charAt(index)
			continue
		}

		// Otherwise, the escaped character.
		// https://drafts.csswg.org/cssom/#escape-a-character
		result += "\\" + string.charAt(index)
	}
	return result
}
