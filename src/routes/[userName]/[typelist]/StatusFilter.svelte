<script lang="ts">
	import { page } from "$app/stores"
	import SearchParams from "~/components/SearchParams.svelte"
	import Select from "~/components/Select.svelte"
	import { MediaStatus } from "~/gql/graphql"
	import { btn } from "~/lib/button"

	const OPTIONS = {
		[MediaStatus.Finished]: "Finished",
		[MediaStatus.Releasing]: "Releasing",
		[MediaStatus.NotYetReleased]: "Not Yet Released",
		[MediaStatus.Cancelled]: "Cancelled",
	}
</script>

<form>
	<SearchParams except={["status"]} />
	<Select
		name="status"
		defaultValue={$page.url.searchParams.get("status") ?? "Any"}
		options={["Any", ...Object.values(OPTIONS)]}
	>
		Status
		{#snippet option(value)}
			{value}
		{/snippet}
	</Select>
	<button type="submit" class={btn()}>Filter</button>
</form>
