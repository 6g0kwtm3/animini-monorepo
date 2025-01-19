import * as Ariakit from "@ariakit/react"
import {
	forwardRef,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from "react"
import { createTextField } from "~/lib/textField"
import { classes } from "./classes"

export function TextFieldOutlined({
	children,
	...props
}: ComponentProps<"div">): ReactNode {
	const { container, containerBefore, containerAfter } = use(Context)
	return (
		<div {...props} className={container({ className: props.className })}>
			<div className={containerBefore()} />
			{children}
			<div className={containerAfter()} />
		</div>
	)
}

export function TextFieldOutlinedSupporting(props: Ariakit.FormErrorProps) {
	return (
		<Ariakit.FormError
			{...props}
			className={classes(
				"text-body-sm text-on-surface-variant group-has-[:disabled]:text-on-surface/[.38] group-error:text-error order-last gap-4 px-4 pt-1",
				props.className
			)}
		/>
	)
}

function OutlinedLabel({ children, ...props }: Ariakit.FormLabelProps) {
	return (
		<>
			<Ariakit.FormLabel
				{...props}
				className="text-body-sm text-on-surface-variant group-focus-within:text-primary group-hover:text-on-surface group-focus-within:group-hover:text-primary peer-placeholder-shown:text-body-lg group-focus-within:peer-placeholder-shown:text-body-sm peer-disabled:text-on-surface/[.38] group-hover:peer-disabled:text-on-surface/[.38] group-error:text-error group-error:group-focus-within:text-error group-focus-within:group-error:text-error group-hover:group-error:text-on-error-container group-hover:group-error:group-focus-within:text-error group-error:peer-disabled:text-on-surface/[.38] peer-disabled:group-error:text-on-surface/[.38] pointer-events-none absolute -top-2 left-4 transition-all peer-placeholder-shown:top-4 group-focus-within:peer-placeholder-shown:-top-2 group-focus-within:peer-placeholder-shown:left-4 group-has-[:required]:after:content-['*']"
			>
				{children}
			</Ariakit.FormLabel>

			<fieldset className="border-outline group-focus-within:border-primary group-hover:border-on-surface group-hover:group-focus-within:border-primary group-has-[:disabled]:border-outline/[.12] group-hover:group-has-[:disabled]:border-outline/[.12] group-error:border-error group-focus-within:group-error:border-error group-hover:group-error:border-on-error-container group-focus-within:group-hover:group-error:border-error pointer-events-none absolute -top-[0.71875rem] right-0 bottom-0 left-0 rounded-xs border px-[0.625rem] transition-all group-focus-within:border-2">
				<legend
					className={
						"overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0 group-focus-within:group-has-[:placeholder-shown]:max-w-none"
					}
				>
					<span className="text-body-sm px-1 group-has-[:required]:after:content-['*']">
						{children}
					</span>
				</legend>
			</fieldset>
		</>
	)
}

export const TextFieldOutlinedInput = forwardRef<
	HTMLInputElement,
	Ariakit.FormInputProps
>(function TextFieldOutlinedInput(props, ref) {
	const { input } = createTextField({ variant: "outlined" })
	return (
		<Ariakit.FormInput
			ref={ref}
			type="text"
			{...props}
			placeholder=" "
			className={input({ className: props.className })}
		/>
	)
})

export function TextFieldOutlinedFactory({
	label,
	...props
}: ComponentPropsWithoutRef<typeof TextFieldOutlinedInput> & {
	label: ReactNode
}) {
	return (
		<TextFieldOutlined>
			<TextFieldOutlinedInput {...props} />
			<OutlinedLabel name={props.name}>{label}</OutlinedLabel>
			{/* <TextFieldOutlinedSupporting
				name={props.name}
			></TextFieldOutlinedSupporting> */}
		</TextFieldOutlined>
	)
}

TextFieldOutlined.Label = OutlinedLabel

export function TextFieldFilled(
	props: ComponentPropsWithoutRef<"label">
): JSX.Element {
	return (
		<label
			{...props}
			className={classes(
				"group bg-surface-container-highest before:border-on-surface-variant after:border-primary hover:state-hover hover:before:border-on-surface focus-within:hover:state-none has-[:disabled]:before:border-on-surface/[.38] hover:has-[:disabled]:before:border-on-surface/[.38] error:before:border-error error:after:border-error error:focus-within:after:scale-x-100 error:hover:before:border-on-error-container relative flex items-center overflow-hidden rounded-t-xs before:absolute before:bottom-0 before:left-0 before:w-full before:border-b after:absolute after:bottom-0 after:left-0 after:w-full after:scale-x-0 after:border-b-2 after:transition-transform focus-within:after:scale-x-100",
				props.className
			)}
		/>

		/* <p
      className={classes(
        props.disabled
          ? "text-on-surface/[.38]"
          : error
          ? "text-error"
          : "text-on-surface-variant",

        "gap-4 text-body-sm px-4 pt-1"
      )}
    >
      {supporting}
    </p> */
	)
}

export function TextFieldFilledInput(props: Ariakit.FormInputProps) {
	return (
		<Ariakit.FormInput
			{...props}
			placeholder=" "
			className={classes(
				"peer text-body-lg text-on-surface caret-primary disabled:text-on-surface/[.38] group-error:caret-error flex min-h-[3.5rem] min-w-0 flex-1 items-center bg-transparent px-4 pt-6 pb-2 placeholder-transparent outline-none focus:ring-0",
				props.className
			)}
		/>
	)
}

export function TextFieldFilledLabel(props: Ariakit.FormLabelProps) {
	return (
		<Ariakit.FormLabel
			{...props}
			className={classes(
				"group-hover:on-surface text-body-sm text-on-surface-variant text-on-surface/[.38] group-focus-within:text-primary peer-placeholder-shown:text-body-lg group-focus-within:peer-placeholder-shown:text-body-sm group-error:text-error group-error:group-hover:text-on-error-container group-error:group-hover:group-focus-within:text-error pointer-events-none absolute transition-all peer-placeholder-shown:top-4 group-has-[:disabled]:peer-placeholder-shown:top-4",
				// props.leading ? "left-12" :
				"left-4",
				"group-focus-within:peer-placeholder-shown:top-2",
				"top-2",
				props.className
			)}
		>
			{props.children}
		</Ariakit.FormLabel>
	)
}

function FieldOutline(props: ComponentProps<"fieldset">): ReactNode {
	const { outline } = use(Context)

	return (
		<fieldset {...props} className={outline({ className: props.className })}>
			<legend
				className={
					"group-has-focused:group-has-[:placeholder-shown]:max-w-none overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0"
				}
			>
				<span className="text-body-sm px-1">
					{props.children}
					<span className="hidden group-has-[:required]:inline">*</span>
				</span>
			</legend>
		</fieldset>
	)
}

export function FieldTextIcon(props: ComponentProps<"div">): ReactNode {
	const { icon } = use(Context)

	return <div {...props} className={icon({ className: props.className })} />
}
