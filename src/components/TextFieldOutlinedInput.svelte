<script lang="ts" generics="T extends HTMLInputAttributes & {
    render?: Snippet<T>
}">
	import type { Snippet } from "svelte"
	import { textField } from "~/lib/textField"
    import type {HTMLInputAttributes } from 'svelte/elements'


    interface NoRender extends HTMLInputAttributes {
        render:never
    }

    type NarrowPick<T,K extends keyof T> = {
        [I in keyof T]: I extends K?     T[I]: never 
    }

    type Pretty<T> = {[K in keyof T]:T[K]} & {}

    type RenderProps = Pretty<NarrowPick<HTMLInputAttributes,"class"|"type"|"placeholder">
>

    type Props = ({render:Snippet<RenderProps>} & {
        [K in keyof HTMLInputAttributes]:never
    }) | NoRender




    const { render, ...props } = $props<Props>()

	const { input } = textField()

    const renderProps :RenderProps= {
        type:'text',
        placeholder: " ",
        class: input({ class: props.class }),
    }  

</script>

{#if render}
{@render render(renderProps) }
{:else}
<input {...renderProps} {...props}/>
{/if}