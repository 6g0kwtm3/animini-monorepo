import * as Ariakit from "@ariakit/react"
import { createContext, useContext } from "react"

import { btnIcon, createButton, fab } from "./button.styles"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
	TouchTarget,
} from "./Tooltip"

import type { ComponentProps, ReactNode } from "react"
import type { VariantProps } from "tailwind-variants"

interface ButtonProps
	extends Ariakit.ButtonProps, VariantProps<typeof createButton> {
	invoketarget?: string
	invokeaction?: string
}

export function Button({ variant, ...props }: ButtonProps) {
	const styles = createButton({ variant })

	return (
		<ButtonContext.Provider value={styles}>
			<Ariakit.Button
				{...props}
				className={styles.root({ className: props.className })}
			/>
		</ButtonContext.Provider>
	)
}

const ButtonContext = createContext(createButton())
ButtonContext.displayName = "ButtonContext"
export function ButtonIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = useContext(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

interface ButtonWithTooltipProps extends Omit<Ariakit.ButtonProps, "title"> {
	label:
		| { kind: "ariakit-tooltip"; value: ReactNode }
		| { kind: "html-title"; value: string }
}

export function ButtonWithTooltip({
	label,
	children,
	...props
}: ButtonWithTooltipProps) {
	const store = Ariakit.useTooltipStore()
	const button = (
		<Ariakit.Button
			{...props}
			title={label.kind === "html-title" ? label.value : undefined}
			onClick={(...args) => {
				if (label.kind === "ariakit-tooltip") {
					store.setOpen(false)
				}
				props.onClick?.(...args)
			}}
		>
			{children}
			<Ariakit.VisuallyHidden>{label.value}</Ariakit.VisuallyHidden>
		</Ariakit.Button>
	)

	switch (label.kind) {
		case "ariakit-tooltip":
			return (
				<TooltipPlain store={store}>
					<TooltipPlainTrigger render={button}></TooltipPlainTrigger>
					<TooltipPlainContainer>{label.value}</TooltipPlainContainer>
				</TooltipPlain>
			)
		case "html-title":
			return button
	}
}

interface IconProps
	extends ButtonWithTooltipProps, VariantProps<typeof btnIcon> {}

export function Icon({ children, variant, className, ...props }: IconProps) {
	return (
		<ButtonWithTooltip {...props} className={btnIcon({ variant, className })}>
			{children}
			<TouchTarget />
		</ButtonWithTooltip>
	)
}

interface FabProps
	extends Omit<ButtonWithTooltipProps, "color">, VariantProps<typeof fab> {}

export function Fab({ children, size, color, className, ...props }: FabProps) {
	return (
		<ButtonWithTooltip {...props} className={fab({ size, color, className })}>
			{children}
		</ButtonWithTooltip>
	)
}
