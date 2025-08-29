import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext } from "react"

import type { VariantProps } from "tailwind-variants"

import * as Ariakit from "@ariakit/react"
import { tv } from "~/lib/tailwind-variants"

const skeleton = tv({
	base: "bg-surface-container-highest rounded-xs animate-pulse select-none overflow-hidden text-transparent",
	defaultVariants: { full: false },
	variants: {
		full: {
			false: "my-[calc((1lh-1ic)/2)] block h-[1ic] w-full max-w-[65ch]",
			true: "block h-full w-full",
		},
	},
})

const LoadingContext = createContext(false)
interface SkeletonProps
	extends Ariakit.RoleProps,
		VariantProps<typeof skeleton> {}
export function Loading(
	props: Partial<ComponentProps<typeof LoadingContext.Provider>>
): ReactNode {
	return <LoadingContext.Provider value={true} {...props} />
}

export function Skeleton({ full, ...props }: SkeletonProps): ReactNode {
	const loading = useContext(LoadingContext)

	const el = (
		<Ariakit.Role.div
			{...props}
			className={skeleton({ className: props.className, full })}
		></Ariakit.Role.div>
	)

	if (loading) {
		return el
	}

	return props.children
}
