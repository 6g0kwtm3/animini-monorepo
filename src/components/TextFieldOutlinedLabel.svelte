<script lang="ts">
	import type { Snippet } from "svelte"

	const { children } = $props<{ children: Snippet }>()
</script>

<div
	class="pointer-events-none absolute -top-2 left-4 text-body-sm text-on-surface-variant transition-all group-focus-within:text-primary group-hover:text-on-surface group-focus-within:group-hover:text-primary peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg group-focus-within:peer-placeholder-shown:-top-2 group-focus-within:peer-placeholder-shown:left-4 group-focus-within:peer-placeholder-shown:text-body-sm peer-disabled:text-on-surface/[.38] group-hover:peer-disabled:text-on-surface/[.38] group-has-[:required]:after:content-['*'] group-error:text-error group-error:group-focus-within:text-error group-focus-within:group-error:text-error group-hover:group-error:text-on-error-container group-hover:group-error:group-focus-within:text-error group-error:peer-disabled:text-on-surface/[.38] peer-disabled:group-error:text-on-surface/[.38]"
>
	{@render children()}
</div>

<fieldset
	class="pointer-events-none absolute -top-[10px] bottom-0 left-0 right-0 rounded-xs border border-outline px-[0.625rem] transition-all group-focus-within:border-2 group-focus-within:border-primary group-hover:border-on-surface group-hover:group-focus-within:border-primary group-has-[:disabled]:border-outline/[.12] group-hover:group-has-[:disabled]:border-outline/[.12] group-error:border-error group-focus-within:group-error:border-error group-hover:group-error:border-on-error-container group-focus-within:group-hover:group-error:border-error"
>
	<legend
		class={"overflow-hidden whitespace-nowrap opacity-0 transition-all group-has-[:placeholder-shown]:max-w-0 group-focus-within:group-has-[:placeholder-shown]:max-w-none"}
	>
		<span class="px-1 text-label-sm group-has-[:required]:after:content-['*']">
			{@render children()}
		</span>
	</legend>
</fieldset>
