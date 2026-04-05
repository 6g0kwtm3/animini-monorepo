import { createContext, use, type ComponentProps, type ReactNode } from "react"

import * as design from "@anitrove/design"
import {
	cva,
	defineCva,
	mergeStyles,
	type CvaProps,
	type PreCompiledStyles,
} from "@anitrove/unstyled"
import { Box } from "@anitrove/unstyled/box"
const layoutDefinition = defineCva({
	base: { isolation: "isolate" },
	variants: { navigation: { none: {}, bar: {}, rail: {}, drawer: {} } },
	defaultVariants: { navigation: "none" },
})

const layout = cva(layoutDefinition)

const body = cva({
	base: {
		...design.utilities.marginEnd({
			base: "1rem",
			[design.media.sm]: "1.5rem",
		}),
		display: "flex",
		gap: "1.5rem",
	},
	variants: {
		navigation: {
			none: {
				...design.utilities.marginStart({
					base: "1rem",
					[design.media.sm]: "1.5rem",
				}),
			},
			bar: {
				...design.utilities.marginStart({
					base: "1rem",
					[design.media.sm]: "1.5rem",
				}),
				...design.utilities.paddingBottom("5rem"),
			},
			rail: { ...design.utilities.marginStart("5rem") },
			drawer: { ...design.utilities.marginStart("22.5rem") },
		},
	},
	defaultVariants: { navigation: "none" },
})

const LayoutContext = createContext({
	layout: mergeStyles(layout.style, layout.variants({})),
	body: mergeStyles(body.style, body.variants({})),
})
LayoutContext.displayName = "LayoutContext"

const LayoutNavigationContext =
	createContext<CvaProps<typeof layoutDefinition>["navigation"]>(undefined)
LayoutNavigationContext.displayName = "LayoutNavigationContext"

interface LayoutProps
	extends
		CvaProps<typeof layoutDefinition>,
		Omit<ComponentProps<"div">, "className" | "style"> {
	style?: PreCompiledStyles
}

export function Layout({ style, navigation, ...props }: LayoutProps) {
	const styles = {
		layout: mergeStyles(layout.style, layout.variants({ navigation })),
		body: mergeStyles(body.style, body.variants({ navigation })),
	}

	return (
		<LayoutNavigationContext value={navigation}>
			<LayoutContext value={styles}>
				<Box {...props} style={mergeStyles(styles.layout, style)}></Box>
			</LayoutContext>
		</LayoutNavigationContext>
	)
}

interface LayoutBodyProps extends Omit<
	ComponentProps<"main">,
	"className" | "style"
> {
	style?: PreCompiledStyles
}

export function LayoutBody({ style, ...props }: LayoutBodyProps): ReactNode {
	const styles = use(LayoutContext)

	return (
		<Box render={<main {...props} />} style={mergeStyles(styles.body, style)} />
	)
}

const paneDefinition = defineCva({
	base: {
		display: "block",
		position: "relative",
		overflowY: "auto",
		overflowX: "hidden",
		borderRadius: design.tokens.borderRadius.md,
	},
	variants: {
		variant: {
			fixed: { width: "22.5rem", flexShrink: 0 },
			flexible: { width: "100%", flexGrow: 1 },
		},
		navigation: { none: {}, bar: {}, rail: {}, drawer: {} },
	},
	defaultVariants: { variant: "flexible", navigation: "none" },
})

const pane = cva(paneDefinition)

import * as Ariakit from "@ariakit/react"
interface LayoutPaneProps
	extends
		CvaProps<typeof paneDefinition>,
		Omit<Ariakit.RoleProps<"section">, "className" | "style"> {
	style?: PreCompiledStyles
}

export function LayoutPane({
	style,
	variant,
	...props
}: LayoutPaneProps): ReactNode {
	const navigation = use(LayoutNavigationContext)

	return (
		<Box
			render={<Ariakit.Role.section {...props}></Ariakit.Role.section>}
			style={mergeStyles(
				pane.style,
				pane.variants({ navigation, variant }),
				style
			)}
		></Box>
	)
}
