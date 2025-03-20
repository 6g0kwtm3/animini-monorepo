import { Form, useLocation, useNavigate, useSubmit } from "react-router"

import type { ReactNode } from "react"
import { SheetBody } from "~/components/Sheet"
import { TabsList, TabsListItem } from "~/components/Tabs"

import { M3 } from "~/lib/components"

import { useOptimisticSearchParams } from "~/lib/search/useOptimisticSearchParams"
import type { Route } from "./+types/route"
import { SheetFilter } from "./SheetFilter"
import { SheetSort } from "./SheetSort"

export function Sheet(props: Route.ComponentProps): ReactNode {
	let { pathname } = useLocation()

	const navigate = useNavigate()
	const searchParams = useOptimisticSearchParams()
	const submit = useSubmit()

	const sheet = searchParams.get("sheet")
	const filter = sheet === "filter"
	const sort = sheet === "sort"

	const filterParams = searchParams.set("sheet", "filter")

	const sortParams = searchParams.set("sheet", "sort")

	return (
		<M3.Sheet
			variant={{
				initial: "bottom",
				xl: "side",
			}}
			open={filter || sort}
			onClose={() => {
				void navigate({
					search: `?${searchParams.delete("sheet")}`,
				})
			}}
		>
			<M3.Tabs selectedId={sheet}>
				<TabsList grow className="">
					<TabsListItem
						id="filter"
						className="rounded-ss-xl"
						render={<M3.Link to={`?${filterParams}`} />}
					>
						Filter
					</TabsListItem>
					<TabsListItem
						id="sort"
						className="rounded-se-xl xl:rounded-none"
						render={<M3.Link to={`?${sortParams}`} />}
					>
						Sort
					</TabsListItem>
				</TabsList>

				<SheetBody>
					<Form
						replace
						action={pathname}
						onChange={(e) => void submit(e.currentTarget, {})}
					>
						{sheet && <input type="hidden" name="sheet" value={sheet} />}
						<M3.TabsPanel tabId={sheet}>
							{filter && <SheetFilter {...props} />}
							{sort && <SheetSort {...props} />}
						</M3.TabsPanel>
					</Form>
				</SheetBody>
			</M3.Tabs>
		</M3.Sheet>
	)
}
