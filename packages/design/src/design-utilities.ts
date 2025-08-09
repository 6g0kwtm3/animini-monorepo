import colors from "./design-colors.json"

export const contrast = (value: string): Record<`--${string}`, string> => {
	return Object.fromEntries(
		Object.keys(colors.dark).flatMap((key): [`--${string}`, string][] => {
			return [
				[`--${key}-light`, `var(--${key}-light-${value})`],
				[`--${key}-dark`, `var(--${key}-dark-${value})`],
			]
		})
	)
}

export const theme = (value: string): Record<`--${string}`, string> => {
	return Object.fromEntries(
		Object.keys(colors.dark).map((key): [`--${string}`, string] => {
			return [`--${key}`, `var(--${key}-${value})`]
		})
	)
}
