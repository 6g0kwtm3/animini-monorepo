import fs from "node:fs/promises"
import path from "node:path"
import YAML from "yaml"
import JSON5 from "comment-json"

if (import.meta.main) {
	const pnpmLock = await fs.readFile("./pnpm-lock.yaml", "utf-8")
	const [, pnpmLockData] = YAML.parseAllDocuments(pnpmLock)

	Promise.all(
		Object.entries(pnpmLockData.toJS().importers).map(
			async ([
				packagePath,
				{ dependencies, devDependencies, peerDependencies },
			]) => {
				const references = Object.entries({
					...dependencies,
					...devDependencies,
					...peerDependencies,
				}).flatMap(([name, { specifier, version }]) => {
					const [empty, path] = version.split("link:", 2)
					if (empty !== "") {
						return []
					}
					return [{ path }]
				})

				try {
					const newLocal = path.resolve(packagePath, "tsconfig.json")
					const config = await fs.readFile(newLocal, "utf-8")
					const tsConfig = JSON5.parse(config)
					await fs.writeFile(
						newLocal,
						JSON5.stringify(JSON5.assign(tsConfig, { references }), null, 2)
					)
				} catch (e) {
					if (e.code === "ENOENT") {
						return
					} else {
						throw e
					}
				}
			}
		)
	)
}
