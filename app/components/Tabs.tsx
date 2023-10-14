import { Predicate } from "effect";
import { motion } from "framer-motion";
import { Link } from "lucide-react";
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react";
import { createContext, useContext, useId } from "react";

const TabsContext = createContext<string | undefined>(undefined)


export function Tabs (props: PropsWithChildren<{}>)  {
  return (
    <TabsContext.Provider value={useId()}>
      <div className="bg-surface overflow-x-auto">{props.children}</div>
    </TabsContext.Provider>
  )
}

export function TabsTab (
  props: PropsWithChildren<{
    active: boolean
    to: ComponentPropsWithoutRef<typeof Link>["to"]
  }>
)  {
  const layoutId = useContext(TabsContext)
  return (
    <Link
      to={props.to}
      className={`${
        props.active
          ? "state-primary text-primary"
          : "hover:text-on-surface focus:text-on-surface text-on-surface-variant state-on-surface"
      } px-4 surface text-title-sm focus:state-focus hover:state-hover justify-center flex`}
    >
      <div
        className={`${
          props.active ? "" : ""
        } h-12 whitespace-nowrap relative flex items-center`}
      >
        {props.children}
        {props.active && (
          <motion.div
            {...(Predicate.isString(layoutId) ? { layoutId } : {})}
            className="h-[0.1875rem] absolute bottom-0 left-0 right-0 bg-primary rounded-t-[0.1875rem]"
          ></motion.div>
        )}
      </div>
    </Link>
  )
}