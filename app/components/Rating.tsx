import {
  FaceSmileIcon as EmojiHappyIcon,
  FaceFrownIcon as EmojiSadIcon,
} from "@heroicons/react/24/outline"
import { StarIcon } from "@heroicons/react/24/solid"
import type { ReactNode} from "react";
import { memo } from "react"

 const point3Icons = [
  <EmojiSadIcon
    key="face-frown"
    className="text-gray-300 dark:text-gray-500 h-6 w-6 hover:scale-110 hover:text-error peer-checked:text-error group-hover:peer-checked:opacity-40 group-hover:peer-checked:hover:opacity-100 "
  />,
  <EmojiHappyIcon
    key="face-smile-1"
    className="text-gray-300 dark:text-gray-500 h-6 w-6 hover:scale-110 hover:text-tertiary peer-checked:text-tertiary group-hover:peer-checked:opacity-40 group-hover:peer-checked:hover:opacity-100 "
  />,
  <EmojiHappyIcon
    key="face-smile-2"
    className="text-gray-300 dark:text-gray-500 h-6 w-6 hover:scale-110 hover:text-primary peer-checked:text-primary group-hover:peer-checked:opacity-40 group-hover:peer-checked:hover:opacity-100 "
  />,
]
export const point5Icons = Array.from({ length: 5 }, (_, i) => (
  <>
    <div
      key={i}
      className="hover:text-yellow-400 peer-checked:text-yellow-400 absolute left-0 top-0 flex text-transparent group-hover:peer-checked:opacity-40 group-hover:peer-checked:hover:opacity-100"
    >
      {Array.from({ length: 5 - i }, (_, j) => (
        <StarIcon className="h-6 w-6 hover:scale-110" key={j}></StarIcon>
      ))}
    </div>

    <StarIcon
      key={`bg-${i}`}
      className="text-gray-300 dark:text-gray-500 h-6 w-6"
    ></StarIcon>
  </>
))

const Rating = (props: {
  defaultValue: number
  children: ReactNode[]
  name: string
}) => {
  return (
    <div className="flex">
      <div className="group relative flex">
        {props.children.map((icon, i, { length }) => (
          <label
            id={String(length - i)}
            aria-label={String(length - i)}
            key={i}
          >
            <input
              name={props.name}
              type="radio"
              className="peer hidden"
              defaultChecked={props.defaultValue === length - i}
              value={length - i}
            />
            {icon}
          </label>
        ))}
      </div>
    </div>
  )
}

export default memo(Rating)
