import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type VariantProps } from "tailwind-variants"

import { tv } from "~/lib/tailwind-variants"

export function Layout({ ...props }: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			className={tv({ base: "layout layout-navigation-none" })({
				className: props.className,
			})}
		>
			{props.children}
		</div>
	)
}
export function LayoutBody(props: ComponentPropsWithoutRef<"main">): ReactNode {
	return (
		<main
			{...props}
			className={tv({ base: "layout-body" })({ className: props.className })}
		/>
	)
}

const pane = tv({
	base: "grid content-start",
	variants: { variant: { fixed: "w-[22.5rem] shrink-0", flexible: "flex-1" } },
	defaultVariants: { variant: "flexible" },
})

import * as Ariakit from "@ariakit/react"
interface LayoutPaneProps extends Ariakit.RoleProps<"section">, VariantProps<typeof pane> {}

export function LayoutPane({ variant, ...props }: LayoutPaneProps): ReactNode {
	return (
		<Ariakit.Role.section
			{...props}
			className={pane({ className: props.className, variant })}
		></Ariakit.Role.section>
	)
}
