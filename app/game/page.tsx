'use client';
import { use, useEffect, useState } from 'react';
import Button from '../components/Button';
import GameBoard from '../components/GameBoard';
import Scoreboard from '../components/Scoreboard';

import { TimerResult, useTimer } from 'react-timer-hook';
import Link from 'next/link';

function MyTimer({
  timer,
}: {
  timer: TimerResult;
}) {
  const {
    totalSeconds,
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart,
  }: TimerResult = timer

  return (
    <div>
      <div className='inline-block w-14'>
        <span>{minutes.toString().padStart(2, '0')}</span>:
        <span>{seconds.toString().padStart(2, '0')}</span>
      </div>
      <Button onClick={isRunning ? pause : resume}>Play / Pause</Button>
      <Button
        onClick={() => {
          // Restarts to 5 minutes timer
          const time = new Date();
          time.setSeconds(time.getSeconds() + 30);
          restart(time, false);
        }}
      >
        Reset
      </Button>
    </div>
  );
}

type NewHash = {
  [key: string]: number;
}

export type GameState = {
  gameHash: { [key: string]: number };
  boardShape: number[][];
  boardKeys: string[][];
  boardValues: string[][];
  targetNumber: number;
  allowedValues: string[];
  selectedHash: string[];
  guessedValues: string[];
  score: number;
}

/**
 *
 * @returns ReactElement
 */
export default function Game() {

  // create a timer that expires in 30 seconds
  const time = new Date();
  time.setSeconds(time.getSeconds() + 30); // now + 30 seconds
  const timerInstance = useTimer({ expiryTimestamp: time, onExpire: () => toggleNums(), autoStart: false });

  const [showNums, setShowNums] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    gameHash: {},
    boardShape: [
      [0, 3],
      [3, 4],
      [7, 5],
      [12, 4],
      [16, 3],
    ],
    boardKeys: [],
    boardValues: [],
    targetNumber: 0,
    allowedValues: [],
    selectedHash: [],
    guessedValues: [],
    score: 0,
  });

  const newTargetNum = Math.floor(Math.random() * 8 + 8);


  const generateNums = () => {
    console.log('generate nums');
    let newHash: NewHash = {};

    for (let i = 0; i < 19; i++) {
      newHash[String.fromCharCode(65 + i)] = Math.ceil(
        Math.random() * ((newTargetNum / 2) - .5)
      );
    }

    const newAllowedKeys = Object.keys(newHash);
    const newAllowedValues = Object.values(newHash).map(item => item.toString());
    
    const boardKeys = gameState.boardShape.map((item, index) => {
      let result = []
      for (let i = item[0];i < item[0] + item[1];i++) {
        result.push(newAllowedKeys[i])
      }
      return result
    })
    const boardValues = gameState.boardShape.map((item, index) => {
      let result = []
      for (let i = item[0];i < item[0] + item[1];i++) {
        result.push(newAllowedValues[i])
      }
      return result
    })

    setGameState((prev) => ({
      ...prev,
      gameHash: newHash,
      boardKeys: boardKeys,
      boardValues: boardValues,
      allowedValues: newAllowedKeys,
      guessedValues: [],
      targetNumber: newTargetNum,
    }));
    setShowNums(true);

    const time = new Date();
    time.setSeconds(time.getSeconds() + 30);
    timerInstance.restart(time, true);
  };

  // console.log(Object.keys(gameHash).length === 0)
  // if (Object.keys(gameHash).length === 0) {
  //     generateNums()
  // }
  // console.log(gameHash)
  const testGuess = (guessArray: string[]) => {
    // console.log('test guess', guessArray)

    let sortedGuess = guessArray.sort();

    if (gameState.guessedValues.includes(sortedGuess.join(''))) {
      console.log('already guessed');
      setGameState((prev) => ({
        ...prev,
        selectedHash: []
      }));
      return;
    }

    let newScore = gameState.score;
    let combined = sortedGuess.reduce((acc, curr) => {
      return acc + +gameState.gameHash[curr];
    }, 0);

    if (combined === gameState.targetNumber) {
      newScore += 1;
    } else {
      newScore -= 1;
    }

    setGameState((prev) => ({
      ...prev,
      selectedHash: [],
      guessedValues: [...prev.guessedValues, sortedGuess.join('')],
      score: newScore,
    }));
  };

  const toggleSelected = (index: string) => {
    // console.log('handle click', index, gameState.selectedHash)
    let newSelectedHash = gameState.selectedHash;

    if (newSelectedHash.includes(index)) {
      newSelectedHash = newSelectedHash.toSpliced(
        newSelectedHash.indexOf(index),
        1
      );
    } else {
      newSelectedHash.push(index);
    }

    setGameState((prev) => ({
      ...prev,
      selectedHash: newSelectedHash,
    }));

    if (newSelectedHash.length === 3) {
      testGuess(newSelectedHash);
    }
  };

  const toggleNums = () => {
    setShowNums(!showNums);
  };


  // useEffect(() => {
  //   console.log('use effect')
  //   generateNums();
  // }, [])

  const width = (100 / 30) * timerInstance.totalSeconds
  

  return (
    <div>
      <header className='flex justify-center gap-4'>
        <Link href={`/`}>back</Link>
        Hexagons
        <Button onClick={generateNums} text={'New Numbers'} />
        <Button
          onClick={toggleNums}
          text={showNums ? 'Hide Numbers' : 'Show Numbers'}
        />
        <MyTimer timer={timerInstance} />
      </header>
        <div>
          <div className={`bg-slate-50 h-1 transition-all duration-1000 ease-linear`}
          style={{width: `${width}%`}}></div>
        </div>
      <main>
        <section className='py-10'>
          {gameState.boardKeys.length > 0 && <GameBoard
            showNums={showNums}
            gameState={gameState}
            handleClick={toggleSelected}
          />}
        </section>
        <section className='flex justify-center'>
          <Scoreboard showNums={showNums} gameState={gameState} />
        </section>
      </main>
    </div>
  );
}
