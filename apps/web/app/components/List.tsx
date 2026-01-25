import { createContext, use, type ReactNode } from "react"

import * as design from "@anitrove/design"
import {
	cva,
	defineCva,
	mergeStyles,
	useStyles,
	type CvaProps,
	type PreCompiledStyles,
} from "@anitrove/unstyled"
import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const listItemDefinition = defineCva({
	base: {
		...design.state({
			[design.media.hover]: "hover",
			[design.media["focus-visible"]]: "focus",
			[design.media.active]: "focus",
		}),
		gridColumn: "1 / -1",
		display: "grid",
		gridTemplateColumns: "subgrid",
		...design.utilities.paddingX("1rem"),
		borderRadius: {
			base: design.tokens.borderRadius.xs,
			"&:first-child": `${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs}`,
			"&:last-child": `${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.xs} ${design.tokens.borderRadius.lg} ${design.tokens.borderRadius.lg}`,
			[design.media.hover]: design.tokens.borderRadius.md,
			[design.media["focus-visible"]]: design.tokens.borderRadius.lg,
			[design.media.active]: design.tokens.borderRadius.lg,
		},
		transitionProperty: { [design.media.motionSafe]: "border-radius" },
		...design.tokens.transitions.spatial.fast,
		backgroundColor: design.tokens.colors.surface,
	},
	variants: {
		lines: {
			one: { minHeight: "3.5rem", alignItems: "center" },
			two: { minHeight: "4.5rem", alignItems: "center" },
			three: { minHeight: "5.5rem", alignItems: "flex-start" },
		},
	},
	defaultVariants: { lines: "two" },
})

const listItem = cva(listItemDefinition)

interface ListItemProps extends Omit<
	Ariakit.RoleProps<"li">,
	"className" | "style"
> {
	style?: PreCompiledStyles
}

export function ListItem({ style, ...props }: ListItemProps) {
	const lines = use(Lines)
	const [className, jsx] = useStyles(
		mergeStyles(listItem.style, listItem.variants({ lines }), style)
	)
	return (
		<>
			<Ariakit.Role.li {...props} className={className}></Ariakit.Role.li>
			{jsx}
		</>
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
			"&:last-child": {
				base: "span 2 / span 2",
				"&:first-child": "span 3 / span 3",
			},
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
	style?: PreCompiledStyles
}

export function ListItemContent({
	style,
	...props
}: ListItemContentProps): ReactNode {
	const lines = use(Lines)
	const [className, jsx] = useStyles(
		mergeStyles(
			liteItemContent.style,
			liteItemContent.variants({ lines }),
			style
		)
	)
	return (
		<>
			<Ariakit.Role.div {...props} className={className}></Ariakit.Role.div>
			{jsx}
		</>
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
	style?: PreCompiledStyles
}

export function ListItemContentSubtitle({
	style,
	...props
}: ListItemContentSubtitleProps): ReactNode {
	const lines = use(Lines)
	const [className, jsx] = useStyles(
		mergeStyles(
			listItemSubtitle.style,
			listItemSubtitle.variants({ lines }),
			style
		)
	)
	return (
		<>
			<Ariakit.Role.div {...props} className={className}></Ariakit.Role.div>
			{jsx}
		</>
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
	style?: PreCompiledStyles
}

export function ListItemImg({
	style,
	...props
}: ListItemImgProps): ReactNode {
	const lines = use(Lines)
	const [className, jsx] = useStyles(
		mergeStyles(listItemImg.style, listItemImg.variants({ lines }), style)
	)
	return (
		<>
			<Ariakit.Role.div {...props} className={className}></Ariakit.Role.div>
			{jsx}
		</>
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

interface ListProps
	extends
		CvaProps<typeof listDefinition>,
		Omit<Ariakit.RoleProps<"ul">, "className" | "style"> {
	style?: PreCompiledStyles
}

const listDefinition = defineCva({
	base: {
		display: "grid",
		gridTemplateColumns: "auto minmax(0, 1fr) auto",
		columnGap: "1rem",
	},
	variants: {
		lines: { one: {}, two: {}, three: {} },
		segmented: { true: { rowGap: ".125rem" }, false: {} },
	},
	defaultVariants: { lines: "two", segmented: "true" },
})

const list = cva(listDefinition)

const Lines = createContext<ListProps["lines"]>(undefined)
Lines.displayName = "Lines"

export function List({ style, lines, ...props }: ListProps): ReactNode {
	const [className, jsx] = useStyles(
		mergeStyles(list.style, list.variants({ lines }), style)
	)

	return (
		<Lines value={lines}>
			<Ariakit.Role.ul
				{...props}
				className={`${className} list`}
			></Ariakit.Role.ul>
			{jsx}
		</Lines>
	)
}
