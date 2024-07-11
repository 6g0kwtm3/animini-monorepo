import type { ComponentPropsWithRef, ReactNode } from "react"
import { use } from "react"
import type { VariantProps } from "tailwind-variants"

import { Ariakit } from "~/lib/ariakit"
import { createList, ListContext } from "~/lib/list"
import { tv } from "~/lib/tailwind-variants"

interface ListVariantProps
	extends ComponentPropsWithRef<"li">,
		VariantProps<typeof createList> {}

export function ListItem({ lines, ...props }: ListVariantProps): ReactNode {
	const { item } = use(ListContext)
	return (
		<li {...props} className={item({ className: props.className, lines })} />
	)
}

export function ListItemContentTitle(
	props: ComponentPropsWithRef<"div">
): ReactNode {
	const { itemTitle } = use(ListContext)

	return (
		<div {...props} className={itemTitle({ className: props.className })} />
	)
}
export function ListItemContent(
	props: ComponentPropsWithRef<"div">
): ReactNode {
	const { itemContent } = use(ListContext)

	return (
		<div {...props} className={itemContent({ className: props.className })} />
	)
}

export function ListItemContentSubtitle(
	props: ComponentPropsWithRef<"div">
): ReactNode {
	const { itemSubtitle } = use(ListContext)

	return (
		<div {...props} className={itemSubtitle({ className: props.className })} />
	)
}
export function ListItemImg(props: ComponentPropsWithRef<"div">): ReactNode {
	const { itemImg } = use(ListContext)
	return <div {...props} className={itemImg({ className: props.className })} />
}

export function ListItemAvatar(props: ComponentPropsWithRef<"div">): ReactNode {
	const { itemAvatar } = use(ListContext)

	return (
		<div {...props} className={itemAvatar({ className: props.className })} />
	)
}
export function ListItemIcon(props: ComponentPropsWithRef<"div">): ReactNode {
	const { itemIcon } = use(ListContext)

	return <div {...props} className={itemIcon({ className: props.className })} />
}

const subheader = tv({
	base: "truncate px-4 text-body-md text-on-surface-variant",
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
	props: ComponentPropsWithRef<"span">
): ReactNode {
	const { trailingSupportingText } = use(ListContext)

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
}: ComponentPropsWithRef<"ul"> & ListVariantProps): ReactNode {
	const styles = createList({ lines })

	return (
		<ListContext.Provider value={styles}>
			<ul {...props} className={styles.root({ className: props.className })} />
		</ListContext.Provider>
	)
}
