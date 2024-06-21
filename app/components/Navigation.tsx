import type { NavLink, NavLinkProps } from "@remix-run/react"

import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react"
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
			root: "fixed bottom-0 start-0 z-50",
			label: `group relative flex text-center`,
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
				bar: {
					root: "end-0 grid h-20 grid-flow-col gap-2 bg-surface-container [grid-auto-columns:minmax(0,1fr)]",
					label: `flex-1 flex-col items-center gap-1 pb-4 pt-3 text-label-md text-on-surface-variant aria-[current='page']:text-on-surface`,
					activeIndicator:
						"h-8 w-16 scale-x-0 rounded-lg transition-transform group-aria-[current='page']:scale-x-100",
					icon: "relative flex h-8 w-16 items-center justify-center rounded-lg group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-aria-[current='page']:first:*:hidden group-aria-[current='page']:last:*:block group-focused:state-focus group-pressed:state-pressed",
					largeBadge: "absolute left-1/2",
				},
				rail: {
					root: "top-0 flex h-full w-20 shrink-0 flex-col gap-3 bg-surface",
					label:
						"grow-0 flex-col items-center gap-1 px-2 py-0 text-label-md text-on-surface-variant aria-[current='page']:text-on-surface",
					activeIndicator:
						"h-8 w-14 scale-x-0 rounded-lg transition-transform group-aria-[current='page']:scale-x-100",
					icon: "relative flex h-8 w-14 items-center justify-center rounded-lg group-hover:text-on-surface group-hover:state-hover group-aria-[current='page']:text-on-secondary-container group-aria-[current='page']:first:*:hidden group-aria-[current='page']:last:*:block group-focused:text-on-surface group-focused:state-focus group-pressed:text-on-surface group-pressed:state-pressed",
					largeBadge: "absolute left-1/2",
				},
				drawer: {
					root: "top-0 flex h-full w-[22.5rem] shrink-0 flex-col justify-start gap-0 bg-surface p-3",
					label: `min-h-14 grow-0 flex-row items-center gap-3 rounded-xl px-4 py-0 text-label-lg text-on-surface-variant hover:state-hover aria-[current='page']:text-on-secondary-container focused:state-focus pressed:state-pressed`,
					activeIndicator:
						"inset-0 -z-10 hidden h-full scale-x-100 rounded-xl group-aria-[current='page']:block group-aria-[current='page']:[view-transition-name:var(--id)] force:w-full",
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

const Context = createContext(createNavigation())

export const NavigationItem = forwardRef<
	HTMLAnchorElement,
	Partial<ComponentPropsWithRef<typeof NavLink>> & {
		children?: ReactNode
		className?: string
		render?: ReactElement<any>
	}
>(function NavigationItem({ children, ...props }, ref): ReactNode {
	const { label } = useContext(Context)

	return createElement(HashNavLink, {
		ref,
		...props,
		unstable_viewTransition: true,
		className: label({ className: props.className }),
		children: ({
			isActive,
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
	props: ComponentPropsWithRef<"div">
): ReactNode {
	const { icon } = useContext(Context)

	return <div {...props} className={icon()} />
}
export function Navigation({
	variant,
	...props
}: ComponentPropsWithRef<"nav"> &
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
	props: ComponentPropsWithRef<"div">
): ReactNode {
	const { largeBadge } = useContext(Context)

	return <div {...props} className={largeBadge()} />
}
