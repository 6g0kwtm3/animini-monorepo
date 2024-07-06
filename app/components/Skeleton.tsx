import type { ComponentPropsWithRef, ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

const skeleton = tv({
	base: "animate-pulse select-none overflow-hidden rounded-xs bg-surface-container-highest text-transparent",
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
}: ComponentPropsWithRef<"div"> & VariantProps<typeof skeleton>): ReactNode {
	return (
		<div
			{...props}
			className={skeleton({ className: props.className, full })}
		/>
	)
}
