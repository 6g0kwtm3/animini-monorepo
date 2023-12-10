import { tv } from "tailwind-variants";

export const textField = tv({
  slots: {
    input: "",
    root: "",
  },
  variants: {
    variant: {
      outlined: {
        input:
          "peer flex justify-between min-w-0 flex-1 resize-none items-center bg-transparent p-4 text-body-lg text-on-surface placeholder-transparent caret-primary outline-none placeholder:transition-all focus:placeholder-on-surface-variant focus:ring-0 disabled:text-on-surface/[.38] group-error:caret-error",
        root: "group relative mt-[10px] flex items-center",
      },
    },
  },
  defaultVariants: {
    variant: "outlined",
  },
})