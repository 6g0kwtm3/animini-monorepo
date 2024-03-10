import {
	createContext,
	useContext,
	type ComponentPropsWithoutRef,
	type ReactElement
} from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const skeleton = tv({
	base: "animate-pulse select-none overflow-hidden rounded-xs bg-surface-container-highest text-transparent",
	variants: {
		full: {
			true: "block h-full w-full",
			false: "my-[calc((1lh-1ic)/2)] block h-[1ic] w-full max-w-[65ch]"
		}
	},
	defaultVariants: {
		full: false
	}
})

const LoadingContext = createContext(false)

export function Loading(
	props: Partial<ComponentPropsWithoutRef<typeof LoadingContext.Provider>>
): JSX.Element {
	return <LoadingContext.Provider value={true} {...props} />
}

export function Skeleton({
	full,
	...props
}: ComponentPropsWithoutRef<"div"> &
	VariantProps<typeof skeleton> & {
		render?: ReactElement
	}): JSX.Element {
	const loading = useContext(LoadingContext)

	if (loading)
		return createElement("div", {
			...props,
			className: skeleton({ className: props.className, full })
		})

	return <>{props.children}</>
}
