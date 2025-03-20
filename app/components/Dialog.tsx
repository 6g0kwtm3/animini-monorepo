import { createContext, use, type ComponentProps, type ReactNode } from "react"
import type { VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { createDialog } from "~/lib/dialog"
import { classes } from "./classes"

export function DialogContentIcon(props: ComponentProps<"div">): ReactNode {
	const styles = use(Styles)

	return (
		<div {...props} className={styles.icon({ className: props.className })}>
			{props.children}
		</div>
	)
}
export function DialogFullscreenIcon(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={classes("i-6 h-6 w-6", props.className)} />
}

const Styles = createContext(createDialog())

export function Dialog({
	variant,
	...props
}: Ariakit.DialogProps & VariantProps<typeof createDialog>): ReactNode {
	const styles = createDialog({ variant })

	return (
		<Styles value={styles}>
			<Ariakit.Dialog
				backdrop={<div className={styles.backdrop()} />}
				{...props}
				className={styles.root({ className: props.className })}
			/>
		</Styles>
	)
}

export function DialogContent(props: ComponentProps<"div">): ReactNode {
	const styles = use(Styles)
	return (
		<div
			{...props}
			className={styles.content({
				className: props.className,
			})}
		/>
	)
}

export function DialogContentBody(props: ComponentProps<"div">): ReactNode {
	const styles = use(Styles)
	return (
		<div
			{...props}
			className={styles.body({
				className: props.className,
			})}
		/>
	)
}

export function DialogContentHeadline(props: ComponentProps<"div">): ReactNode {
	const styles = use(Styles)
	return (
		<div
			{...props}
			className={styles.headline({
				className: props.className,
			})}
		/>
	)
}

export function DialogContentFooter(props: ComponentProps<"div">): ReactNode {
	const styles = use(Styles)
	return (
		<div
			{...props}
			className={styles.actions({
				className: props.className,
			})}
		/>
	)
}
