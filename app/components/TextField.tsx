import { Predicate } from "effect"
import type { ComponentProps, ComponentRef, ReactNode } from "react"
import { createContext, useContext, useId, useRef } from "react"

import type { VariantProps } from "tailwind-variants"

import { createTextField, createTextFieldInput } from "~/lib/textField"
import MaterialSymbolsCalendarToday from "~icons/material-symbols/calendar-today"
import MaterialSymbolsCancelOutline from "~icons/material-symbols/cancel-outline"

import MaterialSymbolsError from "~icons/material-symbols/error"
import { Icon } from "./Button"

const Context = createContext(createTextFieldInput())

const { root, text } = createTextField()

export function FieldSupport(props: ComponentProps<"p">): ReactNode {
	return <p {...props} className={text({ className: props.className })} />
}

function FieldContainer({
	children,
	...props
}: ComponentProps<"div">): ReactNode {
	const { container, containerBefore, containerAfter } = useContext(Context)
	return (
		<div {...props} className={container({ className: props.className })}>
			<div className={containerBefore()} />
			{children}
			<div className={containerAfter()} />
		</div>
	)
}

export function Field(props: ComponentProps<"div">): ReactNode {
	return <div {...props} className={root({ className: props.className })} />
}

const LabelContext = createContext<string | undefined>(undefined)

export function FieldText({
	leading,
	trailing,
	variant,
	label,
	...props
}: ComponentProps<"input"> &
	VariantProps<typeof createTextFieldInput> & {
		leading?: ReactNode
		trailing?: ReactNode
		label?: ReactNode
	}): ReactNode {
	const styles = createTextFieldInput({ variant })
	const { input } = styles
	const ref = useRef<ComponentRef<"input">>(null)
	const id = useId()
	props.id ??= id

	return (
		<LabelContext.Provider value={props.id}>
			<Context.Provider value={styles}>
				<FieldContainer className="">
					{Predicate.isString(leading) ? (
						<FieldTextSuffix>{leading}</FieldTextSuffix>
					) : leading !== undefined ? (
						leading
					) : props.type === "date" || props.type === "datetime-local" ? (
						<FieldTextIcon>
							<MaterialSymbolsCalendarToday />
						</FieldTextIcon>
					) : null}
					<div className="group/suffix peer relative flex flex-1 items-center">
						<input
							type="text"
							{...props}
							placeholder={props.placeholder || " "}
							className={input({ className: props.className })}
						/>
						{Predicate.isString(label) ? (
							<FieldTextLabel>{label}</FieldTextLabel>
						) : (
							label
						)}
						{Predicate.isString(trailing) ? (
							<FieldTextSuffix>{trailing}</FieldTextSuffix>
						) : trailing !== undefined ? (
							trailing
						) : (
							<>
								<FieldTextIcon className="hidden group-error:block">
									<MaterialSymbolsError />
								</FieldTextIcon>
								{(!props.type || props.type === "search") && (
									<Icon
										className="cursor-default group-has-[:placeholder-shown]:hidden group-error:hidden group-has-focused:block group-has-focused:group-error:hidden"
										onClick={(props) => {
											if (ref.current && !ref.current.disabled)
												ref.current.value = ""
										}}
										aria-disabled={props["aria-disabled"]}
										disabled={props.disabled}
										type="button" 
										label="Clear"
									>
										<MaterialSymbolsCancelOutline />
									</Icon>
								)}
							</>
						)}
					</div>
					<FieldOutline>
						<Context.Provider
							value={{
								...styles,
								label: () => "contents",
							}}
						>
							{label}
						</Context.Provider>
					</FieldOutline>
				</FieldContainer>
			</Context.Provider>
		</LabelContext.Provider>
	)
}

export function FieldTextSuffix(props: ComponentProps<"span">): ReactNode {
	const { suffix } = useContext(Context)

	return <span {...props} className={suffix({ className: props.className })} />
}

export function FieldTextLabel({
	...props
}: ComponentProps<"label">): ReactNode {
	const { label, labelAfter } = useContext(Context)
	const id = useContext(LabelContext)
	props.htmlFor ??= id

	return (
		<label {...props} className={label({ className: props.className })}>
			{props.children}
			<span className={labelAfter()}>*</span>
		</label>
	)
}

function FieldOutline(props: ComponentProps<"fieldset">): ReactNode {
	const { outline } = useContext(Context)

	return (
		<fieldset {...props} className={outline({ className: props.className })}>
			<legend
				className={
					"overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0 group-has-focused:group-has-[:placeholder-shown]:max-w-none"
				}
			>
				<span className="px-1 text-body-sm">
					{props.children}
					<span className="hidden group-has-[:required]:inline">*</span>
				</span>
			</legend>
		</fieldset>
	)
}

export function FieldTextIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = useContext(Context)

	return <div {...props} className={icon({ className: props.className })} />
}
