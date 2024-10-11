import type { ReactNode } from "react"
import React from "react"
import ReactRelay, { type Environment } from "react-relay"
import environment from "./environment"

const { RelayEnvironmentProvider: RelayEnvironmentProvider_ } = ReactRelay
const RelayEnvironmentProvider__ =
	RelayEnvironmentProvider_ as unknown as React.FC<{
		environment: Environment
		children: ReactNode
	}>

export default function RelayEnvironment(props: { children: ReactNode }) {

	return (
		<RelayEnvironmentProvider__ environment={environment}>
			{props.children}
		</RelayEnvironmentProvider__>
	)
}
