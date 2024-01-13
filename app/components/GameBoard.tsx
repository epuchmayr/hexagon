import Hexagon from '../components/Hexagon';
import { GameState } from '../game/page';

export default function GameBoard({
  showNums,
  gameState,
  handleClick,
}: {
  showNums: Boolean;
  gameState: GameState;
  handleClick: Function;
}) {
  const gameObject = gameState.gameHash;
  const boardArray = [];
  const group = [
    [0, 3],
    [3, 4],
    [7, 5],
    [12, 4],
    [16, 3],
  ];
  
  let values: Array<string | number> = [];

  if (showNums) {
    values = Object.values(gameObject);
  } else {
    values = Object.keys(gameObject);
  }

  const hexArray = values.map((value, index) => {
    // console.log(values, index, gameState.selectedHash.includes(index))
    return (
      <Hexagon
        key={index}
        value={values[index]}
        selected={gameState.selectedHash.includes(index)}
        handleClick={() => handleClick(index)}
      />
    );
  });

  for (let row of group) {
    boardArray.push(
      <div key={`Key-${row}`} className='board-row'>
        {hexArray.slice(row[0], row[0] + row[1])}
      </div>
    );
  }

  return <div className='flex flex-col items-center'>{boardArray}</div>;
}
