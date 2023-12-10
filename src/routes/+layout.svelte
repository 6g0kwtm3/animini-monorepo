<script lang="ts">
	import { onMount, type Snippet } from "svelte"
	import "../tailwind.css"
	import { invalidateAll } from "$app/navigation"

	const TIMEOUT = 5 * 60 * 1000
	let timeout = Date.now()

	const listener = async () => {
		if (timeout + TIMEOUT - Date.now() > 0) {
			return
		}
		timeout = Date.now()

		invalidateAll()
	}

	onMount(() => {
		window.addEventListener("focus", listener)
		return () => window.removeEventListener("focus", listener)
	})
	// invalidateAll()

	// const { children } = $props<{ children: Snippet }>()
</script>

<!-- {@render children()} -->

<slot />
