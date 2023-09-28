const Slot = 'div'
import type { ComponentPropsWithoutRef } from 'react';
const classes = (...classes: (string | 0|false | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};
type Card = React.FC<
	ComponentPropsWithoutRef<'div'> & {
		disabled?: boolean
		dragged?: boolean
		pressed?: boolean
		action?: boolean
		asChild?: boolean
	}
>

export const Elevated: Card = ({ asChild, ...props }) => {
	const Component = asChild ? Slot : 'div'
	return (
		<Component
			{...props}
			tabIndex={props.disabled ? -1 : props.tabIndex}
			className={classes(
				props.disabled
					? 'text-on-surface/[.38]'
					: props.pressed
					? 'text-on-surface elevation-1 state-pressed'
					: props.dragged
					? 'text-on-surface elevation-3 state-dragged'
					: 'text-on-surface elevation-1',

				props.action &&
					!props.disabled &&
					!props.pressed &&
					!props.dragged &&
					'hover:elevation-2 hover:state-hover',
				'relative overflow-hidden rounded-md bg-surface surface state-on-surface p-4 focus:elevation-1 focus:state-focus',
				props.className
			)}
		></Component>
	)
}

export const Filled: Card = ({ asChild, ...props }) => {
	const Component = asChild ? Slot : 'div'
	return (
		<Component
			{...props}
			tabIndex={props.disabled ? -1 : props.tabIndex}
			className={classes(
				props.disabled
					? 'text-on-surface-variant/[.38]'
					: props.pressed
					? 'text-on-surface-variant state-pressed'
					: props.dragged
					? 'text-on-surface-variant elevation-3 state-dragged'
					: 'text-on-surface-variant',

				props.action &&
					!props.disabled &&
					!props.pressed &&
					!props.dragged &&
					'hover:elevation-1 hover:state-hover',
				'relative overflow-hidden rounded-md bg-surface-variant surface state-on-surface-variant p-4 focus:elevation-1 focus:state-focus',
				props.className
			)}
		></Component>
	)
}

export const Outlined: Card = ({ asChild, ...props }) => {
	const Component = asChild ? Slot : 'div'

	return (
		<Component
			{...props}
			tabIndex={props.disabled ? -1 : props.tabIndex}
			className={classes(
				props.disabled
					? 'border-outline/[.12] text-on-surface/[.38]'
					: props.pressed
					? 'border-outline text-on-surface state-pressed'
					: props.dragged
					? 'border-outline text-on-surface elevation-3 state-dragged'
					: 'border-outline text-on-surface',

				props.action &&
					!props.disabled &&
					!props.pressed &&
					!props.dragged &&
					'hover:elevation-1 hover:state-hover',
				'relative overflow-hidden rounded-md border surface state-on-surface p-4 focus:elevation-1 focus:state-focus',
				props.className
			)}
		></Component>
	)
}
