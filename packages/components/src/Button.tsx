import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext } from "react"

import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { btnIcon, createButton, fab } from "./button.styles"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
	TouchTarget,
} from "./Tooltip"

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

interface ButtonWithTooltipProps extends Ariakit.ButtonProps {
	tooltip: boolean
	title: string
}

export function ButtonWithTooltip({
	tooltip,
	title,
	children,
	...props
}: ButtonWithTooltipProps) {
	const store = Ariakit.useTooltipStore()
	const button = (
		<Ariakit.Button
			{...props}
			onClick={(...args) => {
				if (tooltip) {
					store.setOpen(false)
				}
				props.onClick?.(...args)
			}}
		>
			{children}
		</Ariakit.Button>
	)

	if (!tooltip) {
		return button
	}

	return (
		<TooltipPlain store={store}>
			<TooltipPlainTrigger render={button}></TooltipPlainTrigger>
			<TooltipPlainContainer>{title}</TooltipPlainContainer>
		</TooltipPlain>
	)
}

interface IconProps
	extends ButtonWithTooltipProps, VariantProps<typeof btnIcon> {}

export function Icon({ children, variant, className, ...props }: IconProps) {
	return (
		<ButtonWithTooltip {...props} className={btnIcon({ variant, className })}>
			{children}
			<Ariakit.VisuallyHidden>{props.title}</Ariakit.VisuallyHidden>
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
			<Ariakit.VisuallyHidden>{props.title}</Ariakit.VisuallyHidden>
		</ButtonWithTooltip>
	)
}
