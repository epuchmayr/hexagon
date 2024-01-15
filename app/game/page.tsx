'use client';
import { use, useEffect, useState } from 'react';
import Button from '../components/Button';
import GameBoard from '../components/GameBoard';
import Scoreboard from '../components/Scoreboard';

import { TimerResult, useTimer } from 'react-timer-hook';

function MyTimer({
  timer,
}: {
  timer: TimerResult;
}) {
  const {
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

interface NewHash {
  [key: string]: number;
}

export interface GameState {
  gameHash: { [key: string]: number };
  selectedHash: number[];
  targetNumber: number;
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
  const timerInstance = useTimer({ expiryTimestamp: time, onExpire: () => toggleNums() });

  const [showNums, setShowNums] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    gameHash: {},
    selectedHash: [],
    targetNumber: 0,
    score: 0,
  });

  const newTargetNum = Math.floor(Math.random() * 8 + 8);


  const generateNums = () => {
    console.log('generate nums');
    let newHash: NewHash = {};

    for (let i = 0; i < 19; i++) {
      newHash[String.fromCharCode(65 + i)] = Math.ceil(
        Math.random() * (newTargetNum / 2)
      );
    }

    setGameState((prev) => ({
      ...prev,
      gameHash: newHash,
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
  const testGuess = (guessArray: number[]) => {
    let newScore = gameState.score;
    let combined = guessArray.reduce((acc, curr) => {
      return acc + +gameState.gameHash[Object.keys(gameState.gameHash)[curr]];
    }, 0);

    if (combined === gameState.targetNumber) {
      newScore += 1;
    } else {
      newScore -= 1;
    }

    setGameState((prev) => ({
      ...prev,
      selectedHash: [],
      score: newScore,
    }));
  };

  const toggleSelected = (index: number) => {
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


  useEffect(() => {
    generateNums();
  }, [])

  return (
    <div>
      <header className='flex justify-center gap-4'>
        Hexagons
        <Button onClick={generateNums} text={'Generate Numbers'} />
        <Button
          onClick={toggleNums}
          text={showNums ? 'Hide Numbers' : 'Show Numbers'}
        />
        <MyTimer timer={timerInstance} />
      </header>
      <main>
        <section className='py-10'>
          <GameBoard
            showNums={showNums}
            gameState={gameState}
            handleClick={toggleSelected}
          />
        </section>
        <section className='flex justify-center'>
          <Scoreboard showNums={showNums} gameState={gameState} />
        </section>
      </main>
    </div>
  );
}
