import { Slot } from '@radix-ui/react-slot'
import { ComponentPropsWithoutRef, createContext, ReactNode, useContext, useState } from 'react'
import { classes } from '~/lib/styled'
const TextFieldContext = createContext<InputProps | null>(null)

interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'className'> {
	supporting?: ReactNode
	leading?: ReactNode
	trailing?: ReactNode
	error?: boolean
	className:
		| ComponentPropsWithoutRef<'input'>['className']
		| {
				label?: ComponentPropsWithoutRef<'div'>['className']
				input?: ComponentPropsWithoutRef<'input'>['className']
		  }
}

// & {
//   Suffix: typeof Suffix
//   Prefix: typeof Prefix
//   Icon: typeof Icon
//   Input: typeof Input
//   Label: typeof Label
// }

export function Outlined({
	children,
	supporting,
	error,
	trailing,
	leading,
	defaultValue,
	...props
}: InputProps) {
	const [internalValue, setValue] = useState(defaultValue)
	const value = props.value ?? internalValue

	return (
		<div>
			<label className="group relative flex items-center">
				<TextFieldContext.Provider
					value={{
						...props,
						error,
						leading,
						value
					}}
				>
					{leading}
					<input
						{...props}
						value={value}
						placeholder=" "
						onChange={(e) => {
							setValue?.(e.currentTarget.value)
							props?.onChange?.(e)
						}}
						className={classes(
							props.disabled
								? 'text-on-surface/[.38]'
								: error
								? 'text-on-surface caret-error'
								: 'text-on-surface caret-primary',
							'peer flex flex-1 appearance-none items-center bg-transparent text-body-lg placeholder-transparent outline-none min-w-0 min-h-[3.5rem] px-4 [text-align:inherit] focus:ring-0 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden',
							typeof props.className === 'string' ? props.className : props.className?.input
						)}
					/>
					<Label
						className={classes(
							// leading ? 'group-focus-within:peer-placeholder-shown:left-4 left-4 peer-placeholder-shown:left-12' : 'left-4',

							// !props.disabled && 'group-focus-within:peer-placeholder-shown:-top-2',
							// '-top-2'

							leading ? 'peer-placeholder-shown:left-12' : '',
							!props.disabled &&
								'group-focus-within:peer-placeholder-shown:-top-2 group-focus-within:peer-placeholder-shown:left-4',
							'-top-2 left-4'
						)}
					>
						{children}
					</Label>
					<fieldset
						className={classes(
							props.disabled
								? 'border-outline/[.12]'
								: error
								? 'border-error group-focus-within:border-error group-hover:border-on-error-container group-hover:group-focus-within:border-error'
								: 'border-outline group-focus-within:border-primary group-hover:border-on-surface group-hover:group-focus-within:border-primary',
							'border-1 absolute -top-[10px] left-0 right-0 bottom-0 rounded-xs border px-3 group-focus-within:border-2'
						)}
					>
						<legend
							className={classes(
								!props.disabled && 'group-focus-within:max-w-none',
								value ? 'max-w-none' : 'max-w-0',
								'overflow-hidden whitespace-nowrap opacity-0 transition-all'
							)}
						>
							<span className="text-label-sm px-1">{children}</span>
						</legend>
					</fieldset>
					{trailing}
				</TextFieldContext.Provider>
			</label>

			<p
				className={classes(
					props.disabled
						? 'text-on-surface/[.38]'
						: error
						? 'text-error'
						: 'text-on-surface-variant',

					'gap-4 text-body-sm px-4 pt-1'
				)}
			>
				{supporting}
			</p>
		</div>
	)
}

export function Filled({
	children,
	supporting,
	error,
	trailing,
	leading,
	defaultValue,
	...props
}: InputProps) {
	const [internalValue, setValue] = useState(defaultValue)
	const value = props.value ?? internalValue

	return (
		<div className="">
			<label
				className={classes(
					props.disabled
						? 'before:border-on-surface/[.38]'
						: error
						? 'before:border-error after:border-error focus-within:after:scale-x-100 hover:before:border-on-error-container'
						: 'before:border-on-surface-variant after:border-primary focus-within:after:scale-x-100 hover:before:border-on-surface',
					!props.disabled && 'hover:state-hover',
					'group relative flex items-center overflow-hidden rounded-t-xs bg-surface-variant surface state-on-surface-variant before:absolute before:left-0 before:bottom-0 before:border-b before:w-full after:absolute after:left-0 after:bottom-0 after:scale-x-0 after:border-b-2 after:transition-transform after:w-full focus-within:hover:state-none',
					props.className
				)}
			>
				<TextFieldContext.Provider
					value={{
						...props,
						error,
						leading,
						value
					}}
				>
					{leading}
					<input
						{...props}
						value={value}
						placeholder=" "
						onChange={(e) => {
							setValue?.(e.currentTarget.value)
							props?.onChange?.(e)
						}}
						className={classes(
							props.disabled
								? 'text-on-surface/[.38]'
								: error
								? 'text-on-surface caret-error'
								: 'text-on-surface caret-primary',
							'peer flex flex-1 appearance-none items-center bg-transparent text-body-lg placeholder-transparent outline-none min-w-0 min-h-[3.5rem] px-4 pt-6 pb-2 [text-align:inherit] focus:ring-0 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden',
							props.className
						)}
					/>
					<Label
						className={classes(
							leading ? 'left-12' : 'left-4',
							!props.disabled && 'group-focus-within:peer-placeholder-shown:top-2',
							'top-2'
						)}
					>
						{children}
					</Label>
					{trailing}
				</TextFieldContext.Provider>
			</label>

			<p
				className={classes(
					props.disabled
						? 'text-on-surface/[.38]'
						: error
						? 'text-error'
						: 'text-on-surface-variant',

					'gap-4 text-body-sm px-4 pt-1'
				)}
			>
				{supporting}
			</p>
		</div>
	)
}

function Label(props) {
	const input = useContext(TextFieldContext) ?? {}
	const Component = props.asChild ? Slot : 'div'

	return (
		<>
			<Component
				{...props}
				className={classes(
					input.disabled
						? 'text-on-surface/[.38]'
						: input.error
						? 'text-error group-hover:text-on-error-container group-hover:group-focus-within:text-error'
						: 'group-hover:on-surface text-on-surface-variant group-focus-within:text-primary',

					!input.disabled && 'group-focus-within:peer-placeholder-shown:text-body-sm',

					'pointer-events-none absolute text-body-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-body-lg',
					props.className
				)}
			></Component>
		</>
	)
}

function LeadingIcon(props) {
	const input = useContext(TextFieldContext) ?? {}

	return (
		<div
			{...props}
			className={classes(
				input.disabled ? 'text-on-surface/[.38]' : 'text-on-surface-variant',
				'w-5 h-5 ml-3'
			)}
		/>
	)
}

function TrailingIcon(props) {
	const input = useContext(TextFieldContext) ?? {}

	return (
		<div
			{...props}
			className={classes(
				input.disabled
					? 'text-on-surface/[.38]'
					: input.error
					? 'text-error group-hover:text-on-error-container group-hover:group-focus-within:text-error'
					: 'text-on-surface-variant',
				'w-6 h-6 mr-3'
			)}
		/>
	)
}

function Suffix(props: ComponentPropsWithoutRef<'span'>) {
	return (
		<span
			{...props}
			className="flex items-center text-body-lg text-on-surface-variant -ml-5"
		></span>
	)
}

function Prefix(props: ComponentPropsWithoutRef<'span'>) {
	return (
		<span
			{...props}
			className="flex items-center text-body-lg text-on-surface-variant -mr-5"
		></span>
	)
}

Outlined.Prefix = Prefix
Outlined.TrailingIcon = TrailingIcon
Outlined.Suffix = Suffix
Outlined.LeadingIcon = LeadingIcon
Outlined.displayName = 'TextField.Outlined'

Filled.Prefix = Prefix
Filled.TrailingIcon = TrailingIcon
Filled.Suffix = Suffix
Filled.LeadingIcon = LeadingIcon
Filled.displayName = 'TextField.Filled'

export default Outlined

// name="score"
// inputProps={{
//   type: 'numerical',
//   min: 0,
//   max: 100
// }}
// defaultValue={entry?.score ?? undefined}
// label="Score"
