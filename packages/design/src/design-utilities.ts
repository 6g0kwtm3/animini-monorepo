import { mapValue, type Value } from "@anitrove/unstyled/value"

import type { RawStyles } from "@anitrove/unstyled"
import type { Property } from "csstype"
import colors from "./design-colors"

export const contrast = (
	value: Value<string>
): Record<`--${string}`, Value<string>> => {
	return Object.fromEntries(
		Object.keys(colors.dark).flatMap(
			(key): [`--${string}`, Value<string>][] => {
				return [
					[
						`--${key}-light`,
						mapValue(value, (value) => `var(--${key}-light-${value})`),
					],
					[
						`--${key}-dark`,
						mapValue(value, (value) => `var(--${key}-dark-${value})`),
					],
				]
			}
		)
	)
}

export const theme = (
	value: Value<string>
): Record<`--${string}`, Value<string>> => {
	return Object.fromEntries(
		Object.keys(colors.dark).map((key): [`--${string}`, Value<string>] => {
			return [`--${key}`, mapValue(value, (value) => `var(--${key}-${value})`)]
		})
	)
}

export const marginX = (value: Value<Property.MarginInline | undefined>) => {
	return { marginInline: value } satisfies RawStyles
}

export const marginEnd = (
	value: Value<Property.MarginInlineEnd | undefined>
) => {
	return { marginInlineEnd: value } satisfies RawStyles
}

export const marginStart = (
	value: Value<Property.MarginInlineStart | undefined>
) => {
	return { marginInlineStart: value } satisfies RawStyles
}

export const marginY = (value: Value<Property.MarginBlock | undefined>) => {
	return { marginBlock: value } satisfies RawStyles
}

export const paddingX = (value: Value<Property.PaddingInline | undefined>) => {
	return { paddingInline: value } satisfies RawStyles
}

export const paddingY = (value: Value<Property.PaddingBlock | undefined>) => {
	return { paddingBlock: value } satisfies RawStyles
}

export const paddingBottom = (
	value: Value<Property.PaddingInlineEnd | undefined>
) => {
	return { paddingInlineEnd: value } satisfies RawStyles
}

export const truncate = {
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
} satisfies RawStyles
