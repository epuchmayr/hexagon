"use client"
import { MouseEventHandler, useState } from "react"
import Button from "../components/Button"
import PreviousMap from "postcss/lib/previous-map"

// const gameHash: {string: number | null} = {}
// let showNums = true


function Hexagon({ value, handleClick, selected }: { value: string, handleClick: MouseEventHandler, selected: Boolean }) {
    return (
        <button
            className={`hex w-10 leading-10 selected-${selected}`}
            onClick={handleClick}
        >
            <span className="top"></span>
            {value}
            <span className="bot"></span>
        </button>
    )
}
function ScoreBoard({ showNums, gameState }: { showNums: Boolean, gameState: GameState }) {

    return (
        <>
            {!showNums && (
                <div className="flex items-center gap-2">
                    <div className="border border-slate-300 p-2 text-center rounded bg-purple-50">

                        <div>Target</div>
                        {gameState.targetNumber}

                    </div>
                    <div className="border border-slate-300 p-2 text-center rounded">
                        <div>Score</div>
                        {gameState.score}
                    </div>
                </div>
            )}
        </>
    )
}

function GameBoard({ showNums, gameState, handleClick }: { showNums: Boolean, gameState: GameState }) {

    const gameObject = gameState.gameHash
    const boardArray = []
    const group = [[0, 3], [3, 4], [7, 5], [12, 4], [16, 3]]
    let values: string[] = []

    if (showNums) {
        values = Object.values(gameObject)
    } else {
        values = Object.keys(gameObject)
    }

    const hexArray = values.map((value, index) => {
        // console.log(values, index, gameState.selectedHash.includes(index))
        return <Hexagon
            key={index}
            value={values[index]}
            selected={gameState.selectedHash.includes(index)}
            handleClick={() => handleClick(index)}
        />
    })

    for (let row of group) {
        boardArray.push(
            <div key={`Key-${row}`} className="board-row">
                {hexArray.slice(row[0], row[0] + row[1])}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            {boardArray}
        </div>
    )
}

interface NewHash {
    [key: string]: number
}
interface GameState {
    gameHash: {};
    selectedHash: number[];
    targetNumber: number;
    score: number;
}

export default function Game() {
    const [showNums, setShowNums] = useState(true)
    const [gameState, setGameState] = useState<GameState>({
        gameHash: {},
        selectedHash: [],
        targetNumber: 0,
        score: 0,
    })

    const newTargetNum = Math.floor((Math.random() * 8) + 8)

    const generateNums = () => {
        console.log('generate nums')
        let newHash: NewHash = {}
        for (let i = 0; i < 19; i++) {
            newHash[String.fromCharCode(65 + i)] = Math.ceil(Math.random() * (newTargetNum / 2))
        }
        setGameState(prev => ({
            ...prev,
            gameHash: newHash,
            targetNumber: newTargetNum
        }))
    }

    // console.log(Object.keys(gameHash).length === 0)
    // if (Object.keys(gameHash).length === 0) {
    //     generateNums()
    // }
    // console.log(gameHash)
    const testGuess = (guessArray) => {
        let newScore = gameState.score
        let combined = guessArray.reduce((acc, curr) => {
            return acc + +gameState.gameHash[Object.keys(gameState.gameHash)[curr]]
        }, 0)

        if (combined === gameState.targetNumber) {
            newScore += 1
        } else {
            newScore -= 1
        }

        setGameState(prev => ({
            ...prev,
            selectedHash: [],
            score: newScore,
        }))

    }

    const toggleSelected = (index) => {

        let newSelectedHash = gameState.selectedHash

        if (newSelectedHash.includes(index)) {
            newSelectedHash = newSelectedHash.toSpliced(newSelectedHash.indexOf(index), 1)
        } else {
            newSelectedHash.push(index)
        }

        setGameState(prev => ({
            ...prev,
            selectedHash: newSelectedHash
        }))

        if (newSelectedHash.length === 3) {
            testGuess(newSelectedHash)
        }
    }

    const toggleNums = () => {
        setShowNums(!showNums)
    }

    return (
        <div>
            <header className="flex justify-center gap-4">
                Hexagons
                <Button action={generateNums} text={'Generate Numbers'} />
                <Button action={toggleNums} text={'Toggle Numbers'} />
            </header>
            <main>
                <section className="py-10">
                    <GameBoard showNums={showNums} gameState={gameState} handleClick={toggleSelected} />
                </section>
                <section className="flex justify-center">
                    <ScoreBoard showNums={showNums} gameState={gameState} />
                </section>
            </main>
        </div>
    )
}