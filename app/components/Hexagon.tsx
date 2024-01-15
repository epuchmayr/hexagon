
import { MouseEventHandler } from "react"

export default function Hexagon({ value, handleClick, selected }: { value: string, handleClick: MouseEventHandler, selected: Boolean }) {
  return (
      <button
          className={`hex w-10 selected-${selected}`}
          onClick={handleClick}
      >
          <span className="top"></span>
          {value}
          <span className="bot"></span>
      </button>
  )
}