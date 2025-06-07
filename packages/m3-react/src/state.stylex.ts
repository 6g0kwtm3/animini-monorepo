import * as stylex from "@stylexjs/stylex"

export const motion = stylex.defineConsts({
	safe: "@media (prefers-reduced-motion: no-preference)",
})

export const theme = stylex.defineConsts({
	dark: "@media (prefers-color-scheme: dark)",
})

export const breakpoints = stylex.defineConsts({
	sm: "@media (width >= 600px)",
	md: "@media (width >= 840px)",
	lg: "@media (width >= 1200px)",
	xl: "@media (width >= 1600px)",
	maxSm: "@media (width < 600px)",
	maxMd: "@media (width < 840px)",
	maxLg: "@media (width < 1200px)",
	maxXl: "@media (width < 1600px)",
})

export const state = stylex.defineConsts({
	none: null,
	hover:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 92%), color-mix(in oklab, currentColor, transparent 92%))",
	focus:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 90%), color-mix(in oklab, currentColor, transparent 90%))",
	pressed:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 90%), color-mix(in oklab, currentColor, transparent 90%))",
	dragged:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 84%), color-mix(in oklab, currentColor, transparent 84%))",
})

export const durations = stylex.defineVars({
	spatialFast: "350ms",
	spatial: "500ms",
	spatialSlow: "650ms",
	effectsFast: "150ms",
	effects: "200ms",
	effectsSlow: "300ms",
})

export const easings = stylex.defineVars({
	spatialFast: "cubic-bezier(0.42, 1.67, 0.21, 0.9)",
	spatial: "cubic-bezier(0.38, 1.21, 0.22, 1.00)",
	spatialSlow: "cubic-bezier(0.39, 1.29, 0.35, 0.98)",
	effectsFast: "cubic-bezier(0.31, 0.94, 0.34, 1.00)",
	effects: "cubic-bezier(0.34, 0.80, 0.34, 1.00)",
	effectsSlow: "cubic-bezier(0.34, 0.88, 0.34, 1.00)",
})

export const fonts = stylex.defineVars({
	displayLg:
		"400 3.5625rem/1.1228070175438596 'Roboto_Flex','Noto_Sans',sans-serif",
	displayMd:
		"400 2.8125rem/1.1555555555555554 'Roboto_Flex','Noto_Sans',sans-serif",
	displaySm:
		"400 2.25rem/1.2222222222222223 'Roboto_Flex','Noto_Sans',sans-serif",
	headlineLg: "400 2rem/1.25 'Roboto_Flex','Noto_Sans',sans-serif",
	headlineMd:
		"400 1.75rem/1.2857142857142858 'Roboto_Flex','Noto_Sans',sans-serif",
	headlineSm:
		"400 1.5rem/1.3333333333333333 'Roboto_Flex','Noto_Sans',sans-serif",
	titleLg:
		"400 1.375rem/1.2727272727272727 'Roboto_Flex','Noto_Sans',sans-serif",
	titleMd: "500 1rem/1.5 'Roboto_Flex','Noto_Sans',sans-serif",
	titleSm:
		"500 0.875rem/1.4285714285714286 'Roboto_Flex','Noto_Sans',sans-serif",
	labelLg:
		"500 0.875rem/1.4285714285714286 'Roboto_Flex','Noto_Sans',sans-serif",
	labelMd:
		"500 0.75rem/1.3333333333333333 'Roboto_Flex','Noto_Sans',sans-serif",
	labelSm:
		"500 0.6875rem/1.6666666666666667 'Roboto_Flex','Noto_Sans',sans-serif",
	bodyLg: "400 1rem/1.5 'Roboto_Flex','Noto_Sans',sans-serif",
	bodyMd:
		"400 0.875rem/1.4285714285714286 'Roboto_Flex','Noto_Sans',sans-serif",
	bodySm: "400 0.75rem/1.3333333333333333 'Roboto_Flex','Noto_Sans',sans-serif",
})

export const letterSpacings = stylex.defineVars({
	displayLg: "0",
	displayMd: "0",
	displaySm: "0",
	headlineLg: "0",
	headlineMd: "0",
	headlineSm: "0",
	titleLg: "0",
	titleMd: "0.009375em",
	titleSm: "0.0071428571428571435em",
	labelLg: "0.0071428571428571435em",
	labelMd: "0.041666666666666664em",
	labelSm: "0.045454545454545456em",
	bodyLg: "0.03125em",
	bodyMd: "0.017857142857142856em",
	bodySm: "0.03333333333333333em",
})

export const colors = stylex.defineConsts({
	scrim: "rgb(var(--scrim))",
	primary: "rgb(var(--primary))",
	primaryContainer: "rgb(var(--primary-container))",
	onPrimary: "rgb(var(--on-primary))",
	onPrimaryContainer: "rgb(var(--on-primary-container))",
	inversePrimary: "rgb(var(--inverse-primary))",
	primaryFixed: "rgb(var(--primary-fixed))",
	primaryFixedDim: "rgb(var(--primary-fixed-dim))",
	onPrimaryFixed: "rgb(var(--on-primary-fixed))",
	onPrimaryFixedVariant: "rgb(var(--on-primary-fixed-variant))",
	secondary: "rgb(var(--secondary))",
	secondaryContainer: "rgb(var(--secondary-container))",
	onSecondary: "rgb(var(--on-secondary))",
	onSecondaryContainer: "rgb(var(--on-secondary-container))",
	secondaryFixed: "rgb(var(--secondary-fixed))",
	secondaryFixedDim: "rgb(var(--secondary-fixed-dim))",
	onSecondaryFixed: "rgb(var(--on-secondary-fixed))",
	onSecondaryFixedVariant: "rgb(var(--on-secondary-fixed-variant))",
	tertiary: "rgb(var(--tertiary))",
	tertiaryContainer: "rgb(var(--tertiary-container))",
	onTertiary: "rgb(var(--on-tertiary))",
	onTertiaryContainer: "rgb(var(--on-tertiary-container))",
	tertiaryFixed: "rgb(var(--tertiary-fixed))",
	tertiaryFixedDim: "rgb(var(--tertiary-fixed-dim))",
	onTertiaryFixed: "rgb(var(--on-tertiary-fixed))",
	onTertiaryFixedVariant: "rgb(var(--on-tertiary-fixed-variant))",
	surface: "rgb(var(--surface))",
	onSurface: "rgb(var(--on-surface))",
	onSurface12: "rgb(var(--on-surface) / 12%)",
	onSurface38: "rgb(var(--on-surface) / 38%)",
	onSurfaceVariant: "rgb(var(--on-surface-variant))",
	inverseSurface: "rgb(var(--inverse-surface))",
	inverseOnSurface: "rgb(var(--inverse-on-surface))",
	surfaceDim: "rgb(var(--surface-dim))",
	surfaceBright: "rgb(var(--surface-bright))",
	surfaceContainerLowest: "rgb(var(--surface-container-lowest))",
	surfaceContainerLow: "rgb(var(--surface-container-low))",
	surfaceContainer: "rgb(var(--surface-container))",
	surfaceContainerHigh: "rgb(var(--surface-container-high))",
	surfaceContainerHighest: "rgb(var(--surface-container-highest))",
	background: "rgb(var(--background))",
	onBackground: "rgb(var(--on-background))",
	outline: "rgb(var(--outline))",
	outlineVariant: "rgb(var(--outline-variant))",
	error: "rgb(var(--error))",
	errorContainer: "rgb(var(--error-container))",
	onError: "rgb(var(--on-error))",
	onErrorContainer: "rgb(var(--on-error-container))",
	shadow: "rgb(var(--shadow))",
})
