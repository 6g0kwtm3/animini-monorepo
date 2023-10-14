import { Slot } from "@radix-ui/react-slot"
import type {
  ComponentPropsWithoutRef
} from "react"
import type { WithChild } from "./Child"
const classes = (...classes: (string | 0 | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ")
}




export function TextFieldOutlined({
  children,

  ...props
}: ComponentPropsWithoutRef<"label">) {
  return (
    <label {...props} className={classes("group mt-[10px]", props.className)}>
      <div className="relative flex items-center">{children}</div>
    </label>
  )
}

export function TextFieldOutlinedSupporting(
  props: ComponentPropsWithoutRef<"p">
) {
  return (
    <p
      {...props}
      className={classes(
        "group-has-[:disabled]:text-on-surface/[.38] group-has-[:invalid]:text-error group-data-[error=true]:text-error text-on-surface-variant gap-4 text-body-sm px-4 pt-1 order-last",
        props.className
      )}
    ></p>
  )
}

function OutlinedLabel({ children }: ComponentPropsWithoutRef<"div">) {
  return (
    <>
      <div className="pointer-events-none absolute -top-2 left-4 text-body-sm text-on-surface-variant transition-all group-has-[:required]:after:content-['*'] group-hover:text-on-surface peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg  group-error:text-error  group-hover:group-error:text-on-error-container group-focus-within:text-primary group-focus-within:group-hover:text-primary group-focus-within:peer-placeholder-shown:-top-2 group-focus-within:peer-placeholder-shown:left-4 group-focus-within:peer-placeholder-shown:text-body-sm group-error:group-focus-within:text-error group-focus-within:group-error:text-error group-hover:group-error:group-focus-within:text-error peer-disabled:text-on-surface/[.38] group-hover:peer-disabled:text-on-surface/[.38] group-error:peer-disabled:text-on-surface/[.38] peer-disabled:group-error:text-on-surface/[.38]">
        {children}
      </div>

      <fieldset className="pointer-events-none absolute -top-[10px] left-0 right-0 bottom-0 rounded-xs border border-outline transition-all px-[0.625rem] group-focus-within:border-2 group-focus-within:border-primary group-hover:border-on-surface group-hover:group-focus-within:border-primary group-error:border-error group-focus-within:group-error:border-error group-hover:group-error:border-on-error-container group-focus-within:group-hover:group-error:border-error group-has-[:disabled]:border-outline/[.12] group-hover:group-has-[:disabled]:border-outline/[.12]">
        <legend
          className={
            "overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0 group-focus-within:group-has-[:placeholder-shown]:max-w-none"
          }
        >
          <span className="text-label-sm px-1 group-has-[:required]:after:content-['*']">
            {children}
          </span>
        </legend>
      </fieldset>
    </>
  )
}

export function TextFieldOutlinedInput({
  asChild,
  ...props
}: WithChild<Require<ComponentPropsWithoutRef<"input">, "name">>) {
  const Component = asChild ? Slot : "input"
  return (
    <>
      <Component
        type="text"
        {...props}
        placeholder=" "
        className={classes(
          "peer resize-none appearance-none items-center bg-transparent text-body-lg text-on-surface placeholder-transparent caret-primary outline-none min-w-0 flex-1 p-4 placeholder:transition-all group-error:caret-error focus:placeholder-on-surface-variant focus:ring-0 disabled:text-on-surface/[.38]",
          props.className
        )}
      />
    </>
  )
}

TextFieldOutlined.Label = OutlinedLabel

type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export function TextFieldFilled(props: ComponentPropsWithoutRef<"label">) {
  return (
    <label
      {...props}
      className={classes(
        "has-[:disabled]:before:border-on-surface/[.38] hover:has-[:disabled]:before:border-on-surface/[.38] error:before:border-error error:after:border-error error:focus-within:after:scale-x-100 error:hover:before:border-on-error-container before:border-on-surface-variant after:border-primary focus-within:after:scale-x-100 hover:before:border-on-surface hover:state-hover group relative flex items-center bg-surface-container-highest overflow-hidden rounded-t-xs surface state-on-surface before:absolute before:left-0 before:bottom-0 before:border-b before:w-full after:absolute after:left-0 after:bottom-0 after:scale-x-0 after:border-b-2 after:transition-transform after:w-full focus-within:hover:state-none",
        props.className
      )}
    ></label>

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

export function TextFieldFilledInput(props: ComponentPropsWithoutRef<"input">) {
  return (
    <input
      {...props}
      placeholder=" "
      className={classes(
        "peer disabled:text-on-surface/[.38] flex flex-1 group-error:caret-error text-on-surface caret-primary appearance-none items-center bg-transparent text-body-lg placeholder-transparent outline-none min-w-0 min-h-[3.5rem] px-4 pt-6 pb-2 focus:ring-0",
        props.className
      )}
    />
  )
}

export function TextFieldFilledLabel(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={classes(
        "text-on-surface/[.38] group-error:text-error group-error:group-hover:text-on-error-container group-error:group-hover:group-focus-within:text-error group-hover:on-surface text-on-surface-variant group-focus-within:text-primary group-focus-within:peer-placeholder-shown:text-body-sm pointer-events-none absolute text-body-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg",
        props.leading ? "left-12" : "left-4",
        !props.disabled && "group-focus-within:peer-placeholder-shown:top-2",
        "top-2",
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

function LeadingIcon(props: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={classes(
        "group-has-[:disabled]:text-on-surface/[.38] text-on-surface-variant w-5 h-5 ml-3",
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
        "group-error:text-error group-error:group-hover:text-on-error-container group-hover:group-focus-within:text-error",
        "text-on-surface-variant",
        "w-6 h-6 mr-3",
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
        "flex items-center text-body-lg text-on-surface-variant -ml-4 py-4 pr-4",
        props.className
      )}
    ></span>
  )
}

function Prefix(props: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className="flex items-center text-body-lg text-on-surface-variant -mr-5"
    ></span>
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
        "flex items-center text-body-lg text-on-surface-variant -ml-4 pt-6 pb-2 pr-4",
        props.className
      )}
    ></span>
  )
}
TextFieldFilled.LeadingIcon = LeadingIcon
TextFieldFilled.displayName = "TextField.Filled"

export default TextFieldOutlined
