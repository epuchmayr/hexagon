import React from 'react';
import Button from '../components/Button';
import { TimerResult, useTimer } from 'react-timer-hook';

interface GameHeaderProps {
  // Define the props for your component here
}


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

const GameHeader: React.FC<GameHeaderProps> = (props) => {
  // Implement your component logic here
  // create a timer that expires in 30 seconds
  const time = new Date();
  time.setSeconds(time.getSeconds() + 30); // now + 30 seconds
  const timerInstance = useTimer({ expiryTimestamp: time, onExpire: () => toggleNums() });

  return (
    // JSX code for your component's UI goes here
    <div>
      
      Hexagons
        <Button onClick={generateNums} text={'Generate Numbers'} />
        <Button
          onClick={toggleNums}
          text={showNums ? 'Hide Numbers' : 'Show Numbers'}
        />
        <MyTimer timer={timerInstance} />
    </div>
  );
};

export default GameHeader;
