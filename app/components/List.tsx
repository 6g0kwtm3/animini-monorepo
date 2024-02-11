import { createContext, type ComponentPropsWithoutRef, useContext } from "react"
import {} from "react-dom"
import type { VariantProps } from "tailwind-variants"
import { list } from "~/lib/list"

type ListVariantProps = VariantProps<typeof list>

const ListContext = createContext(list())

function Item(props: ComponentPropsWithoutRef<"div">) {
	const { item } = useContext(ListContext)

	return <div {...props} className={item({ className: props.className })} />
}

Item.Content = function Content(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className={classes("flex-1", props.className)}></div>
}

Item.Title = function Headline(props: ComponentPropsWithoutRef<"div">) {
	const { itemTitle } = useContext(ListContext)
	return (
		<div {...props} className={itemTitle({ className: props.className })}></div>
	)
}

Item.Subtitle = function SupportingText(
	props: ComponentPropsWithoutRef<"div">
) {
	const { itemSubtitle } = useContext(ListContext)

	return (
		<div
			{...props}
			className={itemSubtitle({ className: props.className })}
		></div>
	)
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
}: ComponentPropsWithoutRef<"ul"> & ListVariantProps) {
	const styles = list({ lines })

	return (
		<ListContext.Provider value={styles}>
			<ul
				{...props}
				className={styles.root({ className: props.className })}
			></ul>
		</ListContext.Provider>
	)
}

List.Item = Item

export default List
