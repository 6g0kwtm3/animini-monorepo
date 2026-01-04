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
import { paddingY } from "node_modules/@anitrove/design/src/design-utilities"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"

const listItemDefinition = defineCva({
	base: {
		...design.state({
			hover: "hover",
			[design.media["focus-visible"]]: "focus",
			[design.media.active]: "focus",
		}),
		gridColumn: "1 / -1",
		display: "grid",
		gridTemplateColumns: "subgrid",
		...design.utilities.paddingX("1rem"),
	},
	variants: {
		lines: {
			one: { minHeight: "3.5rem", alignItems: "center" },
			two: { minHeight: "4.5rem", alignItems: "center" },
			three: { minHeight: "5.5rem", alignItems: "flex-start" },
		},
	},
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
			one: { justifyContent: "center", ...paddingY(".5rem") },
			two: { justifyContent: "center", ...paddingY(".5rem") },
			three: { justifyContent: "flex-start", ...paddingY(".75rem") },
		},
	},
})

const liteItemContent = cva(listItemContentDefinition)

interface ListItemContentProps extends Omit<
	Ariakit.RoleProps,
	"style" | "className"
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

export function ListItemContentSubtitle(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-subtitle" })({
				className: props.className,
			})}
		></Ariakit.Role.div>
	)
}

export function ListItemImg(props: Ariakit.RoleProps): ReactNode {
	return (
		<Ariakit.Role.div
			{...props}
			className={tv({ base: "list-item-img" })({ className: props.className })}
		></Ariakit.Role.div>
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
	variants: { lines: { one: {}, two: {}, three: {} } },
})

const list = cva(listDefinition)

const Lines = createContext<ListProps["lines"]>(undefined)

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
