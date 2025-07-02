import {
	useCallback,
	useEffect,
	useState,
	type Dispatch,
	type SetStateAction,
} from "react"

export function useStorage<T = undefined>(
	storage: Storage,
	key: string
): [T | undefined, Dispatch<SetStateAction<T | undefined>>]
export function useStorage<T>(
	storage: Storage,
	key: string,
	initialState: T | (() => T)
): [T, Dispatch<SetStateAction<T>>]
export function useStorage<T>(
	storage: Storage,
	key: string,
	initialState?: T | (() => T)
): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
	const [state, setState] = useState<T | undefined>((): T | undefined => {
		const state = storage.getItem(key)
		if (state !== null) {
			return JSON.parse(state)
		}
		if (initialState instanceof Function) {
			return initialState()
		}
		return initialState
	})

	useEffect(() => {
		return storageObserver.subscribe((e) => {
			if (e.key === key && e.storageArea === storage) {
				if (e.newValue !== null) {
					setState(JSON.parse(e.newValue))
				} else {
					setState(initialState)
				}
			}
		})
	}, [])

	return [
		state,
		useCallback((nextState) => {
			setState((prevState) => {
				if (nextState instanceof Function) {
					nextState = nextState(prevState)
				}
				storage.setItem(key, JSON.stringify(nextState))
				return nextState
			})
		}, []),
	]
}

class Observer<T> {
	private callbacks = new Set<(value: T) => void>()
	private destructor?: () => void

	constructor(private make: (emit: (value: T) => void) => () => void) {}

	subscribe(callback: (value: T) => void) {
		const wrapped = (value: T) => {
			callback(value)
		}
		this.callbacks.add(wrapped)

		const destructor = (this.destructor ??= this.make((value) => {
			for (const callback of this.callbacks) {
				callback(value)
			}
		}))

		return () => {
			this.callbacks.delete(wrapped)
			if (this.callbacks.size === 0) {
				destructor()
				this.destructor = undefined
			}
		}
	}
}

const storageObserver = new Observer<StorageEvent>((emit) => {
	const controller = new AbortController()
	window.addEventListener("storage", emit, controller)
	return () => {
		controller.abort()
	}
})

export function useSessionStorage<T = undefined>(
	key: string
): [T | undefined, Dispatch<SetStateAction<T | undefined>>]
export function useSessionStorage<T>(
	key: string,
	initialState?: T | (() => T)
): [T, Dispatch<SetStateAction<T>>]
export function useSessionStorage<T>(
	key: string,
	initialState?: T | (() => T)
) {
	return useStorage(sessionStorage, key, initialState)
}

export function useLocalStorage<T = undefined>(
	key: string
): [T | undefined, Dispatch<SetStateAction<T | undefined>>]
export function useLocalStorage<T>(
	key: string,
	initialState?: T | (() => T)
): [T, Dispatch<SetStateAction<T>>]
export function useLocalStorage<T>(key: string, initialState?: T | (() => T)) {
	return useStorage(localStorage, key, initialState)
}
