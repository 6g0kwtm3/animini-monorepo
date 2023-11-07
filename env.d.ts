/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module "csstype" {
  interface Props {
    [key: `--${string}`]: string | number
  }
}

export {}
