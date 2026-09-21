import { afterEach } from "node:test"
import "temporal-polyfill-lite/global"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { RateLimiter } from "./RateLimiter"

beforeEach(() => {
	void vi.stubGlobal("navigator", { locks: new FakeLockManager() })
	void vi.stubGlobal("localStorage", new FakeStorage())
	void vi.useFakeTimers()
})

afterEach(() => {
	void vi.unstubAllGlobals()
	void vi.useRealTimers()
})

class FakeLockManager {
	private held = false
	private waiters: (() => void)[] = []

	async request<T>(name: string, callback: () => Promise<T>): Promise<T> {
		while (this.held) {
			await new Promise<void>((resolve) => void this.waiters.push(resolve))
		}
		this.held = true
		try {
			return await callback()
		} finally {
			this.held = false
			this.waiters.shift()?.()
		}
	}
}

class FakeStorage implements Storage {
	get length(): number {
		return this.data.size
	}

	private data = new Map<string, string>()

	clear(): void {
		this.data.clear()
	}

	getItem(key: string): null | string {
		return this.data.get(key) ?? null
	}

	key(index: number): null | string {
		return [...this.data.keys()][index] ?? null
	}

	removeItem(key: string): void {
		void this.data.delete(key)
	}

	setItem(key: string, value: string): void {
		void this.data.set(key, value)
	}
}

void describe("Basic functionality", () => {
	it("should execute functions immediately when within rate limit", async () => {
		const limiter = new RateLimiter("test", [
			{ limit: 3, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const results: number[] = []
		const promises = [
			limiter.execute(() => void results.push(1)),
			limiter.execute(() => void results.push(2)),
			limiter.execute(() => void results.push(3)),
		]

		await Promise.all(promises)
		expect(results).toEqual([1, 2, 3])
	})

	it("should delay execution when rate limit is exceeded", async () => {
		const limiter = new RateLimiter("test", [
			{ limit: 2, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const results: number[] = []
		const startTime = Date.now()

		const promises = [
			limiter.execute(() => void results.push(1)),
			limiter.execute(() => void results.push(2)),
			limiter.execute(() => {
				void results.push(3)
				return Date.now() - startTime
			}),
		]

		await vi.runAllTimersAsync()
		const resolved = await Promise.all(promises)

		expect(results).toEqual([1, 2, 3])
		expect(resolved[2]).toBeGreaterThanOrEqual(1000)
	})

	it("should handle multiple batches correctly", async () => {
		const limiter = new RateLimiter("test", [
			{ limit: 2, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const results: number[] = []
		const timings: number[] = []
		const startTime = Date.now()

		const promises = Array.from({ length: 6 }, (_, i) =>
			limiter.execute(() => {
				void results.push(i + 1)
				void timings.push(Date.now() - startTime)
			})
		)

		await vi.runAllTimersAsync()
		await Promise.all(promises)

		expect(results).toEqual([1, 2, 3, 4, 5, 6])
		// First batch: 1,2 at ~0ms
		expect(timings[0]).toBeLessThan(10)
		expect(timings[1]).toBeLessThan(10)
		// Second batch: 3,4 at ~1000ms
		expect(timings[2]).toBeGreaterThanOrEqual(1000)
		expect(timings[3]).toBeGreaterThanOrEqual(1000)
		// Third batch: 5,6 at ~2000ms
		expect(timings[4]).toBeGreaterThanOrEqual(2000)
		expect(timings[5]).toBeGreaterThanOrEqual(2000)
	})
})

void describe("Concurrency", () => {
	it("should handle concurrent execute calls", async () => {
		const limiter = new RateLimiter("test", [
			{ limit: 1, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const results: number[] = []
		const promises = [
			limiter.execute(async () => {
				await new Promise((resolve) => setTimeout(resolve, 10))
				void results.push(1)
			}),
			limiter.execute(() => {
				void results.push(2)
			}),
		]

		await vi.runAllTimersAsync()
		await Promise.all(promises)

		expect(results).toEqual([1, 2])
	})
})

void describe("Edge cases", () => {
	it("should handle limit of 1", async () => {
		const limiter = new RateLimiter("test", [
			{ limit: 1, per: Temporal.Duration.from({ milliseconds: 500 }) },
		])

		const results: number[] = []
		const timings: number[] = []
		const startTime = Date.now()

		const promises = [
			limiter.execute(() => {
				void results.push(1)
				void timings.push(Date.now() - startTime)
			}),
			limiter.execute(() => {
				void results.push(2)
				void timings.push(Date.now() - startTime)
			}),
		]

		await vi.runAllTimersAsync()
		await Promise.all(promises)

		expect(results).toEqual([1, 2])
		expect(timings[0]).toBeLessThan(10)
		expect(timings[1]).toBeGreaterThanOrEqual(500)
	})

	it("should handle large number of queued items", async () => {
		const limiter = new RateLimiter("test", [
			{ limit: 5, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const results: number[] = []
		const promises = Array.from({ length: 20 }, (_, i) =>
			limiter.execute(() => void results.push(i + 1))
		)

		await vi.runAllTimersAsync()
		await Promise.all(promises)

		expect(results).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
	})
})

void describe("Cross-tab", () => {
	it("should share the rate limit across limiter instances", async () => {
		const first = new RateLimiter("test", [
			{ limit: 1, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])
		const second = new RateLimiter("test", [
			{ limit: 1, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const results: string[] = []
		await first.execute(() => {
			void results.push("first")
			return "first"
		})
		expect(results).toEqual(["first"])

		const secondRun = second.execute(() => {
			void results.push("second")
			return "second"
		})
		expect(results).toEqual(["first"])

		await vi.runAllTimersAsync()
		await secondRun

		expect(results).toEqual(["first", "second"])
	})
})

void describe("Config changes", () => {
	it("should apply the new limits over a stored ledger from a previous version", async () => {
		void vi.useRealTimers()

		const storage = new FakeStorage()
		void vi.stubGlobal("localStorage", storage)
		storage.setItem(
			"test",
			JSON.stringify([
				{ limit: 2, perMs: 60000, timestamps: [Date.now(), Date.now()] },
			])
		)

		const limiter = new RateLimiter("test", [
			{ limit: 4, per: new Temporal.Duration(0, 0, 0, 0, 0, 1) },
		])

		const outcome = await Promise.race([
			limiter.execute(() => "granted"),
			new Promise<string>((resolve) =>
				setTimeout(() => {
					resolve("waited")
				}, 200)
			),
		])

		expect(outcome).toBe("granted")
	})
})
