import { matchSorter } from "match-sorter"
import {
	useDeferredValue,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
	type ComponentProps,
	type ComponentRef,
	type ReactNode,
} from "react"
import getCaretCoordinates from "textarea-caret"
import { Ariakit } from "~/lib/ariakit"
import { createMenu } from "~/lib/menu"
import { createTextFieldInput } from "~/lib/textField"

const keywords = [
	"tags",
	"status",
	"score",
	"format",
	"to_watch",
	"asc",
	"desc",
	"progress",
	"media-status",
]

const values: Record<string, string[]> = {
	status: ["WATCHING", "CURRENT", "PLANNING", "REPEATING", "PAUSED", "DROPPED"],
}

const triggers = ["+", ...keywords.map((keyword) => `${keyword}:`)]

function getList(trigger: string | null) {
	if (typeof trigger !== "string") {
		return []
	}

	if (trigger === "+") {
		return keywords
	}

	return values[trigger] ?? []
}

function getValue(listValue: string, trigger: string | null) {
	if (trigger === "+") {
		return listValue + ":"
	}
	return listValue
}

function getTriggerOffset(element: HTMLTextAreaElement, triggers: string[]) {
	const { value, selectionStart } = element
	for (let i = selectionStart; i >= 0; i--) {
		const char = value[i]
		if (char && triggers.includes(char)) {
			return i
		}
	}
	return -1
}

function getTrigger(element: HTMLTextAreaElement, triggers: string[]) {
	const { value, selectionStart } = element
	const previousChar = value[selectionStart - 1]
	if (!previousChar) return null
	const secondPreviousChar = value[selectionStart - 2]
	const isIsolated = !secondPreviousChar || /\s/.test(secondPreviousChar)
	if (!isIsolated) return null
	if (triggers.includes(previousChar)) return previousChar
	return null
}

function getSearchValue(element: HTMLTextAreaElement, triggers: string[]) {
	const offset = getTriggerOffset(element, triggers)
	if (offset === -1) return ""
	return element.value.slice(offset + 1, element.selectionStart)
}

function getAnchorRect(element: HTMLTextAreaElement, triggers: string[]) {
	const offset = getTriggerOffset(element, triggers)
	const { left, top, height } = getCaretCoordinates(element, offset + 1)
	const { x, y } = element.getBoundingClientRect()
	return {
		x: left + x - element.scrollLeft,
		y: top + y - element.scrollTop,
		height,
	}
}

function replaceValue(
	offset: number,
	searchValue: string,
	displayValue: string
) {
	return (prevValue: string) => {
		const nextValue = `${
			prevValue.slice(0, offset) + displayValue
		} ${prevValue.slice(offset + searchValue.length + 1)}`
		return nextValue
	}
}

export function FilterInput(props: ComponentProps<"textarea">): ReactNode {
	const ref = useRef<ComponentRef<"textarea">>(null)
	const [value, setValue] = useState("")
	const [trigger, setTrigger] = useState<string | null>(null)
	const [caretOffset, setCaretOffset] = useState<number | null>(null)

	const combobox = Ariakit.useComboboxStore()

	const searchValue = Ariakit.useStoreState(combobox, "value")
	const deferredSearchValue = useDeferredValue(searchValue)

	const matches = useMemo(() => {
		return matchSorter(getList(trigger), deferredSearchValue, {
			baseSort: (a, b) => (a.index < b.index ? -1 : 1),
		}).slice(0, 10)
	}, [trigger, deferredSearchValue])

	const hasMatches = !!matches.length

	useLayoutEffect(() => {
		combobox.setOpen(hasMatches)
	}, [combobox, hasMatches])

	useLayoutEffect(() => {
		if (caretOffset != null) {
			ref.current?.setSelectionRange(caretOffset, caretOffset)
		}
	}, [caretOffset])

	// Re-calculates the position of the combobox popover in case the changes on
	// the textarea value have shifted the trigger character.
	useEffect(() => combobox.render(), [combobox, value])

	const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
		if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
			combobox.hide()
		}
	}

	const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const trigger = getTrigger(event.target, triggers)
		const searchValue = getSearchValue(event.target, triggers)
		// If there's a trigger character, we'll show the combobox popover. This can
		// be true both when the trigger character has just been typed and when
		// content has been deleted (e.g., with backspace) and the character right
		// before the caret is the trigger.
		if (trigger) {
			setTrigger(trigger)
			combobox.show()
		}
		// There will be no trigger and no search value if the trigger character has
		// just been deleted.
		else if (!searchValue) {
			setTrigger(null)
			combobox.hide()
		}
		// Sets our textarea value.
		setValue(event.target.value)
		// Sets the combobox value that will be used to search in the list.
		combobox.setValue(searchValue)
	}

	const onItemClick = (value: string) => () => {
		const textarea = ref.current
		if (!textarea) return
		const offset = getTriggerOffset(textarea, triggers)
		const displayValue = getValue(value, trigger)
		if (!displayValue) return
		setTrigger(null)
		setValue(replaceValue(offset, searchValue, displayValue))
		const nextCaretOffset = offset + displayValue.length + 1
		setCaretOffset(nextCaretOffset)
	}

	const textField = createTextFieldInput()
	const menu = createMenu()

	return (
		<div className={textField.container()}>
			<div className={textField.containerBefore()} />
			<div className="group/suffix peer relative flex flex-1 items-center">
				<Ariakit.Combobox
					store={combobox}
					autoSelect
					value={value}
					// We'll overwrite how the combobox popover is shown, so we disable
					// the default behaviors.
					showOnClick={false}
					showOnChange={false}
					showOnKeyPress={false}
					// To the combobox state, we'll only set the value after the trigger
					// character (the search value), so we disable the default behavior.
					setValueOnChange={false}
					className={textField.input({})}
					render={
						<textarea
							{...props}
							ref={ref}
							placeholder={"+format:TV"}
							// We need to re-calculate the position of the combobox popover
							// when the textarea contents are scrolled.
							onScroll={combobox.render}
							// Hide the combobox popover whenever the selection changes.
							onPointerDown={combobox.hide}
							onChange={onChange}
							onKeyDown={onKeyDown}
						/>
					}
				/>
			</div>
			<div className={textField.containerAfter()} />

			<Ariakit.ComboboxPopover
				store={combobox}
				hidden={!hasMatches}
				unmountOnHide
				fitViewport
				getAnchorRect={() => {
					const textarea = ref.current
					if (!textarea) return null
					return getAnchorRect(textarea, triggers)
				}}
				className={menu.root({ className: "z-50" })}
			>
				{matches.map((value) => (
					<Ariakit.ComboboxItem
						key={value}
						value={value}
						focusOnHover
						onClick={onItemClick(value)}
						className={menu.item()}
					>
						<span>{value}</span>
					</Ariakit.ComboboxItem>
				))}
			</Ariakit.ComboboxPopover>
		</div>
	)
}
