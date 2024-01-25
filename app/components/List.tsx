import type { ComponentPropsWithoutRef } from "react"
import { } from "react-dom"
import { list } from "~/lib/list"



const {item,root} = list()
function Item(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div {...props} className={item({ className: props.className })} />
	)
}

Item.Content = function Content(props: ComponentPropsWithoutRef<"div">) {
	return <div {...props} className={classes("flex-1", props.className)}></div>
}

Item.Headline = function Headline(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={classes("text-body-lg text-on-surface", props.className)}
		></div>
	)
}
Item.SupportingText = function SupportingText(
	props: ComponentPropsWithoutRef<"div">
) {
	return (
		<div
			{...props}
			className={classes(
				"line-clamp-2 text-body-md text-on-surface-variant",
				props.className
			)}
		></div>
	)
}
Item.TrailingSupportingText = function TrailingSupportingText(
	props: ComponentPropsWithoutRef<"span">
) {
	return (
		<span
			{...props}
			className={classes(
				"text-label-sm text-on-surface-variant",
				props.className
			)}
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

function List(props: ComponentPropsWithoutRef<"ul">) {
	return (
		<ul {...props} className={root({ className: props.className })}></ul>
	)
}

List.Item = Item

export default List
