import * as Headless from '@headlessui/react'
import React, {
	ComponentPropsWithoutRef,
	createContext,
	FC,
	memo,
	PropsWithChildren,
	ReactNode,
	useContext
} from 'react'
import { classes } from '~/lib/styled'

import * as Dialog from '@radix-ui/react-dialog'

export interface WithChildren {
	children?: ReactNode | undefined
}

// eslint-disable-next-line @typescript-eslint/ban-types
interface DialogProps extends WithChildren {
	defaultOpen?: boolean
}

export function Basic(props: DialogProps) {
	return <Dialog.Root {...props}></Dialog.Root>
}

const DialogContainerContext = createContext<undefined | null | HTMLElement>(undefined)

const DialogWrapper: FC<PropsWithChildren<unknown>> = (props) => {
	const [container, setContainer] = React.useState<HTMLElement | null | undefined>(undefined)

	return (
		<>
			<div ref={setContainer}></div>
			<DialogContainerContext.Provider value={container}>
				{props.children}
			</DialogContainerContext.Provider>
		</>
	)
}

import { DecoratorFn } from '@storybook/react'

export const withDialogWrapper: DecoratorFn = (Story, context) => {
	return (
		<DialogWrapper>
			<Story {...context}></Story>
		</DialogWrapper>
	)
}

interface DialogContentProps extends ComponentPropsWithoutRef<'div'> {
	location?: 'left' | 'right'
}

function Content(props: DialogContentProps) {
	const container = useContext(DialogContainerContext)

	return (
		<Dialog.Portal container={container}>
			<Dialog.Overlay className="fixed inset-0 grid-cols-2 items-center justify-items-center bg-scrim/40 max-h-screen p-12 md:grid lg:p-14 [@supports(height:1dvb)]:max-h-[100dvb]">
				{/* <Dialog.Overlay className="fixed inset-0 -z-10 bg-scrim/40 backdrop-blur-sm" /> */}
				<Dialog.Content
					style={{
						'--col': props.location === 'right' ? 2 : undefined
					}}
					className={classes(
						'col-start-[var(--col)] flex flex-col overflow-hidden rounded-xl bg-surface elevation-3 max-w-[min(100%,35rem)] min-w-[17.5rem] max-h-full h-auto p-6 lg:max-h-[min(100%,35rem)]',
						props.className
					)}
				>
					{props.children}
				</Dialog.Content>
			</Dialog.Overlay>
		</Dialog.Portal>
	)
}

Basic.Container = Content
Basic.Trigger = Dialog.Trigger

function Icon(props: ComponentPropsWithoutRef<'div'>) {
	return (
		<div className={`flex justify-center mb-4 ${props.className}`}>
			<div className="text-secondary w-6 h-6">{props.children}</div>
		</div>
	)
}

Basic.Icon = Icon
function Headline(props: ComponentPropsWithoutRef<'header'>) {
	return (
		<header
			{...props}
			className={classes(`row-start-2 text-headline-sm text-on-surface mb-4`, props.className)}
		></header>
	)
}
Basic.Headline = Headline
function Body(props: ComponentPropsWithoutRef<'section'>) {
	return (
		<section
			className={classes(
				'row-start-3 overflow-auto overscroll-contain text-body-md text-on-surface-variant',
				props.className
			)}
		>
			{props.children}
		</section>
	)
}
Basic.Body = Body

function Actions(props: ComponentPropsWithoutRef<'footer'>) {
	return (
		<footer
			{...props}
			className={classes(`row-start-4 flex justify-end gap-2 mt-6`, props.className)}
		/>
	)
}

Basic.Actions = Actions
export default memo(Basic)

export const FullScreen: React.FC<{
	open?: boolean
	onClose(open: boolean): void
	children?: React.ReactNode
	description?: React.ReactNode
}> & {
	Body: typeof Body
	Header: typeof FullScreenHeader
	Headline: typeof Headline
	Icon: typeof FullScreenIcon
} = (props) => {
	return (
		<Headless.Dialog
			open={props.open}
			onClose={props.onClose}
			className="fixed inset-0 flex max-h-screen supports-[height:1dvb]:max-h-[100dvb]"
		>
			<div className={'grid flex-1 grid-rows-[auto_1fr] overflow-hidden bg-surface'}>
				{props.children}
			</div>

			{props.description && (
				<Headless.Dialog.Description className="hidden">
					{props.description}
				</Headless.Dialog.Description>
			)}

			<Headless.Dialog.Overlay className="fixed inset-0 -z-10 bg-scrim/40 backdrop-blur-sm"></Headless.Dialog.Overlay>
		</Headless.Dialog>
	)
}

function FullScreenHeader(props: ComponentPropsWithoutRef<'header'>) {
	return (
		<header
			{...props}
			className={classes(
				'flex items-center gap-4 truncate text-on-surface h-14 px-4',
				props.className
			)} // scrolled elevation-2
		></header>
	)
}

function FullScreenIcon(props: ComponentPropsWithoutRef<'div'>) {
	return <div {...props} className="w-6 h-6"></div>
}

function FullScreenHeadline(props: ComponentPropsWithoutRef<'h3'>) {
	return (
		<Headless.Dialog.Title
			{...props}
			className="flex-1 truncate text-title-lg"
			as={'h3'}
		></Headless.Dialog.Title>
	)
}

function FullScreenBody(props: { children?: ReactNode }) {
	return (
		<section className="overflow-auto overscroll-contain text-body-md text-on-surface-variant p-6">
			{props.children}
		</section>
	)
}

FullScreen.Icon = FullScreenIcon
FullScreen.Body = FullScreenBody
FullScreen.Header = FullScreenHeader
FullScreen.Headline = FullScreenHeadline
