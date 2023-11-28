<script>
	import { tv } from "tailwind-variants"


	import TextFieldOutlined from "~/components/TextFieldOutlined.svelte"
    import TextFieldOutlinedInput from "~/components/TextFieldOutlinedInput.svelte"
    import TextFieldOutlinedLabel from "~/components/TextFieldOutlinedLabel.svelte"

	import { LINKS_authorize } from "~/lib/ROUTES"
	import { btn } from "~/lib/button"

    const ANILIST_CLIENT_ID = 3455

    const btnTextIcon = tv({base:"w-[1.125rem] h-[1.125rem]"})

</script>
<main>
    <form action="" method="post" class="grid gap-2">
      <TextFieldOutlined>
        <TextFieldOutlinedInput
       
       
        >
        {#snippet render(props)}
            <textarea   {...props}  name="token" />
        {/snippet}
        </TextFieldOutlinedInput>
        <TextFieldOutlinedLabel>Token</TextFieldOutlinedLabel>
      </TextFieldOutlined>

      <footer class="flex justify-end gap-2">
       
          <a
            target="_blank"
            href={LINKS_authorize(      {
                client_id: String(ANILIST_CLIENT_ID),
              })}
            rel="noreferrer"
            class={btn({})}
          >
            <div class={btnTextIcon ({})}>
              <img
                loading="lazy"
                src="https://anilist.co/img/icons/icon.svg"
                alt=""
              />
            </div>
            <span>Get token</span>
          </a>
      
        <button type="submit" class={btn({variant:"filled"})}>Login</button>
      </footer>
    </form>
  </main>