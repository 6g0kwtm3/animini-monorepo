import type { ComponentPropsWithoutRef, ReactNode } from "react"

import * as Ariakit from "@ariakit/react"
import { type VariantProps } from "tailwind-variants"
import { useCreateElement, type Options } from "~/lib/createElement"

export function ListItem({
	...props
}: ComponentPropsWithoutRef<"li"> & Options) {
	return useCreateElement("li", {
		...props,
		className: tv({ base: "group list-item" })({
			className: props.className,
		}),
	})
}
export function ListItemContentTitle(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	return useCreateElement("div", {
		...props,
		className: tv({
			base: "list-item-title",
		})({ className: props.className }),
	})
}
export function ListItemContent(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	return useCreateElement("div", {
		...props,
		className: tv({
			base: "list-item-content",
		})({ className: props.className }),
	})
}
export function ListItemContentSubtitle(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	return useCreateElement("div", {
		...props,
		className: tv({
			base: "list-item-subtitle",
		})({ className: props.className }),
	})
}
export function ListItemImg(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	return useCreateElement("div", {
		...props,
		className: tv({
			base: "list-item-img",
		})({ className: props.className }),
	})
}
export function ListItemAvatar(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	return useCreateElement("div", {
		...props,
		className: tv({
			base: "list-item-avatar",
		})({ className: props.className }),
	})
}
export function ListItemIcon(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	return useCreateElement("div", {
		...props,
		className: tv({ base: "list-item-icon" })({ className: props.className }),
	})
}

import { tv } from "~/lib/tailwind-variants"
const subheader = tv({
	base: "text-body-md text-on-surface-variant truncate px-4",
	variants: {
		lines: {
			one: "py-2",
			two: "py-2",
			three: "py-3",
		},
	},
	defaultVariants: {
		lines: "two",
	},
})

export function Subheader({
	lines,
	...props
}: Ariakit.HeadingProps & VariantProps<typeof subheader>): ReactNode {
	return (
		<Ariakit.Heading
			{...props}
			className={subheader({ className: props.className, lines })}
		/>
	)
}

export function ListItemTrailingSupportingText(
	props: ComponentPropsWithoutRef<"span">
): ReactNode {
	return (
		<span
			{...props}
			className={tv({ base: "list-item-trailing-supporting-text" })({
				className: props.className,
			})}
		/>
	)
}

export function List({
	...props
}: ComponentPropsWithoutRef<"ul"> & Options): ReactNode {
	return useCreateElement("ul", {
		...props,
		className: tv({ base: "list list-two" })({
			className: props.className,
		}),
	})
}
