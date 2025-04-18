import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createContext, useContext } from "react"

import type { VariantProps } from "tailwind-variants"
import { useCreateElement, type Options } from "~/lib/createElement"

import { tv } from "~/lib/tailwind-variants"

const skeleton = tv({
	base: "bg-surface-container-highest rounded-xs animate-pulse select-none overflow-hidden text-transparent",
	variants: {
		full: {
			true: "block h-full w-full",
			false: "my-[calc((1lh-1ic)/2)] block h-[1ic] w-full max-w-[65ch]",
		},
	},
	defaultVariants: { full: false },
})

const LoadingContext = createContext(false)
export function Loading(
	props: Partial<ComponentPropsWithoutRef<typeof LoadingContext.Provider>>
): ReactNode {
	return <LoadingContext.Provider value={true} {...props} />
}
export function Skeleton({
	full,
	...props
}: ComponentPropsWithoutRef<"div">
	& VariantProps<typeof skeleton>
	& Options): ReactNode {
	const loading = useContext(LoadingContext)

	const el = useCreateElement("div", {
		...props,
		className: skeleton({ className: props.className, full }),
	})

	if (loading) {
		return el
	}

	return props.children
}
