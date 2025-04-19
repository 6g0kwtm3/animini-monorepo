import { useStoreState } from "@ariakit/react"
import { motion } from "framer-motion"

import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import { createContext, useContext, useId } from "react"
import type { VariantProps } from "tailwind-variants"

const TabsContext = createContext<string | undefined>(undefined)

import { tv } from "~/lib/tailwind-variants"

const tabs = tv({
	slots: { root: "border-surface-container-highest border-b" },
	variants: {
		variant: { primary: {}, secondary: {} },
		grow: {
			true: { root: "grid grid-flow-col [grid-auto-columns:minmax(0,1fr)]" },
			false: { root: "flex overflow-x-auto" },
		},
	},
	defaultVariants: { primary: true, grow: false },
})

export function Tabs(props: Ariakit.TabProviderProps): ReactNode {
	return <Ariakit.TabProvider selectOnMove={false} {...props} />
}

export function TabsPanel(props: Ariakit.TabPanelProps): ReactNode {
	return <Ariakit.TabPanel {...props} />
}

interface TabsListProps extends Ariakit.TabListProps, VariantProps<typeof tabs> {}

export function TabsList({
	grow,
	...props
}: TabsListProps): ReactNode {
	const styles = tabs({ grow })
	return (
		<TabsContext.Provider value={useId()}>
			<Ariakit.TabList
				{...props}
				className={styles.root({ className: props.className })}
				render={<nav />}
			/>
		</TabsContext.Provider>
	)
}

export function TabsListItem({
	children,
	...props
}: Ariakit.TabProps): ReactNode {
	const layoutId = useContext(TabsContext)

	const context = Ariakit.useTabContext()
	if (!context) {
		throw new Error("TabsListItem must be wrapped in TabsList")
	}

	const selectedId = useStoreState(context, "selectedId")

	return (
		<Ariakit.Tab
			{...props}
			className="text-title-sm text-on-surface-variant hover:text-on-surface hover:state-hover aria-selected:text-primary focused:text-on-surface focused:state-focus pressed:state-pressed flex justify-center px-4"
		>
			<div className={`relative flex h-12 items-center whitespace-nowrap`}>
				{children}

				{selectedId === props.id && (
					<motion.div
						layoutId={layoutId}
						className="bg-primary absolute bottom-0 left-0 right-0 h-[0.1875rem] rounded-t-[0.1875rem]"
					/>
				)}
			</div>
		</Ariakit.Tab>
	)
}
