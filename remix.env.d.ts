/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />
declare module "csstype" {
  interface Properties {
    [key: `--${string}`]: string | number
  }
}

export { }

