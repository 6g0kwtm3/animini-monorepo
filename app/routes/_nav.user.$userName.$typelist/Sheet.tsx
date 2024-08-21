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
			variant={{
				initial: "bottom",
				xl: "side",
			}}
			open={filter || sort}
			onClose={() => {
				navigate({
					search: `?${searchParams}`,
				})
			}}
		>
			<M3.Tabs selectedId={`sheet/${sheet}`}>
				<TabsList grow className="">
					<TabsListItem
						id="sheet/filter"
						className="rounded-ss-xl"
						render={<Link unstable_viewTransition to={`?${filterParams}`} />}
					>
						Filter
					</TabsListItem>
					<TabsListItem
						id="sheet/sort"
						className="rounded-se-xl xl:rounded-none"
						render={<Link unstable_viewTransition to={`?${sortParams}`} />}
					>
						Sort
					</TabsListItem>
				</TabsList>

				<SheetBody>
					<Form
						replace
						action={pathname}
						onChange={(e) => submit(e.currentTarget, {})}
					>
						{sheet && <input type="hidden" name="sheet" value={sheet} />}
						<M3.TabsPanel tabId={sheet}>
							{filter && <SheetFilter />}
							{sort && <SheetSort />}
						</M3.TabsPanel>
					</Form>
				</SheetBody>
			</M3.Tabs>
		</M3.Sheet>
	)
}
