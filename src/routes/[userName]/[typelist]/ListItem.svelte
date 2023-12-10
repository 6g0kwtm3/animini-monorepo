<script lang="ts">
	import { graphql, useFragment, type FragmentType } from "~/gql"
	import { PAGES_media_mediaId } from "~/lib/ROUTES"
	import { btnIcon } from "~/lib/button"
	import { behind, formatWatch, toWatch } from "~/lib/entry"

	const ListItem_entry = graphql(`
		fragment ListItem_entry on MediaList {
			...ToWatch_entry
			...Behind_entry
			score
			progress
			media {
				id
				title {
					userPreferred
				}
				coverImage {
					extraLarge
					medium
				}
				episodes
			}
		}
	`)

	const { ...props } = $props<{ entry: FragmentType<typeof ListItem_entry> }>()

	const entry = $derived(useFragment(ListItem_entry, props.entry))

	const { content, root } = btnIcon()

	import type { Action } from "svelte/action"
	import { spring } from "svelte/motion"
	import { get, writable, type Writable } from "svelte/store"

	interface DragOptions {
		drag?: "x" | "y"
		dragConstraints?: {
			left?: number
			right?: number
			top?: number
			bottom?: number
		}
		store?: Writable<{ x: number; y: number }>
	}

	const drag: Action<HTMLElement, DragOptions> = (node, options) => {
		let dragging = false
		let offset = { x: 0, y: 0 }
		let startingPosition = { x: 0, y: 0 }

		let position = spring(startingPosition, {
			// stiffness: 0.2,
			// damping: 0.4,
		})

		function handleDragStart(event: MouseEvent) {
			dragging = true
			offset = {
				x: event.clientX - get(position).x,
				y: event.clientY - get(position).y,
			}
		}

		function handleDrag(event: MouseEvent) {
			if (dragging) {
				position.set(
					{
						x: event.clientX - offset.x,
						y: event.clientY - offset.y,
					},
					{ hard: true },
				)
			}
		}

		function handleDragEnd() {
			dragging = false

			const x = options.drag === "y" ? 0 : get(position).x

			if (x > node.getBoundingClientRect().width / 2) {
				position
					.set(
						{ ...startingPosition, x: node.getBoundingClientRect().width },
						{},
					)
					.then(() => {
						position.set(startingPosition, {})
					})

				return
			}

			if (x < -node.getBoundingClientRect().width / 2) {
				position
					.set(
						{ ...startingPosition, x: -node.getBoundingClientRect().width },
						{},
					)
					.then(() => {
						position.set(startingPosition, {})
					})
				return
			}

			position.set(startingPosition, {})
		}

		node.addEventListener("pointerdown", handleDragStart)
		document.addEventListener("pointerup", handleDragEnd)
		document.addEventListener("pointermove", handleDrag)

		node.draggable = false
		node.style.touchAction = "pan-y"
		node.style.userSelect = "none"

		const unsubscribe = position.subscribe(($position) => {
			const x = options.drag === "y" ? 0 : $position.x
			const y = options.drag === "x" ? 0 : $position.y
			node.style.transform = `translateX(${x}px) translateY(${y}px)`
			node.dataset["dragLeft"] = String(x < 0)
			node.dataset["dragRight"] = String(x > 0)
			options.store?.set($position)
		})

		return {
			update(options_) {
				options = options_
			},
			destroy() {
				unsubscribe()
				node.removeEventListener("pointerdown", handleDragStart)
				document.removeEventListener("pointerup", handleDragEnd)
				document.removeEventListener("pointermove", handleDrag)
			},
		}
	}

	let position = writable({ x: 0, y: 0 })
	let ref = $state<HTMLElement>()
	let w = $state(Infinity)

	$effect(() => {
		w = ref.getBoundingClientRect().width
	})
</script>

<div class="relative" style="">
	<div
		bind:this={ref}
		class="absolute inset-0 overflow-hidden py-3 text-on-tertiary-container"
		style="
		--x: {+$position.x}px;
		--circle-color: rgb(var(--tertiary-container));
		--left: calc(var(--x) - 4.5rem);
		--circle-size: calc((var(--x) - 45%) * 2);
		background-image: radial-gradient(circle at calc(var(--left) + 1.75rem), var(--circle-color) 0%, var(--circle-color) var(--circle-size), var(--circle-color) var(--circle-size), rgb(var(--surface)) var(--circle-size), rgb(var(--surface)) calc(var(--circle-size) + 1%))"
	>
		<div class="relative left-[--left] h-14 w-14">
			<div class="i p-1 i-12">add</div>
		</div>
	</div>

	<div
		use:drag={{
			drag: "x",
			store: position,
		}}
		class="group peer relative flex grid-flow-col items-start gap-4 bg-surface px-4 py-3 text-on-surface surface state-on-surface hover:state-hover"
	>
		<div class="h-14 w-14 shrink-0">
			<img
				src={entry.media?.coverImage?.extraLarge || ""}
				class="h-14 w-14 bg-[image:--bg] bg-cover object-cover"
				style="--bg: url({entry.media?.coverImage?.medium})"
				loading="lazy"
				alt=""
			/>
			<!-- <div class="i hidden p-1 i-12 group-hover:block">more_horiz</div> -->
		</div>
		<a href={PAGES_media_mediaId({ mediaId: entry.media?.id || "" })}>
			<span class="line-clamp-1 text-body-lg text-balance">
				{entry.media?.title?.userPreferred}
			</span>
			<div class="flex flex-wrap gap-1 text-body-md text-on-surface-variant">
				<div>
					<span class="i i-inline">grade</span>
					{entry.score}
				</div>
				&middot;
				<div>
					<span class="i i-inline">timer</span>
					{formatWatch(toWatch(entry))} to watch
				</div>
				&middot;
				<div>
					<span class="i i-inline">next_plan</span>
					{behind(entry)} behind
				</div>
			</div>
		</a>
		<div class="ms-auto shrink-0 text-label-sm text-on-surface-variant">
			<span class="group-hover:hidden">
				{entry.progress}/{entry.media?.episodes}
			</span>
			<form method="post" class="hidden group-hover:inline">
				<input type="hidden" name="mediaId" value={entry.media?.id} />
				<input
					type="hidden"
					name="progress"
					value={(entry.progress ?? 0) + 1}
				/>
				<button type="submit" class={root({ class: "-m-3" })}>
					<div class={content()}>add</div>
				</button>
			</form>
		</div>
	</div>
</div>
