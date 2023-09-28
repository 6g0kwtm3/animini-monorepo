import { Listbox } from '@headlessui/react'
import { memo } from 'react'
import { classes } from '~/lib/styled'

{
	/* <FormControl>
<InputLabel id="status">Status</InputLabel>
<Mui.Select
  name="status"
  labelId="status"
  label="Status"
  defaultValue={entry?.status ?? undefined}
>
  {Object.entries(MediaListStatus).map(([key, value]) => (
    <Mui.MenuItem value={value} key={key}>
      {key}
    </Mui.MenuItem>
  ))}
</Mui.Select>
</FormControl> */
}

Listbox
Listbox.Button

export const Menu = (props) => {
	return (
		<div className="relative">
			<ul
				className={classes(
					'min-w-28 absolute top-0 rounded-xs bg-surface text-label-lg text-on-surface elevation-2 max-w-[280px] w-full py-2',
					props.className
				)}
			>
				{props.children}
			</ul>
		</div>
	)
}

Menu.displayName = 'Menu'

export const Item = (props) => {
	return (
		<div
			className={classes(
				'flex items-center gap-3 bg-gradient-to-r from-on-surface/[var(--state-opacity)] to-on-surface/[var(--state-opacity)] h-12 px-3 hover:[--state-opacity:.08]',
				props.className
			)}
		>
			{props.children}
		</div>
	)
}

Item.displayName = 'Item'
Item.Icon = (props) => {
	return <div {...props} className="text-on-surface-variant w-6 h-6"></div>
}

export default Object.assign(memo(Menu), {
	Item
})
