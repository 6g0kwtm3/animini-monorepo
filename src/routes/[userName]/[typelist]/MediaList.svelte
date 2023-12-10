<script lang="ts">
	import { page } from "$app/stores"
	import { Function, Order, ReadonlyArray, pipe } from "effect"
	import { graphql, useFragment, type FragmentType } from "~/gql"
	import { MediaStatus } from "~/gql/graphql"
	import { nonNull } from "~/lib/urql"
	import ListItem from "./ListItem.svelte"
	import { formatWatch, toWatch } from "~/lib/entry"
	const MediaList_group = graphql(`
		fragment MediaList_group on MediaListGroup {
			name
			entries {
				id
				...ListItem_entry
				media {
					id
					status
				}
			}
		}
	`)

	const OPTIONS = {
		[MediaStatus.Finished]: "Finished",
		[MediaStatus.Releasing]: "Releasing",
		[MediaStatus.NotYetReleased]: "Not Yet Released",
		[MediaStatus.Cancelled]: "Cancelled",
	}

	const { ...props } = $props<{ group: FragmentType<typeof MediaList_group> }>()

	const group = $derived(useFragment(MediaList_group, props.group))

	const status = $derived(
		Object.entries(OPTIONS).find(
			([, value]) => value === $page.url.searchParams.get("status"),
		)?.[0],
	)

	let entries = $derived(
		pipe(
			group?.entries?.filter(nonNull) ?? [],
			status
				? (entries) =>
						entries.filter((entry) => entry?.media?.status === status)
				: Function.identity,
			ReadonlyArray.sortBy(
				// Order.mapInput(Order.number, (entry) => behind(entry)),
				Order.mapInput(Order.number, (entry: any) => toWatch(entry)),
				Order.mapInput(Order.number, (entry: any) => {
					const status = entry?.media?.status
					return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
						status,
					)
				}),
			),
		),
	)
</script>

<article class={""}>
	<h2 class="mx-4 flex flex-wrap justify-between text-display-md">
		<div>{$page.url.searchParams.get("selected")}</div>
		<div class="">
			{formatWatch(
				entries
					?.map(toWatch)
					.filter(isFinite)
					.reduce((a, b) => a + b, 0) ?? 0,
			)}
		</div>
	</h2>
	<div class="py-2">
		<ol>
			{#each entries as entry (entry.id)}
				<li>
					<ListItem {entry}></ListItem>
				</li>
			{/each}
		</ol>
	</div>

	<!--  <ol class="flex justify-center gap-2">
		<li>
			<Link
				to={
					pageNumber > 1
						? `?page=${pageNumber - 1}&${deleteSearchParam(
								searchParams,
								"page",
							)}`
						: `?${searchParams}`
				}
				class={btn()}
				aria-disabled={!(pageNumber > 1)}
			>
				<div>Prev</div>
			</Link>
		</li>
		<li>
			<Form action="get">
				<input
					type="hidden"
					name="selected"
					defaultValue={searchParams.get("selected") ?? undefined}
				/>
				<label htmlFor="" class="p-1">
					<input
						name="page"
						type="text"
						class="box-content h-[2ch] w-[2ch]"
						defaultValue={pageNumber}
					/>
				</label>
			</Form>
		</li>
		<li>
			<Link
				to={
					page?.pageInfo?.hasNextPage
						? `?page=${Number(pageNumber) + 1}&${deleteSearchParam(
								searchParams,
								"page",
							)}`
						: `?${searchParams}`
				}
				class={btn()}
				aria-disabled={!page?.pageInfo?.hasNextPage}
			>
				<div>Next</div>
			</Link>
		</li>
	</ol>  -->
</article>
