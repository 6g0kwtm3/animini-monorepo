import {
	Form,
	Link,
	useActionData,
	useNavigation,
	useParams,
	useSearchParams
} from "@remix-run/react"
import { Predicate } from "effect"
import type { ReactNode } from "react"
import { serverOnly$ } from "vite-env-only"
import type { FragmentType } from "~/lib/graphql"
import { graphql, readFragment } from "~/lib/graphql"
import type { clientLoader as rootLoader } from "~/root"
import type { clientAction as selectedAction } from "~/routes/_nav.user.$userName.$typelist._filters.($selected)"
import MaterialSymbolsAdd from "~icons/material-symbols/add"
import MaterialSymbolsMoreHoriz from "~icons/material-symbols/more-horiz"
import { M3 } from "../components"
import { useRawRouteLoaderData } from "../data"
import { avalible as getAvalible } from "../media/avalible"

const IncrementProgress_entry = serverOnly$(
	graphql(`
		fragment IncrementProgress_entry on MediaList {
			id
			progress
			...Progress_entry
			media {
				...Avalible_media
				type
				id
				episodes
				chapters
			}
		}
	`)
)

export function IncrementProgress(props: {
	entry: FragmentType<typeof IncrementProgress_entry>
}): ReactNode {
	const entry = readFragment<typeof IncrementProgress_entry>(props.entry)
	const avalible = getAvalible(entry.media)
	const data = useRawRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()
	const actionData = useActionData<typeof selectedAction>()
	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	const [search] = useSearchParams()

	search.set("sheet", String(entry.id))

	const episodes = entry.media?.episodes ?? entry.media?.chapters
	return (
		<div className="flex justify-end">
			{Predicate.isString(data?.Viewer?.name) &&
				data.Viewer.name === params.userName && (
					<Form className="hidden @md:block" method="post">
						<input type="hidden" name="progress" value={progress + 1} />
						<input type="hidden" name="id" value={entry.id} />
						<input type="hidden" name="intent" value="increment" />
						<M3.TooltipPlain>
							<M3.TooltipPlainTrigger render={<M3.Button type="submit" />}>
								<Progress entry={entry} />
								<M3.ButtonIcon>
									<MaterialSymbolsAdd />
								</M3.ButtonIcon>
							</M3.TooltipPlainTrigger>
							{avalible !== episodes && (
								<M3.TooltipPlainContainer>
									{!episodes ? (
										<>some more to release</>
									) : Predicate.isNumber(avalible) ? (
										<>{episodes - avalible} more to release</>
									) : (
										<>more to release</>
									)}
								</M3.TooltipPlainContainer>
							)}
						</M3.TooltipPlain>
					</Form>
				)}
			<M3.Icon render={<Link to={`?${search}`} />}>
				<MaterialSymbolsMoreHoriz />
			</M3.Icon>
		</div>
	)
}

const Progress_entry = serverOnly$(
	graphql(`
		fragment Progress_entry on MediaList {
			id
			progress
			media {
				...Avalible_media
				id
				episodes
				chapters
			}
		}
	`)
)

export function Progress(props: {
	entry: FragmentType<typeof Progress_entry>
}): ReactNode {
	const entry = readFragment<typeof Progress_entry>(props.entry)
	const avalible = getAvalible(entry.media)
	const actionData = useActionData<typeof selectedAction>()
	const navigation = useNavigation()

	const optimisticEntry =
		actionData?.SaveMediaListEntry ??
		Object.fromEntries(navigation.formData ?? new FormData())

	const progress =
		(Number(optimisticEntry.id) === entry.id
			? Number(optimisticEntry.progress)
			: entry.progress) ?? 0

	const episodes = entry.media?.episodes ?? entry.media?.chapters

	return (
		<span>
			{progress}
			{episodes === progress ? null : Predicate.isNumber(avalible) ? (
				<>
					/
					<span
						className={
							avalible !== episodes ? "underline decoration-dotted" : ""
						}
					>
						{avalible}
					</span>
				</>
			) : (
				`/${episodes ?? "-"}`
			)}
		</span>
	)
}
