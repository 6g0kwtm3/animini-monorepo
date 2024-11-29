import type { ComponentProps, ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"

import { tv } from "~/lib/tailwind-variants"

const skeleton = tv({
	base: "bg-surface-container-highest animate-pulse overflow-hidden rounded-xs text-transparent select-none",
	variants: {
		full: {
			true: "block h-full w-full",
			false: "my-[calc((1lh-1ic)/2)] block h-[1ic] w-full max-w-[65ch]",
		},
	},
	defaultVariants: {
		full: false,
	},
})

export function Skeleton({
	full,
	...props
}: ComponentProps<"div"> & VariantProps<typeof skeleton>): ReactNode {
	return (
		<div
			{...props}
			className={skeleton({ className: props.className, full })}
		/>
	)
}
