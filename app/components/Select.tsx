import * as Ariakit from "@ariakit/react"
import { Predicate } from "effect"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { menu } from "~/lib/menu"
import { textField } from "~/lib/textField"
import { TextFieldOutlined } from "./TextField"

// const onClient = Promise.resolve(null)
import { ClientOnly } from "remix-utils/client-only"

const { input } = textField({})
const { root, item } = menu()

export function Select({
  children,
  options,
  defaultValue,
 
  ...props
}: ComponentPropsWithoutRef<typeof Ariakit.Select> & {
  options: string[]
  children?: ReactNode
}) {
  return (
    <ClientOnly
      fallback={
        <TextFieldOutlined>
          <select className={input({ className: "appearance-none" })}>
            {options.map((value) => {
              return (
                <option
                  key={value}
                  value={value}
                  className="bg-surface-container text-label-lg text-on-surface surface elevation-2"
                >
                  {value}
                </option>
              )
            })}
          </select>
          <TextFieldOutlined.Label>{children}</TextFieldOutlined.Label>
          <TextFieldOutlined.TrailingIcon className="pointer-events-none absolute right-0">
            expand_more
          </TextFieldOutlined.TrailingIcon>
        </TextFieldOutlined>
      }
    >
      {() => (
        <Ariakit.SelectProvider
          {...(Predicate.isString(defaultValue) || Array.isArray(defaultValue)
            ? { defaultValue }
            : {})}
        >
          <TextFieldOutlined>
            <Ariakit.SelectLabel className="sr-only">
              {children}
            </Ariakit.SelectLabel>
            <Ariakit.Select
              className={input({ className: "cursor-default" })}
              {...props}
            />
            <TextFieldOutlined.Label>{children}</TextFieldOutlined.Label>
            <Ariakit.SelectPopover
              sameWidth
              className={root({
                className:
                  "z-10 max-h-[min(var(--popover-available-height,300px),300px)]",
              })}
            >
              {options.map((value) => (
                <Ariakit.SelectItem
                  className={item({
                    className: "data-[active-item]:state-focus",
                  })}
                  value={value}
                  key={value}
                />
              ))}
            </Ariakit.SelectPopover>
          </TextFieldOutlined>
        </Ariakit.SelectProvider>
      )}
    </ClientOnly>
  )
}
