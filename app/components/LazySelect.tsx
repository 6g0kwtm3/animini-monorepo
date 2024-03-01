import * as Ariakit from "@ariakit/react"

import type { ComponentPropsWithoutRef, FocusEvent } from "react"
import { forwardRef, useRef } from "react"

import { createMenu } from "~/lib/menu"
import { createTextField } from "~/lib/textField"
import { SelectContext } from "./SelectOption"
const { input } = createTextField({})
const { root } = createMenu()

export interface SelectProps extends Ariakit.SelectProps {
	value?: string
	setValue?: (value: string) => void
	defaultValue?: string
	onBlur?: React.FocusEventHandler<HTMLElement>
}

export const LazySelect = forwardRef<HTMLButtonElement, SelectProps>(
	function LazySelect(
		{ children, value, setValue, defaultValue, ...props },
		ref
	) {
		const store = Ariakit.useSelectStore({
			value,
			setValue,
			defaultValue: defaultValue ?? ""
		})
		const portalRef = useRef<HTMLDivElement>(null)

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
			<SelectContext.Provider value={LazySelectOption}>
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
							"z-10 max-h-[min(var(--popover-available-height,300px),300px)]"
					})}
				>
					{children}
				</Ariakit.SelectPopover>
			</SelectContext.Provider>
		)
	}
)

export interface FormSelectProps
	extends Omit<ComponentPropsWithoutRef<typeof Ariakit.Role.button>, "render">,
		Pick<ComponentPropsWithoutRef<typeof LazySelect>, "render"> {
	name: string
}

const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
	function FormSelect({ name, ...props }: FormSelectProps, ref) {
		const form = Ariakit.useFormContext()
		if (!form) throw new Error("FormSelect must be used within a Form")

		const value = form.useValue(name)

		const select = (
			<LazySelect
				ref={ref}
				value={value}
				setValue={(value) => form.setValue(name, value)}
				{...(props.render ? { render: props.render } : {})}
				name={name}
			/>
		)
		const field = <Ariakit.FormControl name={name} render={select} />
		return <Ariakit.Role.button {...props} render={field} />
	}
)

export default FormSelect

const { item } = createMenu({})

export function LazySelectOption(
	props: ComponentPropsWithoutRef<typeof Ariakit.SelectItem>
) {
	return (
		<Ariakit.SelectItem
			{...props}
			className={item({
				className: "data-[active-item]:state-focus"
			})}
		/>
	)
}
