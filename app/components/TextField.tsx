import { Predicate } from "effect"
import type {
	ComponentPropsWithoutRef,
	ElementRef,
	ReactElement,
	ReactNode
} from "react"
import { createContext, useContext, useId, useRef } from "react"

import type { VariantProps } from "tailwind-variants"
import { createElement } from "~/lib/createElement"
import { createTextField, createTextFieldInput } from "~/lib/textField"
import MaterialSymbolsCalendarToday from "~icons/material-symbols/calendar-today"
import MaterialSymbolsCancelOutline from "~icons/material-symbols/cancel-outline"

import MaterialSymbolsError from "~icons/material-symbols/error"
import { Icon } from "./Button"

const Context = createContext(createTextFieldInput())

const { root, text } = createTextField()

export function TextFieldText(props: ComponentPropsWithoutRef<"p">) {
	return <p {...props} className={text({ className: props.className })} />
}

function TextFieldContainer(props: ComponentPropsWithoutRef<"div">) {
	const { container } = useContext(Context)
	return (
		<div {...props} className={container({ className: props.className })} />
	)
}

export function TextField(props: ComponentPropsWithoutRef<"label">) {
	return <div {...props} className={root({ className: props.className })} />
}

const LabelContext = createContext<string | undefined>(undefined)

export function TextFieldInput({
	children,
	leading,
	trailing,
	variant,
	...props
}: ComponentPropsWithoutRef<"input"> &
	VariantProps<typeof createTextFieldInput> & {
		render?: ReactElement
		leading?: ReactNode
		trailing?: ReactNode
	}) {
	const styles = createTextFieldInput({ variant })
	const { input } = styles
	const ref = useRef<ElementRef<"input">>()
	const id = useId()
	props.id ??= id

	return (
		<LabelContext.Provider value={props.id}>
			<Context.Provider value={styles}>
				<TextFieldContainer className="">
					{Predicate.isString(leading) ? (
						<Suffix>{leading}</Suffix>
					) : leading !== undefined ? (
						leading
					) : props.type === "date" || props.type === "datetime-local" ? (
						<TextFieldIcon>
							<MaterialSymbolsCalendarToday />
						</TextFieldIcon>
					) : null}
					<div className="group/suffix peer relative flex flex-1 items-center">
						{createElement("input", {
							...props,
							ref: ref,
							placeholder: props.placeholder || " ",
							className: input({ className: props.className })
						})}
						{children}
						{Predicate.isString(trailing) ? (
							<Suffix>{trailing}</Suffix>
						) : trailing !== undefined ? (
							trailing
						) : (
							<>
								<TextFieldIcon className="hidden group-error:block">
									<MaterialSymbolsError />
								</TextFieldIcon>
								{(!props.type || props.type === "search") && (
									<Icon
										className="cursor-default group-has-[:placeholder-shown]:hidden group-error:hidden group-has-focused:block group-has-focused:group-error:hidden"
										onClick={(props) => {
											if (ref.current && !ref.current.disabled)
												ref.current.value = ""
										}}
										aria-disabled={props["aria-disabled"]}
										disabled={props["disabled"]}
										render={<button type="button" />}
									>
										<MaterialSymbolsCancelOutline />
									</Icon>
								)}
							</>
						)}
					</div>
					<TextFieldOutline>
						<Context.Provider
							value={{
								...styles,
								label: () => "contents"
							}}
						>
							{children}
						</Context.Provider>
					</TextFieldOutline>
				</TextFieldContainer>
			</Context.Provider>
		</LabelContext.Provider>
	)
}

function Suffix(props: ComponentPropsWithoutRef<"span">) {
	const { suffix } = useContext(Context)

	return <span {...props} className={suffix({ className: props.className })} />
}

export function TextFieldInputLabel({
	...props
}: ComponentPropsWithoutRef<"label">) {
	const { label } = useContext(Context)
	const id = useContext(LabelContext)
	props.htmlFor ??= id

	return (
		<label {...props} className={label({ className: props.className })}>
				{props.children}
			</label>
	)
}

function TextFieldOutline(props: ComponentPropsWithoutRef<"fieldset">) {
	const { outline } = useContext(Context)

	return (
		<fieldset {...props} className={outline({ className: props.className })}>
			<legend
				className={
					"overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0 group-has-focused:group-has-[:placeholder-shown]:max-w-none"
				}
			>
				<span className="px-1 text-body-sm group-has-[:required]:after:content-['*']">
					{props.children}
				</span>
			</legend>
		</fieldset>
	)
}

export function TextFieldIcon(
	props: ComponentPropsWithoutRef<"div"> & {
		render?: ReactElement
	}
) {
	const { icon } = useContext(Context)
	return createElement("div", {
		...props,
		className: icon({ className: props.className })
	})
}
