export class RateLimiter {
	private processing = false
	private queue = new Array<() => Promise<void>>()

	private timestamps = new Array<Temporal.Instant>()

	constructor(private args: { limit: number; per: Temporal.Duration }) {}

	execute<T>(fn: () => T): Promise<Awaited<T>> {
		return new Promise<Awaited<T>>((resolve, reject) => {
			void this.queue.push(async () => {
				try {
					resolve(await fn())
				} catch (error) {
					if (error instanceof Error) {
						reject(error)
					} else {
						reject(new Error(`RateLimiter execution failed`, { cause: error }))
					}
				}
			})
			void this.run().catch(() => {
				//
			})
		})
	}

	async run() {
		if (this.processing) return
		this.processing = true

		while (this.queue.length > 0) {
			const now = Temporal.Now.instant()

			// Remove timestamps older than window
			this.timestamps = this.timestamps.filter(
				(t) => t.add(this.args.per).epochMilliseconds > now.epochMilliseconds
			)

			if (this.timestamps.length >= this.args.limit) {
				const earliest = this.timestamps[0]
				if (!earliest) {
					throw new Error(
						"RateLimiter timestamps is empty when trying to process"
					)
				}
				const nextAllowed = earliest.add(this.args.per)

				const waitMs = nextAllowed.epochMilliseconds - now.epochMilliseconds
				await new Promise((r) => setTimeout(r, waitMs))
				continue
			}

			const fn = this.queue.shift()
			if (!fn) {
				throw new Error("RateLimiter queue is empty when trying to process")
			}
			void this.timestamps.push(Temporal.Now.instant())
			void fn()
		}

		this.processing = false
	}
}
