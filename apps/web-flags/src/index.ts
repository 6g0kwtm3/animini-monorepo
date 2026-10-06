import { cloudflareKV } from "@flaghoist/adapter-cloudflare-kv"
import { apiKey, bearerToken, createFlagServer } from "@flaghoist/server"
import { dashboardHtml } from "@flaghoist/server/dashboard"

export default createFlagServer((env) => ({
	storage: cloudflareKV(env.FLAGS),
	auth: { admin: bearerToken(env.ADMIN_TOKEN), read: apiKey(env.READ_API_KEY) },
	users: { pepper: env.AUTH_PEPPER },
	dashboard: dashboardHtml,
	allowedOrigins: Object.assign([], {
		filter: () => Object.assign([], { includes: () => true }),
	}),
}))
