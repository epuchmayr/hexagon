'use client'

export default function Button({action, text}: {action: Function, text: String}) {
    return (
            <button className=" border border-slate-900" onClick={() => action()}>{text}</button>
    )
}