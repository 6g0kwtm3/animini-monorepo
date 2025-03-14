import type { ReactNode } from "react"
import { numberToString } from "~/lib/numberToString"

// const point3Icons = [
// 	<EmojiSadIcon
// 		key="face-frown"
// 		className="text-gray-300 dark:text-gray-500 h-6 w-6 hover:scale-110 hover:text-error peer-checked:text-error peer-checked:group-hover:opacity-40 hover:peer-checked:group-hover:opacity-100 "
// 	/>,
// 	<EmojiHappyIcon
// 		key="face-smile-1"
// 		className="text-gray-300 dark:text-gray-500 h-6 w-6 hover:scale-110 hover:text-tertiary peer-checked:text-tertiary peer-checked:group-hover:opacity-40 hover:peer-checked:group-hover:opacity-100 "
// 	/>,
// 	<EmojiHappyIcon
// 		key="face-smile-2"
// 		className="text-gray-300 dark:text-gray-500 h-6 w-6 hover:scale-110 hover:text-primary peer-checked:text-primary peer-checked:group-hover:opacity-40 hover:peer-checked:group-hover:opacity-100 "
// 	/>
// ]

// const point5Icons = Array.from({ length: 5 }, (_, index) => (
// 	<>
// 		<div
// 			key={index} data-key={index}
// 			className="hover:text-yellow-400 peer-checked:text-yellow-400 absolute left-0 top-0 flex text-transparent peer-checked:group-hover:opacity-40 hover:peer-checked:group-hover:opacity-100"
// 		>
// 			{Array.from({ length: 5 - index }, (_, i) => (
// 				<StarIcon className="h-6 w-6 hover:scale-110" key={i} data-key={i} />
// 			))}
// 		</div>

// 		<StarIcon
// 			key={`bg-${index} data-key={`bg-${index}`}
// 			className="text-gray-300 dark:text-gray-500 h-6 w-6"
// 		/>
// 	</>
// ))

export const Rating = (props: {
	defaultValue: number
	children: ReactNode[]
	name: string
}): ReactNode => {
	return (
		<div className="flex">
			<div className="group relative flex">
				{props.children.map((icon, index, { length }) => (
					<label
						id={numberToString(length - index)}
						aria-label={numberToString(length - index)}
						key={index}
						data-key={index}
					>
						<input
							name={props.name}
							type="radio"
							className="peer hidden"
							defaultChecked={props.defaultValue === length - index}
							value={length - index}
						/>
						{icon}
					</label>
				))}
			</div>
		</div>
	)
}
