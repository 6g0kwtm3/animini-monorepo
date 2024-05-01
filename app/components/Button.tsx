import type {
	ComponentPropsWithoutRef,
	FC,
	PropsWithChildren,
	ReactNode
} from "react"
import { createContext, forwardRef, useContext } from "react"

import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { btnIcon, createButton } from "~/lib/button"
import { TouchTarget } from "./Tooltip"

export type Icon = FC<ComponentPropsWithoutRef<"div">>

interface ButtonProps
	extends Ariakit.ButtonProps,
		VariantProps<typeof createButton> {
	invoketarget?: string
	invokeaction?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	function Button({ variant, ...props }, ref) {
		const styles = createButton({ variant })

		return (
			<ButtonContext.Provider value={styles}>
				<BaseButton
					ref={ref}
					{...props}
					className={styles.root({
						className: props.className
					})}
				/>
			</ButtonContext.Provider>
		)
	}
)

export const BaseButton = forwardRef<
	HTMLButtonElement,
	Ariakit.ButtonProps
>(function BaseButton(props, ref) {
	return <Ariakit.Button ref={ref} {...props} />
})

const ButtonContext = createContext(createButton())
export function ButtonIcon(props: ComponentPropsWithoutRef<"div">): ReactNode {
	const { icon } = useContext(ButtonContext)
	return <div {...props} className={icon({ className: props.className })} />
}

export const Icon = forwardRef<
	HTMLButtonElement,
	VariantProps<typeof btnIcon> &
		PropsWithChildren<ComponentPropsWithoutRef<typeof Button>>
>(function ButtonIcon({ children, variant, className, ...props }, ref) {
	return (
		<BaseButton
			ref={ref}
			{...props}
			className={btnIcon({ variant, className })}
		>
			{children}
			<TouchTarget />
		</BaseButton>
	)
})
