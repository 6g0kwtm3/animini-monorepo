import { ComponentPropsWithoutRef, ElementType } from 'react'
import {} from 'react-dom'
import { classes } from '~/lib/styled'

type ItemProps<E extends ElementType> = ComponentPropsWithoutRef<E> & {
	as: E
	lines?: 'one' | 'two' | 'three'
}

function Item<E extends ElementType = 'span'>({ as: Component, lines, ...props }: ItemProps<E>) {
	Component ??= 'span'

	return (
		<Component
			{...props}
			className={classes(
				lines === 'two'
					? 'items-center h-[4.5rem] py-2'
					: lines === 'three'
					? 'h-[5.5rem] py-3'
					: 'items-center h-14 py-2',
				'flex gap-4 pl-4 pr-6',

				props.className
			)}
		/>
	)
}

Item.Content = function Content(props: ComponentPropsWithoutRef<'div'>) {
	return <div {...props} className={classes('flex-1', props.className)}></div>
}

Item.Headline = function Headline(props: ComponentPropsWithoutRef<'div'>) {
	return <div {...props} className={classes('text-body-lg text-on-surface', props.className)}></div>
}
Item.SupportingText = function SupportingText(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			{...props}
			className={classes('text-body-md text-on-surface-variant line-clamp-2', props.className)}
		></div>
	)
}
Item.TrailingSupportingText = function TrailingSupportingText(
	props: ComponentPropsWithoutRef<'span'>
) {
	return (
		<span
			{...props}
			className={classes('text-label-sm text-on-surface-variant', props.className)}
		></span>
	)
}
Item.LeadingIcon = function LeadingIcon(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			{...props}
			className={classes('text-on-surface-variant w-[1.125rem] h-[1.125rem]', props.className)}
		></div>
	)
}
Item.TrailingIcon = function TrailingIcon(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div {...props} className={classes('text-on-surface-variant w-6 h-6', props.className)}></div>
	)
}
Item.Divider = function Divider(props: ComponentPropsWithoutRef<'hr'>) {
	return <hr {...props} className={classes('border border-surface-variant', props.className)}></hr>
}
Item.LeadingAvatar = function LeadingAvatar(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			{...props}
			className={classes(
				'shrink-0 text-title-md text-on-primary-container w-10 h-10',
				props.className
			)}
		></div>
	)
}
Item.Img = function Img(props: ComponentPropsWithoutRef<'img'>) {
	return <img {...props} className={classes('shrink-0 w-14 h-14', props.className)}></img>
}
Item.LeadingVideo = function LeadingVideo(props: ComponentPropsWithoutRef<'video'>) {
	return (
		<video {...props} className={classes('shrink-0 w-[7.125rem] h-16', props.className)}></video>
	)
}
Item.Overline = function Overline(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div
			{...props}
			className={classes('text-label-sm text-on-surface-variant', props.className)}
		></div>
	)
}

function List(props: ComponentPropsWithoutRef<'div'>) {
	return <div {...props} className={classes('py-2', props.className)}></div>
}

List.Item = Item

export default List
