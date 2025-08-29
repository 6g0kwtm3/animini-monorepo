import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext } from "react"

import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { btnIcon, createButton } from "~/lib/button"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
	TouchTarget,
} from "./Tooltip"

interface ButtonProps
	extends Ariakit.ButtonProps,
		VariantProps<typeof createButton> {
	invokeaction?: string
	invoketarget?: string
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
interface IconProps extends Ariakit.ButtonProps, VariantProps<typeof btnIcon> {
	title: string
	tooltip: boolean
}

export function ButtonIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = useContext(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

export function Icon({
	children,
	className,
	tooltip,
	variant,
	...props
}: IconProps) {
	const button = (
		<Ariakit.Button {...props} className={btnIcon({ className, variant })}>
			{children}
			<TouchTarget />
		</Ariakit.Button>
	)
	if (!tooltip) {
		return button
	}
	return (
		<TooltipPlain>
			<TooltipPlainTrigger render={button}></TooltipPlainTrigger>
			<TooltipPlainContainer>{props.title}</TooltipPlainContainer>
		</TooltipPlain>
	)
}
