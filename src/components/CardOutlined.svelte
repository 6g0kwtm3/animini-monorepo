<script lang="ts">
	import type { Snippet } from "svelte"
	import { tv } from "tailwind-variants"

	const { children, ...props } = $props<{
		children: Snippet
		class?: string
	}>()

	const card = tv({
		base: "",
	})
</script>

<div {...props} class={card({ class: props.class })}>
	{@render children()}
</div>
