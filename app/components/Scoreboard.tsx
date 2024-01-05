import { GameState } from '../game/page';

export default function Scoreboard({ showNums, gameState }: { showNums: Boolean, gameState: GameState }) {

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