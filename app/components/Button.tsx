'use client'

export default function Button({onClick, text, children}: {onClick: Function, text?: String, children?: any}) {
    return (
        <button className=" border bg-blue-600 border-slate-900 rounded-lg px-3 py-1" onClick={() => onClick()}>{text}{children}</button>
    )
}