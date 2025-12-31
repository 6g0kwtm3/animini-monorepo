import { createContext, use, type ComponentProps, type ReactNode } from "react"

import * as design from "@anitrove/design"
import {
	cva,
	defineCva,
	mergeStyles,
	precompileStyles,
	useStyles,
	type CvaProps,
	type RawStyles,
} from "@anitrove/unstyled"

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
	layout: mergeStyles(layout, layout.variants({})),
	body: mergeStyles(body, body.variants({})),
})
LayoutContext.displayName = "LayoutContext"

const LayoutNavigationContext =
	createContext<CvaProps<typeof layoutDefinition>["navigation"]>(undefined)
LayoutNavigationContext.displayName = "LayoutNavigationContext"

interface LayoutProps
	extends
		CvaProps<typeof layoutDefinition>,
		Omit<ComponentProps<"div">, "className" | "style"> {
	style?: RawStyles
}

export function Layout({ style, navigation, ...props }: LayoutProps) {
	const styles = {
		layout: mergeStyles(layout.style, layout.variants({ navigation })),
		body: mergeStyles(body.style, body.variants({ navigation })),
	}

	const [className, jsx] = useStyles(
		mergeStyles(styles.layout, style && precompileStyles(style))
	)

	return (
		<LayoutNavigationContext value={navigation}>
			<LayoutContext value={styles}>
				<div {...props} className={className}></div>
				{jsx}
			</LayoutContext>
		</LayoutNavigationContext>
	)
}

interface LayoutBodyProps extends Omit<
	ComponentProps<"main">,
	"className" | "style"
> {
	style?: RawStyles
}

export function LayoutBody({ style, ...props }: LayoutBodyProps): ReactNode {
	const styles = use(LayoutContext)
	const [className, jsx] = useStyles(
		mergeStyles(styles.body, style && precompileStyles(style))
	)

	return (
		<>
			<main {...props} className={className} />
			{jsx}
		</>
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
	style?: RawStyles
}

export function LayoutPane({
	style,
	variant,
	...props
}: LayoutPaneProps): ReactNode {
	const navigation = use(LayoutNavigationContext)

	const [className, jsx] = useStyles(
		mergeStyles(
			pane.style,
			pane.variants({ navigation, variant }),
			style && precompileStyles(style)
		)
	)

	return (
		<>
			<Ariakit.Role.section
				{...props}
				className={className}
			></Ariakit.Role.section>
			{jsx}
		</>
	)
}
