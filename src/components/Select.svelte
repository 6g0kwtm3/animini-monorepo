<script lang="ts">
	import { createSelect, melt } from "@melt-ui/svelte"
	import type { NonEmptyArray } from "effect/ReadonlyArray"
	import { type Snippet } from "svelte"
	import { menu as menu_ } from "~/lib/menu"
	import { textField } from "~/lib/textField"
	import TextFieldOutlined from "./TextFieldOutlined.svelte"
	import TextFieldOutlinedLabel from "./TextFieldOutlinedLabel.svelte"
	import TextFieldOutlinedTrailingIcon from "./TextFieldOutlinedTrailingIcon.svelte"

	const {
		options,
		option: option_,
		button,
		children: children_,
		defaultValue = options[0],
		name,
		...props
	} = $props<{
		name: string
		defaultValue?: string
		children: Snippet
		options: NonEmptyArray<string>
		option: Snippet<string>
		button?: Snippet<string>
	}>()

	const { input, root: root_ } = textField({})
	const { root, item } = menu_()

	const {
		elements: { trigger, menu, option, group, groupLabel, label, hiddenInput },
		states: { selectedLabel, open, selected },
		helpers: { isSelected },
	} = createSelect({
		forceVisible: true,
		positioning: {
			placement: "bottom",
			fitViewport: true,
			sameWidth: true,
		},
		name,
		defaultSelected: {
			label: defaultValue,
			value: defaultValue,
		},
	})
</script>

<!-- 
{#await Promise.resolve()}
	<TextFieldOutlined>
		<select
			value={defaultValue}
			{name}
			class={input({ class: "appearance-none" })}
		>
			{#each options as option__}
				<option
					value={option__}
					class="bg-surface-container text-label-lg text-on-surface surface elevation-2"
				>
					{@render option_(option__)}
				</option>
			{/each}
		</select>
		<TextFieldOutlinedLabel>{@render children()}</TextFieldOutlinedLabel>
		<TextFieldOutlinedTrailingIcon class="pointer-events-none absolute right-0">
			<span class="i i-6">expand_more</span>
		</TextFieldOutlinedTrailingIcon>
	</TextFieldOutlined>
{:then _} -->
<TextFieldOutlined>
	{#snippet children()}
		<input use:melt={$hiddenInput} />
		<button
			type="button"
			class={input({ class: "cursor-default" })}
			use:melt={$trigger}
		>
			{#if button}
				{@render button($selectedLabel)}
			{:else}
				{@render option_($selectedLabel)}
			{/if}
		</button>

		<TextFieldOutlinedLabel>
			{@render children_()}
		</TextFieldOutlinedLabel>

		<TextFieldOutlinedTrailingIcon class="pointer-events-none absolute right-0">
			<span class="i i-6">expand_more</span>
		</TextFieldOutlinedTrailingIcon>
	{/snippet}
</TextFieldOutlined>

{#if $open}
	<div
		use:melt={$menu}
		class={root({
			class: "group z-10 max-h-[300px]",
		})}
	>
		{#each options as option__}
			<div
				class={item({
					class:
						"data-[highlighted]:state-focus group-[:not(:has([data-highlighted]))]:data-[selected]:state-focus",
				})}
				use:melt={$option({ label: option__, value: option__ })}
			>
				{@render option_(option__)}
			</div>
		{/each}
	</div>
{/if}
<!-- {/await} -->
