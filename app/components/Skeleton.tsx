export function Skeleton(props) {
	return (
		<div
			{...props}
			className="inline h-[1lh] animate-pulse select-none overflow-hidden rounded-xs bg-surface-container-highest text-transparent"
		></div>
	)
}
