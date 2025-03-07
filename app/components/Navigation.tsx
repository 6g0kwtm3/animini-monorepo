import type { NavLink, NavLinkProps } from "react-router"

import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react"
import { createContext, forwardRef, useContext, useId } from "react"

import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { TouchTarget } from "~/components/Tooltip"
import { createElement } from "~/lib/createElement"
import { HashNavLink } from "~/lib/search/HashNavLink"

const tv = createTV({ twMerge: false })

const createNavigation = tv(
	{
		slots: {
			root: "fixed start-0 bottom-0 z-50",
			label: `group relative flex text-center`,
			activeIndicator: "bg-secondary-container absolute",
			icon: "i *:last:hidden",
			largeBadge:
				"bg-error text-label-sm text-on-error flex h-4 min-w-4 items-center justify-center rounded-sm px-1",
		},
		variants: {
			align: {
				center: {},
				start: {},
				end: {},
			},
			variant: {
				bar: {
					root: "bg-surface-container end-0 grid h-20 [grid-auto-columns:minmax(0,1fr)] grid-flow-col gap-2",
					label: `text-label-md text-on-surface-variant aria-[current='page']:text-on-surface flex-1 flex-col items-center gap-1 pt-3 pb-4`,
					activeIndicator:
						"h-8 w-16 scale-x-0 rounded-lg transition-transform group-aria-[current='page']:scale-x-100",
					icon: "group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-focused:state-focus group-pressed:state-pressed relative flex h-8 w-16 items-center justify-center rounded-lg *:first:group-aria-[current='page']:hidden *:last:group-aria-[current='page']:block",
					largeBadge: "absolute left-1/2",
				},
				rail: {
					root: "bg-surface top-0 flex h-full w-20 shrink-0 flex-col gap-3",
					label:
						"text-label-md text-on-surface-variant aria-[current='page']:text-on-surface grow-0 flex-col items-center gap-1 px-2 py-0",
					activeIndicator:
						"h-8 w-14 scale-x-0 rounded-lg transition-transform group-aria-[current='page']:scale-x-100",
					icon: "group-hover:text-on-surface group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-focused:text-on-surface group-focused:state-focus group-pressed:text-on-surface group-pressed:state-pressed relative flex h-8 w-14 items-center justify-center rounded-lg *:first:group-aria-[current='page']:hidden *:last:group-aria-[current='page']:block",
					largeBadge: "absolute left-1/2",
				},
				drawer: {
					root: "bg-surface top-0 flex h-full w-[22.5rem] shrink-0 flex-col justify-start gap-0 p-3",
					label: `text-label-lg text-on-surface-variant hover:state-hover aria-[current='page']:text-on-secondary-container focused:state-focus pressed:state-pressed min-h-14 grow-0 flex-row items-center gap-3 rounded-xl px-4 py-0`,
					activeIndicator:
						"force:w-full inset-0 -z-10 hidden h-full scale-x-100 rounded-xl group-aria-[current='page']:block group-aria-[current='page']:[view-transition-name:var(--id)]",
					icon: "group-hover:text-on-surface group-hover:state-none group-focused:text-on-surface group-focused:state-none group-pressed:text-on-surface group-pressed:state-none h-6 w-6 *:first:group-aria-[current='page']:block *:last:group-aria-[current='page']:hidden",
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

const Context = createContext(createNavigation())

export const NavigationItem = forwardRef<
	HTMLAnchorElement,
	Partial<ComponentPropsWithoutRef<typeof NavLink>> & {
		children?: ReactNode
		className?: string
		render?: ReactElement<any>
	}
>(function NavigationItem({ children, ...props }, ref) {
	const { label } = useContext(Context)

	return createElement(HashNavLink, {
		ref,
		...props,
		viewTransition: true,
		className: label({ className: props.className }),
		children: ({
			isActive: _isActive,
		}: Parameters<
			Extract<NavLinkProps["children"], (...args: any) => any>
		>[0]) => (
			<>
				<NavigationActiveIndicator />
				{children}
				<TouchTarget />
			</>
		),
	})
})

const NavigationContext = createContext<{ "--id": string } | undefined>(
	undefined
)

function NavigationActiveIndicator() {
	const { activeIndicator } = useContext(Context)
	const style = useContext(NavigationContext)

	return <div className={activeIndicator()} style={style} />
}

export function NavigationItemIcon(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	const { icon } = useContext(Context)

	return <div {...props} className={icon()} />
}
export function Navigation({
	variant,
	...props
}: ComponentPropsWithoutRef<"nav"> &
	VariantProps<typeof createNavigation>): ReactNode {
	const styles = createNavigation({ variant })

	return (
		<NavigationContext.Provider
			value={{
				"--id": useId(),
			}}
		>
			<Context.Provider value={styles}>
				<nav
					{...props}
					className={styles.root({ className: props.className })}
				/>
			</Context.Provider>
		</NavigationContext.Provider>
	)
}

export function NavigationItemLargeBadge(
	props: ComponentPropsWithoutRef<"div">
): ReactNode {
	const { largeBadge } = useContext(Context)

	return <div {...props} className={largeBadge()} />
}
