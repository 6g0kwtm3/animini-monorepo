import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const skeleton = tv({
	base: "inline h-[1lh] animate-pulse select-none overflow-hidden rounded-xs bg-surface-container-highest text-transparent"
})

export function Skeleton(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
) {
	return createElement("div", {
		...props,
		className: skeleton({ className: props.className })
	})
}
