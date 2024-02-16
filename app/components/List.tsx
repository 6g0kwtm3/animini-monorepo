import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createContext, useContext } from "react"

import type { VariantProps } from "tailwind-variants"
import { createElement } from "~/lib/createElement"
import { createList } from "~/lib/list"

type ListVariantProps = VariantProps<typeof createList>

const ListContext = createContext(createList())

function Item(
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

Item.Content = function Content(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className={classes("flex-1", props.className)}></div>
}

Item.Title = function Headline(
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

Item.Subtitle = function SupportingText(
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

Item.TrailingSupportingText = function TrailingSupportingText(
	props: ComponentPropsWithoutRef<"span">
) {
	const { trailingSupportingText } = useContext(ListContext)

	return (
		<span
			{...props}
			className={trailingSupportingText({ className: props.className })}
		></span>
	)
}
Item.LeadingIcon = function LeadingIcon(
	props: ComponentPropsWithoutRef<"div">
) {
	return (
		<div
			{...props}
			className={classes(
				"h-[1.125rem] w-[1.125rem] text-on-surface-variant",
				props.className
			)}
		></div>
	)
}
Item.TrailingIcon = function TrailingIcon(
	props: ComponentPropsWithoutRef<"div">
) {
	return (
		<div
			{...props}
			className={classes("h-6 w-6 text-on-surface-variant", props.className)}
		></div>
	)
}
Item.Divider = function Divider(props: ComponentPropsWithoutRef<"hr">) {
	return (
		<hr
			{...props}
			className={classes("border border-surface-variant", props.className)}
		></hr>
	)
}
Item.LeadingAvatar = function LeadingAvatar(
	props: ComponentPropsWithoutRef<"div">
) {
	return (
		<div
			{...props}
			className={classes(
				"h-10 w-10 shrink-0 text-title-md text-on-primary-container",
				props.className
			)}
		></div>
	)
}
Item.Img = function Img(props: ComponentPropsWithoutRef<"img">) {
	return (
		<img
			alt=""
			{...props}
			className={classes("h-14 w-14 shrink-0", props.className)}
		></img>
	)
}
Item.LeadingVideo = function LeadingVideo(
	props: ComponentPropsWithoutRef<"video">
) {
	return (
		<video
			{...props}
			className={classes("h-16 w-[7.125rem] shrink-0", props.className)}
		></video>
	)
}
Item.Overline = function Overline(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={classes(
				"text-label-sm text-on-surface-variant",
				props.className
			)}
		></div>
	)
}

function List({
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

List.Item = Item

export default List
