/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

declare module "csstype" {
  interface Properties {
    [key: `--${string}`]: string | number
  }
}

export {}
