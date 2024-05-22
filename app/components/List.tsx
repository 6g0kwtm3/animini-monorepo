import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react"
import { createContext, forwardRef, useContext } from "react"

import { createTV, type VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { createElement } from "~/lib/createElement"
import { createList } from "~/lib/list"

type ListVariantProps = VariantProps<typeof createList>

const ListContext = createContext(createList())

export const ListItem = forwardRef<
	HTMLLIElement,
	ComponentPropsWithoutRef<"li"> &
		ListVariantProps & {
			render?: ReactElement<any>
		}
>(function ListItem({ lines, ...props }, ref) {
	const { item } = useContext(ListContext)
	return createElement("li", {
		...props,
		ref,
		className: item({ className: props.className, lines })
	})
})
export function ListItemContentTitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement<any>
	}
): ReactNode {
	const { itemTitle } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemTitle({ className: props.className })
	})
}
export function ListItemContent(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement<any>
	}
): ReactNode {
	const { itemContent } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemContent({ className: props.className })
	})
}
export function ListItemContentSubtitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement<any>
	}
): ReactNode {
	const { itemSubtitle } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemSubtitle({ className: props.className })
	})
}
export function ListItemImg(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement<any>
	}
): ReactNode {
	const { itemImg } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemImg({ className: props.className })
	})
}
export function ListItemAvatar(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement<any>
	}
): ReactNode {
	const { itemAvatar } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemAvatar({ className: props.className })
	})
}
export function ListItemIcon(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement<any>
	}
): ReactNode {
	const { itemIcon } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemIcon({ className: props.className })
	})
}

const tv = createTV({ twMerge: false })
const subheader = tv({
	base: "truncate px-4 text-body-md text-on-surface-variant",
	variants: {
		lines: {
			one: "py-2",
			two: "py-2",
			three: "py-3"
		}
	},
	defaultVariants: {
		lines: "two"
	}
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

export const List = forwardRef<
	HTMLUListElement,
	ComponentPropsWithoutRef<"ul"> &
		ListVariantProps & {
			render?: ReactElement<any>
		}
>(function List({ lines, ...props }, ref): ReactNode {
	const styles = createList({ lines })

	return (
		<ListContext.Provider value={styles}>
			{createElement("ul", {
				...props,
				ref,
				className: styles.root({ className: props.className })
			})}
		</ListContext.Provider>
	)
})
