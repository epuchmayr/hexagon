
import { MouseEventHandler } from "react"

export default function Hexagon({ value, handleClick, selected, allowed }: { value: string, handleClick: MouseEventHandler, selected: Boolean, allowed: Boolean }) {
  return (
      <button
          className={`hex w-10 selected-${selected} allowed-${allowed}`}
          onClick={handleClick}
          disabled={!allowed}
      >
          <span className="top"></span>
          {value}
          <span className="bot"></span>
      </button>
  )
}