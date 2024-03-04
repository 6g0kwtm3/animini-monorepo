import { ReactNode } from "react";

export function Prose(props: { children: ReactNode }) {
	return (
		<div className="prose [[data-theme='dark']_&]:prose-invert" {...props} />
	)
}