// Import styles, initialize component theme here.
// import '../src/common.css';
import "../app/tailwind.css"

import { beforeMount } from "@playwright/experimental-ct-react/hooks"

import type { JSONObject } from "~/lib/urql.server"

export type Hooks = {} & JSONObject

beforeMount<Hooks>(async ({ App, hooksConfig }) => {
	return (
		<div className="theme-light bg-surface palette-[#6751a4] dark:theme-dark">
			<App />
		</div>
	)
})
