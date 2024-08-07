import type { ComponentProps, ReactNode } from "react"
import { createContext, use, useId } from "react"

import type { VariantProps } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"
import { tv } from "~/lib/tailwind-variants"

const createNavigation = tv(
	{
		slots: {
			root: "fixed bottom-0 start-0 z-50",
			label: `group relative flex text-center text-on-surface-variant`,
			activeIndicator: "absolute bg-secondary-container",
			icon: "i last:*:hidden",
			largeBadge:
				"flex h-4 min-w-4 items-center justify-center rounded-sm bg-error px-1 text-label-sm text-on-error",
		},
		variants: {
			align: {
				center: {},
				start: {},
				end: {},
			},
			variant: {
				none: { root: "hidden" },
				bar: {
					root: "end-0 my-0 grid h-20 grid-flow-col gap-2 bg-surface-container [grid-auto-columns:minmax(0,1fr)]",
					label: `flex-1 flex-col items-center gap-1 pb-4 pt-3 text-label-md aria-[current='page']:text-on-surface`,
					activeIndicator:
						"h-8 w-16 scale-x-0 rounded-lg transition-transform duration-sm ease-emphasized-accelerate group-aria-[current='page']:scale-x-100",
					icon: "relative flex h-8 w-16 items-center justify-center rounded-lg group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-aria-[current='page']:first:*:hidden group-aria-[current='page']:last:*:block group-focused:state-focus group-pressed:state-pressed",
					largeBadge: "absolute left-1/2",
				},
				rail: {
					root: "top-0 my-3 flex h-full w-20 shrink-0 flex-col gap-3 bg-surface",
					label:
						"grow-0 flex-col items-center gap-1 px-2 py-0 text-label-md aria-[current='page']:text-on-surface",
					activeIndicator:
						"h-8 w-14 scale-x-0 rounded-lg transition-transform duration-sm ease-emphasized-accelerate group-aria-[current='page']:scale-x-100",
					icon: "relative flex h-8 w-14 items-center justify-center rounded-lg group-hover:text-on-surface group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-aria-[current='page']:first:*:hidden group-aria-[current='page']:last:*:block group-focused:text-on-surface group-focused:state-focus group-pressed:text-on-surface group-pressed:state-pressed",
					largeBadge: "absolute left-1/2",
				},
				drawer: {
					root: "top-0 my-0 flex h-full w-[22.5rem] shrink-0 flex-col justify-start gap-0 bg-surface p-3",
					label: `min-h-14 grow-0 flex-row items-center gap-3 rounded-xl px-4 py-0 text-label-lg hover:state-hover aria-[current='page']:text-on-secondary-container focused:state-focus pressed:state-pressed`,
					activeIndicator:
						"inset-0 -z-10 hidden h-full w-full scale-x-100 rounded-xl group-aria-[current='page']:block group-aria-[current='page']:[view-transition-name:var(--id)]",
					icon: "h-6 w-6 group-hover:text-on-surface group-hover:state-none group-aria-[current='page']:first:*:block group-aria-[current='page']:last:*:hidden group-focused:text-on-surface group-focused:state-none group-pressed:text-on-surface group-pressed:state-none",
					largeBadge: "static ms-auto",
				},
			},
		},
		defaultVariants: {
			variant: "bar",
			align: "end",
		},
		compoundVariants: [
			{
				align: "start",
				variant: "rail",
				className: {
					root: "justify-start",
				},
			},
			{
				align: "center",
				variant: "rail",
				className: {
					root: "justify-center",
				},
			},
			{
				align: "end",
				variant: "rail",
				className: {
					root: "justify-end",
				},
			},
		],
	},
	{
		responsiveVariants: ["sm", "lg"],
	}
)

export const NavigationStyles = createContext(createNavigation())

export function NavigationItem({
	children,
	active,
	...props
}: ComponentProps<"a"> & {
	active?: boolean
}): ReactNode {
	const { label } = use(NavigationStyles)

	return (
		<a
			{...props}
			data-current={active}
			className={label({ className: props.className })}
		>
			<NavigationItemActiveIndicator />
			{children}
			<TouchTarget />
		</a>
	)
}

const NavigationId = createContext<{ "--id": string } | undefined>(undefined)

export function NavigationItemActiveIndicator(): ReactNode {
	const { activeIndicator } = use(NavigationStyles)
	const style = use(NavigationId)

	return <div className={activeIndicator()} style={style} />
}

export function NavigationItemIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = use(NavigationStyles)

	return <div {...props} className={icon()} />
}
interface NavigationProps
	extends ComponentProps<"nav">,
		VariantProps<typeof createNavigation> {}

export function Navigation({
	variant,
	align,
	...props
}: NavigationProps): ReactNode {
	const styles = createNavigation({ align, variant })

	return (
		<NavigationId.Provider
			value={{
				"--id": useId().replaceAll(":", "-"),
			}}
		>
			<NavigationStyles.Provider value={styles}>
				<nav
					{...props}
					className={styles.root({ className: props.className })}
				/>
			</NavigationStyles.Provider>
		</NavigationId.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentProps<"div">
): ReactNode {
	const { largeBadge } = use(NavigationStyles)

	return <div {...props} className={largeBadge()} />
}
