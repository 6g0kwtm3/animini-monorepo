const Slot = "button";
import React, { ComponentPropsWithoutRef, memo } from "react";

const classes = (...classes: (string | 0 | undefined | null)[]) => {
  return classes.filter(Boolean).join(" ");
};

export type Icon = React.FC<ComponentPropsWithoutRef<"div">>;

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
}

export interface Button extends React.FC<ButtonProps> {
  Icon: Icon;
}

export const Text: Button = ({
  asChild,

  ...props
}) => {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      {...props}
      className={classes(
        "relative flex items-center justify-center gap-2 overflow-hidden rounded-[1.25rem] text-label-lg text-primary surface state-primary min-w-[3rem] h-10 px-3 hover:state-hover focus:state-focus disabled:text-on-surface/[.38] disabled:state-none",
        props.className
      )}
    >
      {/* TODO: right padding +4px if icon */}
    </Component>
  );
};

Text.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("w-[1.125rem] h-[1.125rem]", props.className)}
    ></div>
  );
};

Text.displayName = "Button.Text";
Text.Icon.displayName = "Button.Text.Icon";

export const Tonal: Button = ({
  asChild,

  ...props
}) => {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      {...props}
      className={classes(
        "relative flex items-center justify-center gap-4 overflow-hidden rounded-[1.25rem] bg-secondary-container text-label-lg text-on-secondary-container surface state-on-secondary-container min-w-[3rem] h-10 px-6 hover:elevation-1 hover:state-hover focus:state-focus disabled:bg-on-surface/[.12] disabled:text-on-surface/[.38] disabled:state-none disabled:hover:elevation-0",

        props.className
      )}
    ></Component>
  );
};

Tonal.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("w-[1.125rem] h-[1.125rem] -mx-2", props.className)}
    ></div>
  );
};

Tonal.displayName = "Button.FilledTonal";
Tonal.Icon.displayName = "Button.FilledTonal.Icon";

export const Filled: Button = ({
  asChild,

  ...props
}) => {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      {...props}
      className={classes(
        "relative flex items-center justify-center gap-4 overflow-hidden rounded-[1.25rem] bg-primary text-label-lg text-on-primary surface state-on-primary min-w-[3rem] h-10 px-6 hover:state-hover focus:state-focus disabled:bg-on-surface/[.12] disabled:text-on-surface/[.38] disabled:state-none",

        props.className
      )}
    ></Component>
  );
};

Filled.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("w-[1.125rem] h-[1.125rem] -mx-2", props.className)}
    ></div>
  );
};

Filled.displayName = "Button.Filled";
Filled.Icon.displayName = "Button.Filled.Icon";

export const Elevated: Button = ({
  asChild,

  ...props
}) => {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      {...props}
      className={classes(
        "relative flex items-center justify-center gap-4 overflow-hidden rounded-[1.25rem] bg-surface text-label-lg text-primary shadow surface elevation-1 state-primary min-w-[3rem] h-10 px-6 hover:elevation-2 hover:state-hover focus:state-focus disabled:bg-on-surface/[.12] disabled:text-on-surface/[.38] disabled:shadow-none disabled:state-none disabled:hover:elevation-1",
        props.className
      )}
    ></Component>
  );
};

Elevated.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("w-[1.125rem] h-[1.125rem] -mx-2", props.className)}
    ></div>
  );
};

Elevated.displayName = "Button.Elevated";
Elevated.Icon.displayName = "Button.Elevated.Icon";

export const Outlined: Button = ({ asChild, ...props }) => {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      {...props}
      className={classes(
        "relative flex items-center justify-center gap-4 overflow-hidden rounded-[1.25rem] border border-outline text-label-lg text-primary surface state-primary min-w-[3rem]  h-10 px-6 hover:state-hover focus:border-primary focus:state-focus disabled:border-on-surface/[.12] disabled:text-on-surface/[.38] disabled:state-none",
        props.className
      )}
    ></Component>
  );
};

Outlined.Icon = (props) => {
  return (
    <div
      {...props}
      className={classes("w-[1.125rem] h-[1.125rem] -mx-2", props.className)}
    ></div>
  );
};

Outlined.displayName = "Button.Outlined";
Outlined.Icon.displayName = "Button.Outlined.Icon";

export default memo(Text);
