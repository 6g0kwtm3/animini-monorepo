import type { ReactNode } from "react"
import { createContext, use, useId } from "react"
import type { VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { tv } from "~/lib/tailwind-variants"

const TabsContext = createContext<string | undefined>(undefined)

const tabs = tv(
	{
		slots: {
			root: "border-b border-surface-container-highest",
			item: "flex justify-center px-4 text-title-sm text-on-surface-variant hover:text-on-surface hover:state-hover aria-selected:text-primary focused:text-on-surface focused:state-focus pressed:state-pressed",
		},
		variants: {
			variant: {
				primary: {},
				secondary: {},
			},
			grow: {
				true: { root: "grid grid-flow-col [grid-auto-columns:minmax(0,1fr)]" },
				false: { root: "flex overflow-x-auto" },
			},
		},
		defaultVariants: { primary: true, grow: false },
	},
	{
		responsiveVariants: ["md"],
	}
)

export function Tabs(props: Ariakit.TabProviderProps): ReactNode {
	return (
		<Prefix value={useId()}>
			<Ariakit.TabProvider selectOnMove={false} {...props} />
		</Prefix>
	)
}

export function TabsPanel({
	tabId,
	...props
}: Ariakit.TabPanelProps): ReactNode {
	const prefix = use(Prefix)
	return <Ariakit.TabPanel {...props} tabId={`${prefix}/${tabId}`} />
}
const Styles = createContext(tabs())

export function TabsList({
	grow,
	...props
}: Ariakit.TabListProps & VariantProps<typeof tabs>): ReactNode {
	const styles = tabs({ grow })
	return (
		<TabsContext.Provider value={useId()}>
			<Styles value={styles}>
				<Ariakit.TabList
					{...props}
					className={styles.root({
						className: props.className,
					})}
					render={<nav />}
				/>
			</Styles>
		</TabsContext.Provider>
	)
}

const Prefix = createContext<string | undefined>(undefined)

export function TabsListItem({
	children,
	id,
	...props
}: Ariakit.TabProps): ReactNode {
	const layoutId = use(TabsContext)

	const context = Ariakit.useTabContext()

	const selectedId = Ariakit.useStoreState(context, "selectedId")

	const prefix = use(Prefix)

	const { item } = use(Styles)

	return (
		<Ariakit.Tab
			{...props}
			id={`${prefix}/${id}`}
			className={item({ className: props.className })}
		>
			<div className={`relative flex h-12 items-center whitespace-nowrap`}>
				{children}

				{selectedId === props.id && (
					<div
						className="absolute bottom-0 left-0 right-0 h-[0.1875rem] rounded-t-[0.1875rem] bg-primary"
						style={{
							viewTransitionName: layoutId?.replaceAll(":", "-"),
						}}
					/>
				)}
			</div>
		</Ariakit.Tab>
	)
}
