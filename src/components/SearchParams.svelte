<script lang="ts">
	import { page } from "$app/stores"

	let { except = [] } = $props<{ except?: string[] }>()
</script>

{#each $page.url.searchParams as [key, value]}
	{#if !except.includes(key)}
		<input type="hidden" name={key} {value} />
	{/if}
{/each}
