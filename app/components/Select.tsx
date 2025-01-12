import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import { createTextField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { forwardRef, useRef } from "react"
import { createMenu } from "~/lib/menu"

const { input } = createTextField({})

export function SelectFactory({
	label,
	...props
}: Ariakit.SelectProps & {
	children: ReactNode
	label: ReactNode
	name: string
}): ReactNode {
	return (
		<Ariakit.SelectProvider>
			<TextFieldOutlined>
				<Select {...props} />
				<Ariakit.SelectLabel className="sr-only">{label}</Ariakit.SelectLabel>
				<TextFieldOutlined.Label name={props.name}>
					{label}
				</TextFieldOutlined.Label>
			</TextFieldOutlined>
		</Ariakit.SelectProvider>
	)
}

const { root } = createMenu()

export interface SelectProps extends Ariakit.SelectProps {
	value?: string
	setValue?: (value: string) => void
	defaultValue?: string
	onBlur?: React.FocusEventHandler<HTMLElement>
}

import type { FocusEvent } from "react"

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
	function LazySelect(
		{ children, value, setValue, defaultValue, ...props },
		ref
	) {
		const store = Ariakit.useSelectStore({
			value,
			setValue,
			defaultValue: defaultValue ?? "",
		})
		const portalRef = useRef<HTMLElement>(null)

		// Only call onBlur if the focus is leaving the whole widget.
		const onBlur = (event: FocusEvent<HTMLElement>) => {
			const portal = portalRef.current
			const { selectElement, popoverElement } = store.getState()
			if (portal?.contains(event.relatedTarget)) return
			if (selectElement?.contains(event.relatedTarget)) return
			if (popoverElement?.contains(event.relatedTarget)) return
			props.onBlur?.(event)
		}

		return (
			<>
				<Ariakit.Select
					ref={ref}
					{...props}
					store={store}
					onBlur={onBlur}
					className={input({ className: "cursor-default" })}
				/>
				<Ariakit.SelectPopover
					sameWidth
					store={store}
					onBlur={onBlur}
					className={root({
						className:
							"z-10 max-h-[min(var(--popover-available-height,300px),300px)]",
					})}
				>
					{children}
				</Ariakit.SelectPopover>
			</>
		)
	}
)
