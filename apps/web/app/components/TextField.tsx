import * as Ariakit from "@ariakit/react"
import {
    forwardRef,
    use,
    type ComponentProps,
    type ComponentPropsWithoutRef,
    type JSX,
    type ReactNode,
} from "react"
import { createTextField } from "~/lib/textField"
import { classes } from "./classes"
import { Label } from "./Label"
import { LabelId } from "./LabelId.1"

export function TextFieldOutlined({
	children,

	...props
}: ComponentPropsWithoutRef<"label">): ReactNode {
	return (
		<Label
			{...props}
			className={classes("group mt-[.35rem] block", props.className)}
		>
			<div className="relative flex items-center justify-between">
				{children}
			</div>
		</Label>
	)
}

export function TextFieldOutlinedSupporting(
	props: Ariakit.FormErrorProps
): ReactNode {
	return (
		<Ariakit.FormError
			{...props}
			className={classes(
				"text-body-sm text-on-surface-variant group-has-disabled:text-on-surface/[.38] group-error:text-error order-last gap-4 px-4 pt-1",
				props.className
			)}
		/>
	)
}

function OutlinedLabel({ children, ...props }: ComponentProps<"label">) {
	return (
		<>
			<Label
				{...props}
				className="text-body-sm text-on-surface-variant group-focus-within:text-primary group-hover:text-on-surface group-hover:group-focus-within:text-primary peer-placeholder-shown:text-body-lg peer-placeholder-shown:group-focus-within:text-body-sm peer-disabled:text-on-surface/[.38] peer-disabled:group-hover:text-on-surface/[.38] group-error:text-error group-focus-within:group-error:text-error group-error:group-focus-within:text-error group-error:group-hover:text-on-error-container group-focus-within:group-error:group-hover:text-error peer-disabled:group-error:text-on-surface/[.38] group-error:peer-disabled:text-on-surface/[.38] group-has-required:after:content-['*'] pointer-events-none absolute -top-2 left-4 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:group-focus-within:-top-2 peer-placeholder-shown:group-focus-within:left-4"
			>
				{children}
			</Label>

			<fieldset className="border-outline group-focus-within:border-primary group-hover:border-on-surface group-focus-within:group-hover:border-primary group-has-disabled:border-outline/[.12] group-has-disabled:group-hover:border-outline/[.12] group-error:border-error group-error:group-focus-within:border-error group-error:group-hover:border-on-error-container group-error:group-hover:group-focus-within:border-error rounded-xs pointer-events-none absolute -top-[0.71875rem] bottom-0 left-0 right-0 border px-[0.625rem] transition-all group-focus-within:border-2">
				<legend
					className={
						"group-has-placeholder-shown:max-w-0 group-has-placeholder-shown:group-focus-within:max-w-none overflow-hidden whitespace-nowrap opacity-0 transition-all"
					}
				>
					<span className="text-body-sm group-has-required:after:content-['*'] px-1">
						{children}
					</span>
				</legend>
			</fieldset>
		</>
	)
}

export const TextFieldOutlinedInput = forwardRef<
	HTMLInputElement,
	Omit<ComponentProps<"input">, "id">
>(function TextFieldOutlinedInput(props, ref) {
	const { input } = createTextField({ variant: "outlined" })
	let id = use(LabelId)
	return (
		<input
			ref={ref}
			type="text"
			{...props}
			id={id}
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
}): ReactNode {
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
	props: ComponentPropsWithoutRef<typeof Label>
): JSX.Element {
	return (
		<Label
			{...props}
			className={classes(
				"bg-surface-container-highest before:border-on-surface-variant after:border-primary hover:state-hover hover:before:border-on-surface focus-within:hover:state-none has-disabled:before:border-on-surface/[.38] hover:has-disabled:before:border-on-surface/[.38] error:before:border-error error:after:border-error error:focus-within:after:scale-x-100 error:hover:before:border-on-error-container rounded-t-xs group relative flex items-center overflow-hidden before:absolute before:bottom-0 before:left-0 before:w-full before:border-b after:absolute after:bottom-0 after:left-0 after:w-full after:scale-x-0 after:border-b-2 after:transition-transform focus-within:after:scale-x-100",
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

export function TextFieldFilledInput(
	props: Omit<ComponentProps<"input">, "id">
): ReactNode {
	let id = use(LabelId)
	return (
		<input
			{...props}
			id={id}
			placeholder={props.placeholder || " "}
			className={classes(
				"text-body-lg text-on-surface caret-primary disabled:text-on-surface/[.38] group-error:caret-error outline-hidden peer flex min-h-[3.5rem] min-w-0 flex-1 items-center bg-transparent px-4 pb-2 pt-6 placeholder-transparent focus:ring-0",
				props.className
			)}
		/>
	)
}

export function TextFieldFilledLabel(
	props: ComponentProps<"label">
): ReactNode {
	return (
		<Label
			{...props}
			className={classes(
				"group-hover:on-surface text-body-sm text-on-surface-variant text-on-surface/[.38] group-focus-within:text-primary peer-placeholder-shown:text-body-lg peer-placeholder-shown:group-focus-within:text-body-sm group-error:text-error group-hover:group-error:text-on-error-container group-focus-within:group-hover:group-error:text-error peer-placeholder-shown:group-has-disabled:top-4 pointer-events-none absolute transition-all peer-placeholder-shown:top-4",
				// props.leading ? "left-12" :
				"left-4",
				"peer-placeholder-shown:group-focus-within:top-2",
				"top-2",
				props.className
			)}
		>
			{props.children}
		</Label>
	)
}

function LeadingIcon(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div
			{...props}
			className={classes(
				"text-on-surface-variant group-has-disabled:text-on-surface/[.38] ms-3 h-5 w-5",
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
				"group-error:text-error group-hover:group-error:text-on-error-container group-focus-within:group-hover:group-error:text-error",
				"text-on-surface-variant",
				"i me-3",
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
				"suffix text-body-lg text-on-surface-variant -ms-4 flex items-center py-4 pe-4",
				props.className
			)}
		/>
	)
}

function Prefix(props: ComponentPropsWithoutRef<"span">) {
	return (
		<span
			{...props}
			className="text-body-lg text-on-surface-variant -me-5 flex items-center"
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
				"text-body-lg text-on-surface-variant -ms-4 flex items-center pb-2 pe-4 pt-6",
				props.className
			)}
		/>
	)
}
TextFieldFilled.LeadingIcon = LeadingIcon
TextFieldFilled.displayName = "TextField.Filled"
