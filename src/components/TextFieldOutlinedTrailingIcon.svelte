<script lang="ts">
	import type { Snippet } from "svelte"
	import { textField } from "~/lib/textField"
	const { children, ...props } = $props<{ children: Snippet; class?: string }>()

	const { trailingIcon } = textField()
</script>

<div {...props} class={trailingIcon({ class: props.class })}>
	{@render children()}
</div>
