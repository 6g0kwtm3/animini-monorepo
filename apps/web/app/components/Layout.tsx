import { type ComponentProps, type ReactNode } from "react"

import { mergeStyles, provide, type OutStyles } from "@anitrove/unstyled"
import { Box } from "@anitrove/unstyled/box"

import {
	Navigation,
	styles,
	Variant,
} from "./Layout.styles" with { type: "macro" }

interface LayoutProps extends Omit<
	ComponentProps<"div">,
	"className" | "style"
> {
	style?: OutStyles
	navigation?: typeof Navigation.$T
}

export function Layout({ style, navigation = "none", ...props }: LayoutProps) {
	return (
		<Box
			{...props}
			style={mergeStyles(styles.layout, provide(Navigation, navigation), style)}
		></Box>
	)
}

interface LayoutBodyProps extends Omit<
	ComponentProps<"main">,
	"className" | "style"
> {
	style?: OutStyles
}

export function LayoutBody({ style, ...props }: LayoutBodyProps): ReactNode {
	return (
		<Box render={<main {...props} />} style={mergeStyles(styles.body, style)} />
	)
}

import * as Ariakit from "@ariakit/react"
interface LayoutPaneProps extends Omit<
	Ariakit.RoleProps<"section">,
	"className" | "style"
> {
	style?: OutStyles
	variant?: typeof Variant.$T
}

export function LayoutPane({
	style,
	variant = 'flexible',
	...props
}: LayoutPaneProps): ReactNode {
	return (
		<Box
			render={<Ariakit.Role.section {...props}></Ariakit.Role.section>}
			style={mergeStyles(styles.pane, provide(Variant, variant), style)}
		></Box>
	)
}
