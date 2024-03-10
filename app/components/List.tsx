import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createContext, forwardRef, useContext } from "react"

import type { VariantProps } from "tailwind-variants"
import { createElement } from "~/lib/createElement"
import { createList } from "~/lib/list"

type ListVariantProps = VariantProps<typeof createList>

const ListContext = createContext(createList())

export const ListItem = forwardRef<
	HTMLLIElement,
	ComponentPropsWithoutRef<"li"> & {
		render?: ReactElement
	}
>(function ListItem(props, ref) {
	const { item } = useContext(ListContext)
	return createElement("li", {
		...props,
		ref,
		className: item({ className: props.className })
	})
})

export function ListItemContentTitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): JSX.Element {
	const { itemTitle } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemTitle({ className: props.className })
	})
}

export function ListItemContent(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): JSX.Element {
	const { itemContent } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemContent({ className: props.className })
	})
}

export function ListItemContentSubtitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): JSX.Element {
	const { itemSubtitle } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemSubtitle({ className: props.className })
	})
}

export function ListItemImg(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): JSX.Element {
	const { itemImg } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemImg({ className: props.className })
	})
}

export function ListItemAvatar(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): JSX.Element {
	const { itemAvatar } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemAvatar({ className: props.className })
	})
}

export function ListItemIcon(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
): JSX.Element {
	const { itemIcon } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemIcon({ className: props.className })
	})
}

export function ListItemTrailingSupportingText(
	props: ComponentPropsWithoutRef<"span">
): JSX.Element {
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
			render?: ReactElement
		}
>(function List({ lines, ...props }, ref): JSX.Element {
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
