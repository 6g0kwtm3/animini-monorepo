import type { ComponentPropsWithoutRef } from "react"
import { createContext, useContext } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const appBar = tv({
	slots: {
		root: "flex items-center gap-2 p-2 [grid-area:top-app-bar]",
		title: "text-title-lg text-on-surface first:ms-2"
	},
	variants: {
		variant: {
			centered: {
				root: ""
			},
			small: {
				root: "h-16"
			},
			medium: {
				root: ""
			},
			large: {
				root: ""
			}
		}
	},
	defaultVariants: {
		variant: "small"
	}
})

const AppBarContext = createContext(appBar())

export function AppBar({
	variant,
	...props
}: ComponentPropsWithoutRef<"aside"> & VariantProps<typeof appBar>) {
	const styles = appBar({ variant })
	return (
		<AppBarContext.Provider value={styles}>
			{createElement("aside", {
				...props,
				className: styles.root({ className: props.className })
			})}
		</AppBarContext.Provider>
	)
}
export function AppBarTitle(props: ComponentPropsWithoutRef<"h1">) {
	const styles = useContext(AppBarContext)
	return createElement("h1", {
		...props,
		className: styles.title({ className: props.className })
	})
}
