import { motion } from "motion/react"
import type { ReactNode } from "react"
import { createContext, use, useId } from "react"
import type { VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { tv } from "~/lib/tailwind-variants"

const tabs = tv(
	{
		slots: {
			root: "border-b border-surface-container-highest",
			item: "grid h-12 items-center justify-center whitespace-nowrap px-4 text-title-sm text-on-surface-variant hover:text-on-surface hover:state-hover aria-selected:text-primary focused:text-on-surface focused:state-focus pressed:state-pressed",
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

export function Tabs({
	selectedId,
	...props
}: Ariakit.TabProviderProps): ReactNode {
	const prefix = useId()

	return (
		<Prefix value={prefix}>
			<Ariakit.TabProvider
				selectOnMove={false}
				{...props}
				selectedId={`${prefix}/${selectedId}`}
			/>
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
		<Styles value={styles}>
			<Ariakit.TabList
				{...props}
				className={styles.root({
					className: props.className,
				})}
				render={<nav />}
			/>
		</Styles>
	)
}

const Prefix = createContext<string | undefined>(undefined)

export function TabsListItem({
	children,
	id,
	...props
}: Ariakit.TabProps): ReactNode {
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
			<div className="col-start-1 row-start-1">{children}</div>
			{selectedId === `${prefix}/${id}` && (
				<motion.div
					className="col-start-1 row-start-1 h-[0.1875rem] self-end rounded-t-[0.1875rem] bg-primary"
					layoutId={prefix}
				/>
			)}
		</Ariakit.Tab>
	)
}
