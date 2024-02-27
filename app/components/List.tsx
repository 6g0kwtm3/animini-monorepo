import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createContext, useContext } from "react"

import type { VariantProps } from "tailwind-variants"
import { createElement } from "~/lib/createElement"
import { createList } from "~/lib/list"

type ListVariantProps = VariantProps<typeof createList>

const ListContext = createContext(createList())

export function ListItem(
	props: ComponentPropsWithoutRef<"li"> & {
		render?: ReactElement
	}
) {
	const { item } = useContext(ListContext)
	return createElement("li", {
		...props,
		className: item({ className: props.className })
	})
}

export function ListItemContentTitle(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
) {
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
) {
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
) {
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
) {
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
) {
	const { itemAvatar } = useContext(ListContext)

	return createElement("div", {
		...props,
		className: itemAvatar({ className: props.className })
	})
}

export function ListItemTrailingSupportingText(
	props: ComponentPropsWithoutRef<"span">
) {
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
	}) {
	const styles = createList({ lines })

	return (
		<ListContext.Provider value={styles}>
			{createElement("ul", {
				...props,
				className: styles.root({ className: props.className })
			})}
		</ListContext.Provider>
	)
}
