import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { type VariantProps } from "tailwind-variants"

import { useCreateElement, type Options } from "~/lib/createElement"

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
export function LayoutPane({
	variant,
	...props
}: ComponentPropsWithoutRef<"div">
	& VariantProps<typeof pane>
	& Options): ReactNode {
	return useCreateElement("section", {
		...props,
		className: pane({ className: props.className, variant }),
	})
}
