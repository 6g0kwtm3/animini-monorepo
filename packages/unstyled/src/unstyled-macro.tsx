import type { MacroContext } from "unplugin-macros"
import { numberToString } from "utilities"
import { hex, sha256 } from "./unstyled-use-styles"
import { Var } from "./unstyled-vars"

export function createVar<T extends number | string>(
	name?: `--var-${string}`
): Var<T> {
	const thing = sha256()
	thing.add(numberToString(Math.random()))

	return new Var<T>(name ?? `--var-${hex(thing.digest())}`)
}
