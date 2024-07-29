import {
	Form,
	Link,
	useLocation,
	useNavigate,
	useSubmit,
} from "@remix-run/react"

import type { ReactNode } from "react"
import { SheetBody } from "~/components/Sheet"
import { TabsList, TabsListItem } from "~/components/Tabs"

import { M3 } from "~/lib/components"

import { copySearchParams } from "~/lib/copySearchParams"

import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"
import { SheetFilter } from "./SheetFilter"
import { SheetSort } from "./SheetSort"

export function Sheet(): ReactNode {
	let { pathname } = useLocation()

	const navigate = useNavigate()
	const searchParams = useOptimisticSearchParams()
	const submit = useSubmit()

	const sheet = searchParams.get("sheet")
	const filter = sheet === "filter"
	const sort = sheet === "sort"
	searchParams.delete("sheet")

	const filterParams = copySearchParams(searchParams)
	filterParams.set("sheet", "filter")

	const sortParams = copySearchParams(searchParams)
	sortParams.set("sheet", "sort")

	return (
		<M3.Sheet
			open={filter || sort}
			onClose={() => {
				navigate({
					search: `?${searchParams}`,
				})
			}}
		>
			<Form
				replace
				action={pathname}
				onChange={(e) => submit(e.currentTarget, {})}
			>
				{sheet && <input type="hidden" name="sheet" value={sheet} />}
				<M3.Tabs selectedId={sheet}>
					<TabsList
						grow
						className="sticky top-0 z-10 rounded-t-xl bg-surface-container-low"
					>
						<TabsListItem
							id="filter"
							render={<Link unstable_viewTransition to={`?${filterParams}`} />}
						>
							Filter
						</TabsListItem>
						<TabsListItem
							id="sort"
							render={<Link unstable_viewTransition to={`?${sortParams}`} />}
						>
							Sort
						</TabsListItem>
					</TabsList>

					<M3.TabsPanel tabId={sheet}>
						<SheetBody>
							{filter && <SheetFilter />}
							{sort && <SheetSort />}
						</SheetBody>
					</M3.TabsPanel>
				</M3.Tabs>
			</Form>
		</M3.Sheet>
	)
}
