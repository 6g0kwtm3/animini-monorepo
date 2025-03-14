import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react"
import { useContext } from "react"

import * as Ariakit from "@ariakit/react"
import { type VariantProps } from "tailwind-variants"
import { createElement } from "~/lib/createElement"
import { createList, ListContext } from "~/lib/list"

type ListVariantProps = VariantProps<typeof createList>

export function ListItem({
	lines,
	...props
}: ComponentPropsWithoutRef<"li"> &
	ListVariantProps & {
		render?: ReactElement
	}) {
	const { item } = useContext(ListContext)
	return createElement("li", {
		...props,
		className: item({ className: props.className, lines }),
	})
}
export function ListItemContentTitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): ReactNode {
	const { itemTitle } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemTitle({ className: props.className }),
	})
}
export function ListItemContent(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): ReactNode {
	const { itemContent } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemContent({ className: props.className }),
	})
}
export function ListItemContentSubtitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): ReactNode {
	const { itemSubtitle } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemSubtitle({ className: props.className }),
	})
}
export function ListItemImg(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): ReactNode {
	const { itemImg } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemImg({ className: props.className }),
	})
}
export function ListItemAvatar(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): ReactNode {
	const { itemAvatar } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemAvatar({ className: props.className }),
	})
}
export function ListItemIcon(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): ReactNode {
	const { itemIcon } = useContext(ListContext)

	return createElement("div", {
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
}: ComponentPropsWithoutRef<"ul"> &
	ListVariantProps & {
		render?: ReactElement
	}): ReactNode {
	const styles = createList({ lines })

	return (
		<ListContext.Provider value={styles}>
			{createElement("ul", {
				...props,
				className: styles.root({ className: props.className }),
			})}
		</ListContext.Provider>
	)
}
