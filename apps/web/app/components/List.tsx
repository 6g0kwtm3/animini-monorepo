import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { useContext } from "react"

import * as Ariakit from "@ariakit/react"
import { type VariantProps } from "tailwind-variants"
import { useCreateElement, type Options } from "~/lib/createElement"
import { createList, ListContext } from "~/lib/list"

type ListVariantProps = VariantProps<typeof createList>

export function ListItem({
	lines,
	...props
}: ComponentPropsWithoutRef<"li"> & ListVariantProps & Options) {
	const { item } = useContext(ListContext)
	return useCreateElement("li", {
		...props,
		className: item({ className: props.className, lines }),
	})
}
export function ListItemContentTitle(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	const { itemTitle } = useContext(ListContext)

	return useCreateElement("div", {
		...props,
		className: itemTitle({ className: props.className }),
	})
}
export function ListItemContent(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	const { itemContent } = useContext(ListContext)

	return useCreateElement("div", {
		...props,
		className: itemContent({ className: props.className }),
	})
}
export function ListItemContentSubtitle(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	const { itemSubtitle } = useContext(ListContext)

	return useCreateElement("div", {
		...props,
		className: itemSubtitle({ className: props.className }),
	})
}
export function ListItemImg(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	const { itemImg } = useContext(ListContext)

	return useCreateElement("div", {
		...props,
		className: itemImg({ className: props.className }),
	})
}
export function ListItemAvatar(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	const { itemAvatar } = useContext(ListContext)

	return useCreateElement("div", {
		...props,
		className: itemAvatar({ className: props.className }),
	})
}
export function ListItemIcon(
	props: ComponentPropsWithoutRef<"div"> & Options
): ReactNode {
	const { itemIcon } = useContext(ListContext)

	return useCreateElement("div", {
		...props,
		className: itemIcon({ className: props.className }),
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
	const { trailingSupportingText } = useContext(ListContext)

	return (
		<span
			{...props}
			className={trailingSupportingText({ className: props.className })}
		/>
	)
}

export function List({
	lines,
	...props
}: ComponentPropsWithoutRef<"ul"> & ListVariantProps & Options): ReactNode {
	const styles = createList({ lines })

	return (
		<ListContext.Provider value={styles}>
			{useCreateElement("ul", {
				...props,
				className: styles.root({ className: props.className }),
			})}
		</ListContext.Provider>
	)
}
