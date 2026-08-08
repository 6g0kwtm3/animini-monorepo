import * as TanstackVirtual from "@tanstack/react-virtual";
import { useDeferredValue } from "react";

export function useWindowVirtualizer<TItemElement extends Element>(
  options: TanstackVirtual.PartialKeys<
    TanstackVirtual.ReactVirtualizerOptions<Window, TItemElement>,
    | "getScrollElement"
    | "observeElementOffset"
    | "observeElementRect"
    | "scrollToFn"
  >,
) {
  "use no memo";
  const virtualizer = TanstackVirtual.useWindowVirtualizer(options);

  return {
    virtualItems: useDeferredValue(virtualizer.getVirtualItems()),
    totalSize: virtualizer.getTotalSize(),
    options: virtualizer.options,
    measureElement: virtualizer.measureElement,
    containerRef: virtualizer.containerRef,
  };
}
