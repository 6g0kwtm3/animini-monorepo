import type { OptionRenderPropArg } from '@headlessui/react'
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { createContext, FC, memo, ReactNode, useCallback, useContext, useState } from 'react'

import * as TextField from './TextField'
import Menu from './Menu'

const SelectContext = createContext<{ value?: string } | null>(null)

function Button(props: Parameters<typeof Listbox.Button>[0]) {
	const ctx = useContext(SelectContext)

	return <Listbox.Button value={ctx?.value} {...props}></Listbox.Button>
}

interface ButtonRenderPropArg {
	open: boolean
	disabled: boolean
}

const Outlined = (props: { name: string; children?: ReactNode; defaultValue?: string }) => {
	const [value, setValue] = useState(props.defaultValue)

	return (
		<Listbox value={value} onChange={setValue} name={props.name}>
			<Listbox.Button>
				{({ open }: ButtonRenderPropArg) => (
					<TextField.Outlined
						{...props}
						value={value}
						readOnly
						trailing={
							<TextField.Outlined.TrailingIcon>
								{open ? <ChevronUpIcon></ChevronUpIcon> : <ChevronDownIcon></ChevronDownIcon>}
							</TextField.Outlined.TrailingIcon>
						}
						className={open ? 'cursor-pointer border-primary' : 'cursor-pointer'}
					>
						State
					</TextField.Outlined>
				)}
			</Listbox.Button>
			<Listbox.Options as="div" className={'focus:outline-none'}>
				<Menu>{props.children}</Menu>
			</Listbox.Options>
		</Listbox>
	)
}

Outlined.displayName = 'Select.Outlined'

export const Option: FC<{ value: string; children: string }> = (props) => {
	return (
		<Listbox.Option
			value={props.value}
			//  className={useCallback(({ active, selected }) => '',[])}
		>
			{useCallback(
				({ active, selected }: OptionRenderPropArg) => (
					<Menu.Item className={active ? '[--state-opacity:.12] hover:![--state-opacity:.12]' : ''}>
						<Menu.Item.Icon>{selected && <CheckIcon></CheckIcon>}</Menu.Item.Icon>
						{props.children}
					</Menu.Item>
				),
				[props.children]
			)}
		</Listbox.Option>
	)
}
Option.displayName = 'Option'

// function EnumTextField(props) {
//   return (
//     <TextField

//       {...props}
//       value={Object.entries(State).find(([, value]) => value === props.value)?.[0]}
//     ></TextField>
//   )
// }

// Simple.args = {
//   name: 'score',
//   defaultValue: State.Florida,
//   children: (
//     <>
//       <Select.Button
//         as={EnumTextField}
//         readOnly
//         className={useCallaback(({ open }) => (open ? 'border-primary' : ''),[])}
//       >

//       </Select.Button>

export default Object.assign(memo(Outlined), {
	Option,
	Button
})
