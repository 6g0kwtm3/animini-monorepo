<script lang="ts">
	import type { Snippet } from "svelte"
	import "../tailwind.css"

	const {children} = $props<{children:Snippet}>()
</script>

{@render children()}
