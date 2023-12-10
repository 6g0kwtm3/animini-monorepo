<script lang="ts">
	import { page } from "$app/stores"
	import { Order } from "effect"
	import CardOutlined from "~/components/CardOutlined.svelte"
	import { pane } from "~/lib/pane"
	import { nonNull } from "~/lib/urql"
	import StatusFilter from "./StatusFilter.svelte"
	import { btn } from "~/lib/button"

	let { data } = $props()

	const TypelistQuery = $derived(data.TypelistQuery)

	const allLists = $derived(
		$TypelistQuery?.MediaListCollection?.lists
			?.filter(nonNull)
			.sort(
				Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
			) ?? [],
	)

	let selected = $derived($page.url.searchParams.get("selected"))

	let lists = $derived(
		(() => {
			if (!selected) {
				return allLists
			}
			return allLists?.filter((list) => list.name === selected)
		})(),
	)

	import MediaList from "./MediaList.svelte"
</script>

<div class={pane({ class: "?max-h-screen flex flex-col overflow-hidden" })}>
	<main class="grid grid-cols-12 md:gap-6">
		<div
			class="col-span-full hidden last:block max-md:last:flex-1 md:col-span-4 md:block"
		>
			<CardOutlined>
				<aside>
					<nav>
						<ul>
							<li></li>
						</ul>
					</nav>
				</aside>
			</CardOutlined>
		</div>

		<div
			class="col-span-full hidden last:block max-md:last:flex-1 md:col-span-8 md:block"
		>
			<StatusFilter></StatusFilter>

			<ul
				class="flex gap-2 overflow-x-auto overscroll-contain [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center"
			>
				{#each allLists as list (list.name)}
					<li class="min-w-max">
						<a
							href="?selected={list.name}"
							class={btn({
								variant: "tonal",
								class: `${
									selected === list.name ? `!bg-tertiary-container ` : ``
								}!rounded capitalize`,
							})}
						>
							{list.name}
						</a>
					</li>
				{/each}
			</ul>

			{#each lists as list (list.name)}
				<MediaList group={list}></MediaList>
			{/each}
		</div>
	</main>
</div>
