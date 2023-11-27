<script lang="ts">
	import type { Snippet } from "svelte"
	import { textField } from "~/lib/textField"
	const { children, ...props } = $props<{ children: Snippet; class?: string }>()

	const { root } = textField()
</script>

<label {...props} class={root({ class: props.class })}>
	{@render children()}
</label>
