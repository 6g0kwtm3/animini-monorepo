import { useScroll } from "framer-motion"
import {
	createContext,
	type ComponentPropsWithoutRef,
	type ReactElement,
	useContext,
	useState
} from "react"
import { createTV, type VariantProps } from "tailwind-variants"

import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const createLayout = tv(
	{
		slots: {
			root: "",
			body: "grid grid-flow-col [grid-auto-columns:auto] gap-6 pe-4 sm:pe-6"
		},
		variants: {
			navigation: {
				none: { body: "pb-0 ps-4 sm:ps-6" },
				bar: {
					root: "",
					body: "pb-20 ps-4 sm:ps-6"
				},
				rail: {
					root: "",
					body: "pb-0 ps-20 sm:ps-20"
				},
				drawer: {
					root: "",
					body: "pb-0 ps-[22.5rem] sm:ps-[22.5rem]"
				}
			}
		},
		defaultVariants: { navigation: "none" }
	},
	{ responsiveVariants: ["sm", "lg"] }
)

const LayoutContext = createContext(createLayout())

export const SetAppBarHeight = createContext((height: number) => {})

export function Layout({
	navigation,
	...props
}: ComponentPropsWithoutRef<"div"> & VariantProps<typeof createLayout>) {
	const styles = createLayout({ navigation })
	const [appBarHeight, setAppBarHeight] = useState(0)

	return (
		<SetAppBarHeight.Provider value={setAppBarHeight}>
			<LayoutContext.Provider value={styles}>
				<div
					className={styles.root({ className: props.className })}
					style={{
						"--app-bar-height": appBarHeight + "px"
					}}
				>
					{props.children}
				</div>
			</LayoutContext.Provider>
		</SetAppBarHeight.Provider>
	)
}

export function LayoutBody(props: ComponentPropsWithoutRef<"main">) {
	const { body } = useContext(LayoutContext)
	return (
		<main {...props} className={body({ className: props.className })}></main>
	)
}

const pane = tv({
	base: "grid content-start",
	variants: {
		variant: {
			fixed: "w-[22.5rem]",
			flexible: ""
		}
	},
	defaultVariants: { variant: "flexible" }
})

export function LayoutPane({
	variant,
	...props
}: ComponentPropsWithoutRef<"div"> &
	VariantProps<typeof pane> & {
		render?: ReactElement
	}) {
	return createElement("section", {
		...props,
		className: pane({ className: props.className, variant })
	})
}
