import { createContext, use, type ReactNode } from "react"

import * as design from "@anitrove/design"
import {
	cva,
	defineCva,
	mergeStyles,
	provide,
	type OutStyles
} from "@anitrove/unstyled"
import { Box } from "@anitrove/unstyled/box"
import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"
import {
	First,
	Last,
	Lines,
	styles,
} from "./List.styles" with { type: "macro" }

interface ListItemProps extends Omit<
	Ariakit.RoleProps<"li">,
	"className" | "style"
> {
	style?: OutStyles
	first: boolean
	last: boolean
}

export function ListItem({ style, first, last, ...props }: ListItemProps) {
	const lines = use(LinesContext)
	return (
		<Box
			render={<Ariakit.Role.li {...props} />}
			style={mergeStyles(
				styles.listItem,
				provide(First, first ? "true" : "false"),
				provide(Last, last ? "true" : "false"),
				provide(Lines, lines),
				style
			)}
		/>
	)
}

export function ListItemContentTitle(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-title" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

const listItemContentDefinition = defineCva({
	base: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		gridColumn: {
			"&:first-child": "span 2 / span 2",
			"&:last-child": "span 2 / span 2",
			"&:only-child": "span 3 / span 3",
		},
	},
	variants: {
		lines: {
			one: { justifyContent: "center", ...design.utilities.paddingY(".5rem") },
			two: { justifyContent: "center", ...design.utilities.paddingY(".5rem") },
			three: {
				justifyContent: "flex-start",
				...design.utilities.paddingY(".75rem"),
			},
		},
	},
	defaultVariants: { lines: "two" },
})

const liteItemContent = cva(listItemContentDefinition)

interface ListItemContentProps extends Omit<
	Ariakit.RoleProps,
	"className" | "style"
> {
	style?: OutStyles
}

export function ListItemContent({
	style,
	...props
}: ListItemContentProps): ReactNode {
	const lines = use(LinesContext)
	return (
		<Box
			{...props}
			style={mergeStyles(
				liteItemContent.style,
				liteItemContent.variants({ lines }),
				style
			)}
		/>
	)
}

const listItemSubtitleDefinition = defineCva({
	base: {
		color: design.tokens.colors["on-surface-variant"],
		...design.tokens.typescale["body-md"],
	},
	variants: {
		lines: {
			one: { display: "none" },
			two: { ...design.utilities.truncate },
			three: { ...design.utilities.lineClamp(2) },
		},
	},
	defaultVariants: { lines: "two" },
})

const listItemSubtitle = cva(listItemSubtitleDefinition)

interface ListItemContentSubtitleProps extends Omit<
	Ariakit.RoleProps,
	"className" | "style"
> {
	style?: OutStyles
}

export function ListItemContentSubtitle({
	style,
	...props
}: ListItemContentSubtitleProps): ReactNode {
	const lines = use(LinesContext)
	return (
		<Box
			{...props}
			style={mergeStyles(
				listItemSubtitle.style,
				listItemSubtitle.variants({ lines }),
				style
			)}
		/>
	)
}

const listItemImgDefinition = defineCva({
	base: {
		height: "3.5rem",
		width: "3.5rem",
		overflow: "hidden",
		display: "grid",
		borderRadius: design.tokens.borderRadius.sm,
	},
	variants: {},
	defaultVariants: {},
})

const listItemImg = cva(listItemImgDefinition)

interface ListItemImgProps extends Omit<
	Ariakit.RoleProps,
	"className" | "style"
> {
	style?: OutStyles
}

export function ListItemImg({ style, ...props }: ListItemImgProps): ReactNode {
	const lines = use(LinesContext)
	return (
		<Box
			{...props}
			style={mergeStyles(
				listItemImg.style,
				listItemImg.variants({ lines }),
				style
			)}
		/>
	)
}

export function ListItemAvatar(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-avatar" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

function ListItemIcon(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-icon" })({ className: props.className })}
		></Ariakit.Role.div>
	)
}

const subheader = tv({
	base: "text-body-md text-on-surface-variant truncate px-4",
	variants: { lines: { one: "py-2", two: "py-2", three: "py-3" } },
	defaultVariants: { lines: "two" },
})

interface SubheaderProps
	extends Ariakit.HeadingProps, VariantProps<typeof subheader> {}

export function Subheader({ lines, ...props }: SubheaderProps): ReactNode {
	return (
		<Ariakit.Heading
			{...props}
			className={subheader({ className: props.className, lines })}
		/>
	)
}

export function ListItemTrailingSupportingText(
	props: Ariakit.RoleProps<"span">
): ReactNode {
	return (
		<Ariakit.Role.span
			{...props}
			className={tv({ base: "list-item-trailing-supporting-text" })({
				className: props.className,
			})}
		/>
	)
}

interface ListProps extends Omit<
	Ariakit.RoleProps<"ul">,
	"className" | "style"
> {
	style?: OutStyles
	lines?: typeof Lines.$T
}

const DEFAULT_LINES = "two" as const
const listDefinition = defineCva({
	base: { display: "flex", flexDirection: "column" },
	variants: {
		lines: { one: {}, two: {}, three: {} },
		segmented: { true: { rowGap: ".125rem" }, false: {} },
	},
	defaultVariants: { lines: DEFAULT_LINES, segmented: "true" },
})

const list = cva(listDefinition)

const LinesContext = createContext<typeof Lines.$T>(DEFAULT_LINES)
LinesContext.displayName = "LinesContext"

export function List({
	style,
	lines = DEFAULT_LINES,
	...props
}: ListProps): ReactNode {
	return (
		<LinesContext value={lines}>
			<Box
				render={<Ariakit.Role.ul {...props} />}
				style={mergeStyles(list.style, list.variants({ lines }), style)}
			/>
		</LinesContext>
	)
}
