import * as Ariakit from "@ariakit/react"
import {
	forwardRef,
	type ComponentProps,
	type ComponentPropsWithoutRef,
	type ReactNode,
} from "react"
import { createTextField } from "~/lib/textField"
import { classes } from "./classes"

export function TextFieldOutlined({
	children,

	...props
}: ComponentPropsWithoutRef<"label">) {
	return (
		<label
			{...props}
			className={classes("group mt-[.35rem] block", props.className)}
		>
			<div className="relative flex items-center justify-between">
				{children}
			</div>
		</label>
	)
}

export function TextFieldOutlinedSupporting(props: Ariakit.FormErrorProps) {
	return (
		<Ariakit.FormError
			{...props}
			className={classes(
				"order-last gap-4 px-4 pt-1 text-body-sm text-on-surface-variant group-has-[:disabled]:text-on-surface/[.38] group-error:text-error",
				props.className
			)}
		/>
	)
}

function OutlinedLabel({ children, ...props }: ComponentProps<"label">) {
	return (
		<>
			<label
				{...props}
				className="pointer-events-none absolute -top-2 left-4 text-body-sm text-on-surface-variant transition-all group-focus-within:text-primary group-hover:text-on-surface group-focus-within:group-hover:text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg group-focus-within:peer-placeholder-shown:-top-2 group-focus-within:peer-placeholder-shown:left-4 group-focus-within:peer-placeholder-shown:text-body-sm peer-disabled:text-on-surface/[.38] group-hover:peer-disabled:text-on-surface/[.38] group-has-[:required]:after:content-['*'] group-error:text-error group-error:group-focus-within:text-error group-focus-within:group-error:text-error group-hover:group-error:text-on-error-container group-hover:group-error:group-focus-within:text-error group-error:peer-disabled:text-on-surface/[.38] peer-disabled:group-error:text-on-surface/[.38]"
			>
				{children}
			</label>

			<fieldset className="pointer-events-none absolute -top-[0.71875rem] bottom-0 left-0 right-0 rounded-xs border border-outline px-[0.625rem] transition-all group-focus-within:border-2 group-focus-within:border-primary group-hover:border-on-surface group-hover:group-focus-within:border-primary group-has-[:disabled]:border-outline/[.12] group-hover:group-has-[:disabled]:border-outline/[.12] group-error:border-error group-focus-within:group-error:border-error group-hover:group-error:border-on-error-container group-focus-within:group-hover:group-error:border-error">
				<legend
					className={
						"overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0 group-focus-within:group-has-[:placeholder-shown]:max-w-none"
					}
				>
					<span className="px-1 text-body-sm group-has-[:required]:after:content-['*']">
						{children}
					</span>
				</legend>
			</fieldset>
		</>
	)
}

export const TextFieldOutlinedInput = forwardRef<
	HTMLInputElement,
	ComponentProps<"input">
>(function TextFieldOutlinedInput(props, ref) {
	const { input } = createTextField({ variant: "outlined" })
	return (
		<input
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
			<OutlinedLabel htmlFor={props.name}>{label}</OutlinedLabel>
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
				"group relative flex items-center overflow-hidden rounded-t-xs bg-surface-container-highest before:absolute before:bottom-0 before:left-0 before:w-full before:border-b before:border-on-surface-variant after:absolute after:bottom-0 after:left-0 after:w-full after:scale-x-0 after:border-b-2 after:border-primary after:transition-transform focus-within:after:scale-x-100 hover:state-hover hover:before:border-on-surface focus-within:hover:state-none has-[:disabled]:before:border-on-surface/[.38] hover:has-[:disabled]:before:border-on-surface/[.38] error:before:border-error error:after:border-error error:focus-within:after:scale-x-100 error:hover:before:border-on-error-container",
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
				"peer flex min-h-[3.5rem] min-w-0 flex-1 items-center bg-transparent px-4 pb-2 pt-6 text-body-lg text-on-surface placeholder-transparent caret-primary outline-none focus:ring-0 disabled:text-on-surface/[.38] group-error:caret-error",
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
				"group-hover:on-surface pointer-events-none absolute text-body-sm text-on-surface-variant text-on-surface/[.38] transition-all group-focus-within:text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg group-focus-within:peer-placeholder-shown:text-body-sm group-has-[:disabled]:peer-placeholder-shown:top-4 group-error:text-error group-error:group-hover:text-on-error-container group-error:group-hover:group-focus-within:text-error",
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

function LeadingIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={classes(
				"ms-3 h-5 w-5 text-on-surface-variant group-has-[:disabled]:text-on-surface/[.38]",
				props.className
			)}
		/>
	)
}

function TrailingIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={classes(
				"peer-disabled:text-on-surface/[.38]",
				"group-error:text-error group-error:group-hover:text-on-error-container group-error:group-hover:group-focus-within:text-error",
				"text-on-surface-variant",
				"me-3 i",
				props.className
			)}
		/>
	)
}

function Suffix(props: ComponentPropsWithoutRef<"span">) {
	return (
		<span
			{...props}
			className={classes(
				"suffix -ms-4 flex items-center py-4 pe-4 text-body-lg text-on-surface-variant",
				props.className
			)}
		/>
	)
}

function Prefix(props: ComponentPropsWithoutRef<"span">) {
	return (
		<span
			{...props}
			className="-me-5 flex items-center text-body-lg text-on-surface-variant"
		/>
	)
}

TextFieldOutlined.Prefix = Prefix
TextFieldOutlined.TrailingIcon = TrailingIcon
TextFieldOutlined.Suffix = Suffix
TextFieldOutlined.LeadingIcon = LeadingIcon
TextFieldOutlined.displayName = "TextField.Outlined"

TextFieldFilled.Prefix = Prefix
TextFieldFilled.TrailingIcon = TrailingIcon
TextFieldFilled.Suffix = function Suffix(
	props: ComponentPropsWithoutRef<"span">
) {
	return (
		<span
			{...props}
			className={classes(
				"-ms-4 flex items-center pb-2 pe-4 pt-6 text-body-lg text-on-surface-variant",
				props.className
			)}
		/>
	)
}
TextFieldFilled.LeadingIcon = LeadingIcon
TextFieldFilled.displayName = "TextField.Filled"
