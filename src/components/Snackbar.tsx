import { Predicate } from "effect"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react"
import { BaseButton, type InvokeEvent } from "./Button"

type OnBeforeToggle = (this: HTMLElement, e: ToggleEvent) => void

const SnackbarQueueContext = createContext<OnBeforeToggle>(() => {
  console.warn("Snackbar is outside of SnackbarQueue")
})

export function SnackbarQueue(props: PropsWithChildren<{}>) {
  const [queue, setQueue] = useState<HTMLElement[]>([])

  const add = useCallback<OnBeforeToggle>(
    function (e) {
      const state = queue.at(0) === this ? "open" : "closed"

      if (state === "closed" && e.newState === "open") {
        e.preventDefault()

        setQueue((queue) => (queue.includes(this) ? queue : [...queue, this]))
        return
      }

      if (e.newState === "closed") {
        setQueue((queue) =>
          queue.includes(this) ? queue.filter((f) => f !== this) : queue,
        )
        return
      }

      return
    },
    [queue],
  )

  useEffect(() => {
    for (const el of queue) {
      el.showPopover()

      const timeout = Number(el.dataset["timeout"])

      if (!isFinite(timeout)) {
        return
      }

      const timeoutId = setTimeout(() => {
        el.hidePopover()
      }, timeout)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [queue])

  return (
    <SnackbarQueueContext.Provider value={add}>
      {props.children}
    </SnackbarQueueContext.Provider>
  )
}

const SnackbarContext = createContext<string | undefined>(undefined)

export function Snackbar({
  timeout,
  open,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  timeout?: number
  open: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const onBeforeToggle = useContext(SnackbarQueueContext)

  useEffect(() => {
    if (open) {
      ref.current?.showPopover()
    } else {
      ref.current?.hidePopover()
    }
  }, [open])

  useEffect(() => {
    const { current } = ref
    if (!current) {
      return
    }
    function onInvoke(this: HTMLElement, e: InvokeEvent) {
      if (
        (e.action === "show" || e.action === "auto") &&
        !this.matches(":popover-open")
      ) {
        this.showPopover()
        return
      }

      if (
        (e.action === "hide" || e.action === "auto") &&
        this.matches(":popover-open")
      ) {
        this.hidePopover()
      }
    }
    current.addEventListener("invoke", onInvoke)

    return () => current.removeEventListener("invoke", onInvoke)
  }, [])

  useEffect(() => {
    const { current } = ref
    if (!current) {
      return
    }

    current.addEventListener("beforetoggle", onBeforeToggle)
    return () => current.removeEventListener("beforetoggle", onBeforeToggle)
  }, [onBeforeToggle])

  const id = useId()

  useEffect(() => {
    if (!Predicate.isNumber(timeout)) {
      return
    }
    if (4000 <= timeout && timeout <= 10000) {
      return
    }
    console.warn(`Recommeneded <Snackbar /> timeout is between 4s and 10s`)
  }, [timeout])

  return (
    <SnackbarContext.Provider value={props.id ?? id}>
      <div
        {...props}
        id={props.id ?? id}
        role="alert"
        aria-live="assertive"
        popover="manual"
        {...(Predicate.isNumber(timeout) ? { "data-timeout": timeout } : {})}
        ref={ref}
        className="mb-7 line-clamp-2 hidden min-h-[3rem] max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 rounded-xs bg-inverse-surface p-4 text-body-md text-inverse-on-surface surface elevation-3 [&:popover-open]:flex"
      ></div>
    </SnackbarContext.Provider>
  )
}

export function SnackbarAction(props: ComponentPropsWithoutRef<"button">) {
  const invoketarget = useContext(SnackbarContext)

  const [supportsPopover, setSupportsPopover] = useState(true)

  useEffect(() => {
    setSupportsPopover(HTMLElement.prototype.hasOwnProperty("popover"))
  }, [])

  return (
    <BaseButton
      type="button"
      {...props}
      {...(supportsPopover
        ? {
            popovertargetaction: "hide",
            ...(Predicate.isString(invoketarget)
              ? { popovertarget: invoketarget }
              : {}),
          }
        : {
            invokeaction: "hide",
            ...(Predicate.isString(invoketarget) ? { invoketarget } : {}),
          })}
      className="-my-1 -me-2 rounded-[1.25rem] px-3 py-1 text-label-lg text-inverse-primary surface state-inverse-primary first:ms-auto hover:state-hover focus:state-focus"
    ></BaseButton>
  )
}
