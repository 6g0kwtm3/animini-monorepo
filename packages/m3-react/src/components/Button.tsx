import type { ComponentProps, ReactNode } from "react"
import { createContext, useContext } from "react"

import * as Ariakit from "@ariakit/react"
import { btnIcon, createButton } from "m3-core"
import type { VariantProps } from "tailwind-variants"
import { TouchTarget } from "./TouchTarget"

interface ButtonProps
	extends Ariakit.ButtonProps,
		VariantProps<typeof createButton> {}

export function Button({ variant, ...props }: ButtonProps): ReactNode {
	const styles = createButton({ variant })

	return (
		<ButtonContext.Provider value={styles}>
			<BaseButton
				{...props}
				className={styles.root({
					className: props.className,
				})}
			/>
		</ButtonContext.Provider>
	)
}

export function BaseButton(props: Ariakit.ButtonProps): ReactNode {
	return <Ariakit.Button {...props} />
}

const ButtonContext = createContext(createButton())

export function ButtonIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = useContext(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

interface IconProps extends VariantProps<typeof btnIcon>, Ariakit.ButtonProps {}

export function Icon({
	children,
	variant,
	className,
	...props
}: IconProps): ReactNode {
	return (
		<BaseButton {...props} className={btnIcon({ variant, className })}>
			{children}
			<TouchTarget />
		</BaseButton>
	)
}
