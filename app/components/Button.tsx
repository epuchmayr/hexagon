'use client'

export default function Button({action, text}: {action: Function, text: String}) {
    return (
        <button className=" border bg-blue-600 border-slate-900 rounded-lg px-3 py-1" onClick={() => action()}>{text}</button>
    )
}