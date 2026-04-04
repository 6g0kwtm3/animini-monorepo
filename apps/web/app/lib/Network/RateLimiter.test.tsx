import "temporal-polyfill-lite/global"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { RateLimiter } from "./RateLimiter"

void describe("RateLimiter", () => {
	beforeEach(() => {
		void vi.useFakeTimers()
	})

	afterEach(() => {
		void vi.restoreAllMocks()
	})

	void describe("Basic functionality", () => {
		it("should execute functions immediately when within rate limit", async () => {
			const limiter = new RateLimiter({
				limit: 3,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

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
			const limiter = new RateLimiter({
				limit: 2,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

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
			const limiter = new RateLimiter({
				limit: 2,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

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

	void describe("Error handling", () => {
		it("should propagate errors from executed functions", async () => {
			const limiter = new RateLimiter({
				limit: 1,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

			const error = new Error("Test error")
			const promise = limiter.execute(() => {
				throw error
			})

			await expect(promise).rejects.toThrow("Test error")
		})

		it("should continue processing queue after an error", async () => {
			const limiter = new RateLimiter({
				limit: 2,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

			const results: number[] = []
			const promises = [
				expect(
					limiter.execute(() => {
						return Promise.reject(new Error("First error"))
					})
				).rejects.toThrow("First error"),
				expect(
					limiter.execute(() => Promise.resolve(results.push(1)))
				).resolves.toBe(1),
				expect(
					limiter.execute(() => Promise.resolve(results.push(2)))
				).resolves.toBe(2),
			]

			await vi.runAllTimersAsync()

			await Promise.all(promises)
			expect(results).toEqual([1, 2])
		})
	})

	void describe("Concurrency", () => {
		it("should handle concurrent execute calls", async () => {
			const limiter = new RateLimiter({
				limit: 1,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

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
			const limiter = new RateLimiter({
				limit: 1,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 0, 500), // 500ms
			})

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
			const limiter = new RateLimiter({
				limit: 5,
				per: new Temporal.Duration(0, 0, 0, 0, 0, 1),
			})

			const results: number[] = []
			const promises = Array.from({ length: 20 }, (_, i) =>
				limiter.execute(() => void results.push(i + 1))
			)

			await vi.runAllTimersAsync()
			await Promise.all(promises)

			expect(results).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
		})
	})
})
