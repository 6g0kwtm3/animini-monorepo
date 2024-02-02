export function Skeleton(props) {
	return (
		<div
			{...props}
			className="h-[1lh] animate-pulse overflow-hidden rounded-xs bg-surface-container-highest text-transparent inline select-none"
		></div>
	)
}
