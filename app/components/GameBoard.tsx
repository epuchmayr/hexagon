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
  const boardArray = [];
  
  // console.log('gameState', gameState)

  let allowedValues = gameState.allowedValues;
  let offsetTop = 0
  let offsetBottom = 0
  let boardMiddle = Math.floor(gameState.boardKeys.length / 2)

  if (gameState.selectedHash.length === 1) {
    for (let row in gameState.boardKeys) {
      const gb = gameState.boardKeys
      let rowValues = gb[row];
      
      if (rowValues.includes(gameState.selectedHash[0])) {
        let index = rowValues.indexOf(gameState.selectedHash[0]);

        allowedValues = [
          gb[row][index-1], gb[row][index], gb[row][index+1]
        ];

        if (+row > boardMiddle) {
          offsetTop = +1
        }
        if (+row < boardMiddle) {
          offsetBottom = +1
        }

        let topAllowed = (+row > 0) ? [gb[+row-1][index-1+offsetTop], gb[+row-1][index+offsetTop]] : []
        let bottomAllowed = (+row < gameState.boardKeys.length -1) ? [gb[+row+1][index-1+offsetBottom], gb[+row+1][index+offsetBottom]] : []

        allowedValues.push(
          ...topAllowed,
          ...bottomAllowed,
        );

      }
    }
  }

  if (gameState.selectedHash.length === 2) {
    let rows: string[][] = []
    let coords: number[][] = []

    for (let row in gameState.boardKeys) {
      const gb = gameState.boardKeys
      let rowValues = gb[row];

      for (let selected of gameState.selectedHash) {
        if (rowValues.includes(selected) && !rows.flat().includes(selected)) {
          rows.push(rowValues)
          coords.push([+row, rowValues.indexOf(selected)])
        }
      }

    }

    allowedValues = [...gameState.selectedHash]

    if (rows.length > 1) {

      if (coords[0][1] === coords[1][1]) {

        if (coords[0][0] === boardMiddle) {
          offsetTop = -1
        }
        if (coords[0][0]+1 === boardMiddle) {
          offsetBottom = -1
        }

      } else {
        if (coords[0][0] === boardMiddle) {
          offsetBottom = -1
        }
        if (coords[0][0]+1 === boardMiddle) {
          offsetTop = -1
        }
        if (coords[0][0]+2 === boardMiddle) {
          offsetBottom = +1
        }
        if (coords[0][0] > boardMiddle) {
          offsetTop = +1
          offsetBottom = -1
        }
      }

        if (coords[0][0] > 0) {
          allowedValues.push(gameState.boardKeys[coords[0][0]-1][coords[0][1]+offsetTop])
        }
        if (coords[0][0] < gameState.boardShape.length - coords.length) {
          console.log('bottom', coords[0][0]+2, coords[0][1]+offsetBottom)
          allowedValues.push(gameState.boardKeys[coords[0][0]+2][coords[1][1]+offsetBottom])
        }
    } else {
      // console.log('1 row', rows[0].indexOf(gameState.selectedHash[0]))
      let matchIndex = rows[0].indexOf(gameState.selectedHash.sort()[0])
      allowedValues = [rows[0][matchIndex-1], rows[0][matchIndex], rows[0][matchIndex+1], rows[0][matchIndex+2]]
    }
  }
  // console.log('allowed values',allowedValues, gameState.selectedHash)

  for (let row in gameState.boardShape) {
    boardArray.push(
      <div key={`Key-${row}`} className='board-row'>
        {gameState.boardValues[row].map((value, index) => {
          // console.log(values, index, gameState.selectedHash.includes(index))
          // console.log('boardArr', value, row,  index)
          
          let hexKey = gameState.boardKeys[row][index]
          let hexVal = gameState.boardValues[row][index]
          let stringVal = showNums ? hexVal : hexKey

          return (
            <Hexagon
              key={index}
              value={stringVal}
              selected={gameState.selectedHash.includes(hexKey)}
              allowed={allowedValues.includes(hexKey)}
              handleClick={() => handleClick(hexKey)}
            />
          );
        })}
      </div>
    );
  }

  return <div className='flex flex-col items-center'>{boardArray}</div>;
}
