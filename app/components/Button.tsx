import type {
	ComponentPropsWithoutRef,
	FC,
	PropsWithChildren,
	SyntheticEvent
} from "react"
import { createContext, forwardRef, useContext } from "react"

import * as Ariakit from "@ariakit/react"
import type { VariantProps } from "tailwind-variants"
import { btnIcon, createButton } from "~/lib/button"
import { TouchTarget } from "./Tooltip"

export type Icon = FC<ComponentPropsWithoutRef<"div">>

interface ButtonProps
	extends ComponentPropsWithoutRef<typeof Ariakit.Button>,
		VariantProps<typeof createButton> {
	invoketarget?: string
	invokeaction?: string
}

interface InvokeEventInit extends EventInit {
	action?: string
	relatedTarget: HTMLElement
}

export class InvokeEvent extends Event {
	readonly relatedTarget: HTMLElement
	readonly action: string

	constructor(init: InvokeEventInit) {
		super("invoke", init)
		this.relatedTarget = init.relatedTarget

		this.action = init.action ?? "auto"
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		invoke: InvokeEvent
	}
}

declare global {
	interface GlobalEventHandlersEventMap {
		beforetoggle: ToggleEvent
	}
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
	ComponentPropsWithoutRef<typeof Ariakit.Button> & {
		invoketarget?: string
		invokeaction?: string
	}
>(function BaseButton(props, ref) {
	function invoke(event: SyntheticEvent<HTMLElement>) {
		if (typeof props.invoketarget === "string" && props.type !== "submit") {
			event.preventDefault()
			document.querySelector(`#${props.invoketarget}`)?.dispatchEvent(
				new InvokeEvent({
					relatedTarget: event.currentTarget,
					...(typeof props.invokeaction === "string"
						? { action: props.invokeaction }
						: {})
				})
			)
		}
	}

	return (
		<Ariakit.Button
			ref={ref}
			{...props}
			onKeyDown={(event) => {
				props.onKeyDown?.(event)
				if (event.isDefaultPrevented()) {
					return
				}

				if (event.key === " " || event.key === "Enter") {
					invoke(event)
				}
			}}
			onClick={(event) => {
				props.onClick?.(event)
				if (event.isDefaultPrevented()) {
					return
				}
				invoke(event)
			}}
		/>
	)
})

const ButtonContext = createContext(createButton())

export function ButtonIcon(props: ComponentPropsWithoutRef<"div">) {
	const { icon } = useContext(ButtonContext)
	return <div {...props} className={icon({ className: props.className })}></div>
}

export const Icon = forwardRef<
	HTMLButtonElement,
	VariantProps<typeof btnIcon> &
		PropsWithChildren<ComponentPropsWithoutRef<typeof Button>>
>(function ButtonIcon({ children, variant, className, ...props }, ref) {
	return (
		<BaseButton ref={ref} {...props} className={btnIcon({ variant, className })}>
			{children}
			<TouchTarget></TouchTarget>
		</BaseButton>
	)
})
