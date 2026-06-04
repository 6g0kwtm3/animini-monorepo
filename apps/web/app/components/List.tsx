import { type ReactNode } from "react"

import * as design from "@anitrove/design"
import {
	cva,
	defineCva,
	mergeStyles,
	type CvaProps,
	type OutStyles,
} from "@anitrove/unstyled"
import { Box } from "@anitrove/unstyled/box"
import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { tv } from "~/lib/tailwind-variants"
import { styles } from "./List.styles" with { type: "macro" }
interface ListItemProps extends Omit<
	Ariakit.RoleProps<"li">,
	"className" | "style"
> {
	style?: OutStyles
}

export function ListItem({ style, ...props }: ListItemProps) {
	return (
		<Box
			render={<Ariakit.Role.li {...props} />}
			style={mergeStyles(styles.listItem, style)}
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
	return <Box {...props} style={mergeStyles(styles.listItemContent, style)} />
}

const listItemSubtitleDefinition = defineCva({
	base: {},
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
	return <Box {...props} style={mergeStyles(listItemSubtitle.style, style)} />
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
	return <Box {...props} style={mergeStyles(listItemImg.style, style)} />
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
	style?: OutStyles
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

export function List({ style, lines, ...props }: ListProps): ReactNode {
	return (
		<Box
			render={<Ariakit.Role.ul {...props} />}
			style={mergeStyles(list.style, list.variants({ lines }), style)}
		/>
	)
}
